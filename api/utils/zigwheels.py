from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from requests import get
from lxml import etree
from os import path
from json import load

informationRouter = APIRouter(prefix='/information')
htmlParser = etree.HTMLParser()
URL = 'https://www.zigwheels.my/new-cars/{}/{}'

MAKE_MODEL_MAP_PATH = path.join(path.dirname(__file__), 'zigwheels_map.json')
with open(MAKE_MODEL_MAP_PATH, 'r', encoding='utf-8') as f:
    MAKE_MODEL_MAP = load(f)


class AboutResponse(BaseModel):
    model_name: str
    description: str
    price_range: str
    pros: list[str]
    cons: list[str]
    variants: list[str]

class PricingResponse(BaseModel):
    Variant_Name: str
    Off_Road_Price: str
    Road_Tax: str
    Registration_Fee: str
    Plate_No_Registration_Fee: str
    On_Road_Price: str

class Specs(BaseModel):
    Dimensions_Capacity: dict[str, str] | None = None
    Engine_Details: dict[str, str] | None = None
    Performance: dict[str, str] | None = None
    Steering: dict[str, str] | None = None
    Suspension_Brakes: dict[str, str] | None = None
    Transmission: dict[str, str] | None = None
    Wheel_Tyre: dict[str, str] | None = None

class SpecificationsResponse(BaseModel):
    Variant_Name: str
    Tags: list[str]
    Otr_Price: str
    Specs: Specs

class Features(BaseModel):
    Comfort_Convenience: dict[str, str] | None = None
    Entertainment_Communication: dict[str, str] | None = None
    Instrumentation: dict[str, str] | None = None
    Seats_Upholstery: dict[str, str] | None = None
    Exterior: dict[str, str] | None = None
    Interior: dict[str, str] | None = None
    Safety: dict[str, str] | None = None
    Security: dict[str, str] | None = None

class FeaturesResponse(BaseModel):
    Variant_Name: str
    Tags: list[str]
    Otr_Price: str
    Features: Features

def get_details(keys: list[str], tab_panels: list[etree._Element]):
    # tab_panels is a list of ul elements from tab_panels
    result = {}
    for i, key in enumerate(keys):
        details = tab_panels[i].xpath(f'.//li/span')
        details = {details[i*2].text.strip().replace(' ', '_'): details[(i*2) + 1].text.replace('\xa0', ' ') for i in range(int(len(details)/2))}
        
        result[key.replace('& ', '').replace(' ', '_')] = details

    return result


@informationRouter.get('/about', summary='Retrieves basic information about the specified vehicle model', response_model=AboutResponse)
def about(make: str, model: str):
    html = get(URL.format(make.replace(' ', '-'), model.replace(' ', '-')), headers={'User-Agent': 'Mozilla/5.0'})
    if not html.ok and not html.status_code == 200:
        raise HTTPException(500, "An unexpected error occured")

    tree = etree.fromstring(html.text, htmlParser)
    variants = tree.xpath('//*[@id="sec-variants"]/div[2]/div[1]/table/tbody/tr/td[1]/span/a') # BYD Dolphin
    return {
        'model_name': tree.xpath('/html/body/main/div/div[1]/h2')[0].text,
        'description': tree.xpath('/html/body/main/div/div[1]/div[2]/p')[0].text,
        'price_range': tree.xpath('/html/body/div[3]/div/div/div[2]/section/div[1]/span[1]')[0].text.strip().replace('\xa0', ' '),
        'pros': [i.text for i in tree.xpath('//*[@id="pros-content"]/p/span')],
        'cons': [i.text for i in tree.xpath('//*[@id="cons-content"]/p/span')],
        'variants': [i.text.strip().title() for i in variants],
    }


@informationRouter.post('/pricing', summary='Retrieves price data of the vehicle model variant(s)', response_model=list[PricingResponse])
def price(make: str, model: str, variants: list[str] = []):
    html = get((URL+'/price').format(make.replace(' ', '-'), model.replace(' ', '-')), headers={'User-Agent': 'Mozilla/5.0'})
    if not html.ok and not html.status_code != 200:
        raise HTTPException(500, "An unexpected error occured")
    
    tree = etree.fromstring(html.text, htmlParser)
    variants_groups = tree.xpath('/html/body/main/div/div[1]/section[1]/div/div')
    response = []

    for variant in variants_groups:
        variant_name = make.title()+ ' ' + " ".join(variant.xpath('.//p')[0].text.strip().split(' ')[0:-1])
        if variants and variant_name not in variants: continue

        price_details = variant.xpath('.//div/div/table/tbody/tr/td')
        response.append({ 'Variant_Name': variant_name } | {
            price_details[i*2].text.strip().replace(' ', '_'): price_details[(i*2) + 1].text.replace('\xa0', ' ') for i in range(int(len(price_details)/2))
        })
    return response


@informationRouter.post('/specifications', summary='Retrieves technical specifications of the vehicle model variant(s)', response_model=list[SpecificationsResponse])
def specifications(make: str, model: str, variants: list[str] = []):
    html = get((URL+'/specifications').format(make.replace(' ', '-'), model.replace(' ', '-')), headers={'User-Agent': 'Mozilla/5.0'})
    if not html.ok and not html.status_code == 200:
        raise HTTPException(500, "An unexpected error occured")
    
    tree = etree.fromstring(html.text, htmlParser)
    variants_groups = tree.xpath('//*[@id="sec-variants"]/div/div')
    response = []

    for variant in variants_groups:
        variant_details = variant.xpath('.//div[1]/span')
        variant_name = f'{make.title()} {model.title()} ' + variant_details[0].text.strip()
        if variants and variant_name not in variants: continue

        spec_keys = [key.text.strip() for key in variant.xpath('.//div[2]/ul/li')]
        if len(spec_keys) <= 0:
            details_url = f"https://www.zigwheels.my/variant/variant-feature?variantId={variant.attrib.get('data-variantid')}&categorySlug=cars&langCode=en&pageType=specification"
            details_html = get(details_url, headers={'User-Agent': 'Mozilla/5.0'})
            if not details_html.ok and details_html.status_code == 200:
                raise HTTPException(500, "An unexpected error occured")
            
            details_tree = etree.fromstring(details_html.text, htmlParser)
            spec_keys = [key.text.strip() for key in details_tree.xpath('//*[@id="specification"]/ul/li')]
            details_specifications = details_tree.xpath('//*[@id="specification"]/div/ul')
        else:
            details_specifications = variant.xpath('.//div[2]/div/ul')

        response.append({
            'Variant_Name': variant_name,
            'Tags': variant_details[1].text.strip().split(', '),
            'Otr_Price': variant_details[2].text.strip().replace('\xa0', ' '),
            'Specs': get_details(spec_keys, details_specifications),
        })

    return response


@informationRouter.post('/features', summary='Retrieves features of the vehicle model variant(s)', response_model=list[FeaturesResponse])
def features(make: str, model: str, variants: list[str] = []):
    html = get((URL+'/specifications').format(make.replace(' ', '-'), model.replace(' ', '-')), headers={'User-Agent': 'Mozilla/5.0'})
    if not html.ok and not html.status_code == 200:
        raise HTTPException(500, "An unexpected error occured")
    
    tree = etree.fromstring(html.text, htmlParser)
    variants_groups = tree.xpath('//*[@id="modelFeatureSection"]/div/div')
    response = []

    for variant in variants_groups:
        variant_details = variant.xpath('.//div[1]/span')
        variant_name = f'{make.title()} {model.title()} ' + variant_details[0].text.strip()
        if variants and variant_name not in variants: continue

        feat_keys = [key.text.strip() for key in variant.xpath('.//div[2]/ul/li')]
        if len(feat_keys) <= 0:
            details_url = f"https://www.zigwheels.my/variant/variant-feature?variantId={variant.attrib.get('data-variantid')}&categorySlug=cars&langCode=en&pageType=specification"
            details_html = get(details_url, headers={'User-Agent': 'Mozilla/5.0'})
            if not details_html.ok and details_html.status_code == 200:
                raise HTTPException(500, "An unexpected error occured")
            
            details_tree = etree.fromstring(details_html.text, htmlParser)
            feat_keys = [key.text.strip() for key in details_tree.xpath('//*[@id="feature"]/ul/li')]
            details_specifications = details_tree.xpath('//*[@id="feature"]/div/ul')
        else:
            details_specifications = variant.xpath('.//div[2]/div/ul')

        response.append({
            'Variant_Name': variant_name,
            'Tags': variant_details[1].text.strip().split(', '),
            'Otr_Price': variant_details[2].text.strip().replace('\xa0', ' '),
            'Features': get_details(feat_keys, details_specifications),
        })

    return response


@informationRouter.get('/all_vehicles')
def vehicle_map(make: str = None, model: str = None):
    # Return full map if no make specified
    if not make: return MAKE_MODEL_MAP

    # Normalize make name
    normalized_make = make.replace(' ', '-')

    # Validate make exists
    if normalized_make not in MAKE_MODEL_MAP:
        raise HTTPException(404, f'Unknown make provided: {make}')

    make_data = MAKE_MODEL_MAP[normalized_make]

    # Return all models for make if no model specified
    if not model: return make_data

    # Validate model exists
    if model not in make_data:
        raise HTTPException(404, f'Unknown model provided: {model}')

    # Return specific model variants
    return make_data[model]
    

# def generate_model_map():
#     all_brands = ['Perodua', 'Proton', 'Honda', 'Toyota', 'Nissan', 'Mazda', 'Suzuki', 'Volkswagen', 'Mercedes Benz', 'Mitsubishi', 'BMW', 'Audi', 'Kia', 'Hyundai', 'Volvo', 'Ford', 'MG', 'Daihatsu', 'Smart', 'Aston Martin', 'Bentley', 'Chery', 'Citroen', 'Ferrari', 'Infiniti', 'Isuzu', 'Jaguar', 'Jeep', 'Lamborghini', 'Land Rover', 'Lexus', 'Lotus', 'Maserati', 'Maxus', 'McLaren', 'Mini', 'Peugeot', 'Porsche', 'Renault', 'Rolls Royce', 'Subaru', 'Tesla', 'BYD', 'Denza', 'Dongfeng', 'Foton', 'GAC', 'GWM', 'ICAUR', 'JAC', 'JAECOO', 'Jetour', 'LEAPMOTOR', 'Neta', 'XPENG', 'ZEEKR']
#     result = {}
#     for brand in all_brands:
#         normalized_brand = brand.lower().replace(' ', '-')
#         model_url = f'https://www.zigwheels.my/new-cars/{normalized_brand}'
#         print(model_url)

#         html = get(model_url, headers={'User-Agent': 'Mozilla/5.0'})
#         if not html.ok and not html.status_code == 200:
#             return HTTPException(500, "An unexpected error occured")

#         tree = etree.fromstring(html.text, htmlParser)
#         models = tree.xpath("//*[@id='listing-card']/li[contains(@data-page-id,'1')]")

#         result[normalized_brand] = {}
#         for model in models:
#             model_name = model.xpath('.//div[2]/a[1]')[0].text.strip().lower().replace(' ', '-')
#             variants = [i.text.strip().lower().replace(' ', '-') for i in model.xpath('.//div[2]/div[3]/div/div[2]/div[1]/table/tbody/tr/td[1]')]

#             result[normalized_brand][model_name] = variants

#     return result

# with open('zigwheels_map.json', 'x') as f:
#     model_map = generate_model_map()
#     dump(model_map, f)
