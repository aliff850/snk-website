from fastapi import APIRouter
from pydantic import BaseModel
from requests import get
from lxml import etree

informationRouter = APIRouter(prefix='/information')
htmlParser = etree.HTMLParser()
URL = 'https://www.zigwheels.my/new-cars/{}/{}'

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
        raise ValueError('An unexpected error occured.')

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
    if not html.ok and not html.status_code == 200:
        raise ValueError('An unexpected error occured.')
    
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
        raise ValueError('An unexpected error occured.')
    
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
                raise ValueError('An unexpected error occured.')
            
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
        raise ValueError('An unexpected error occured.')
    
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
                raise ValueError('An unexpected error occured.')
            
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