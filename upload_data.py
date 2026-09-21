import os
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client
from uuid import uuid5, NAMESPACE_OID
from numpy import nan

load_dotenv('.env')

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") # Uses service role key for admin bulk writes

if not url or not key:
    print("Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from your .env file!")
    exit(1)

supabase: Client = create_client(url, key)

print("Loading Excel datasets...")
private_raw = pd.read_excel('datasets/private.xlsx')
motorcycle_raw = pd.read_excel('datasets/motorcycle.xlsx')
light_raw = pd.read_excel('datasets/light.xlsx')
heavy_raw = pd.read_excel('datasets/heavy.xlsx')
toyota_raw = pd.read_excel('datasets/toyota.xlsx')

print("Cleaning and formatting data...")
private = private_raw.rename(columns=str.lower).drop(
    columns=['uom (unit of measurement', 'import status'] + list(private_raw.columns[-1:].str.lower())).rename(
    columns={'quater 1 jan 2026 snk medium west value\n(round up)': 'value',
            'import status (short)': 'import_status',
            'capacity': 'cc',
            'family': 'model'}).replace({'RECOND': 'RCN'})

toyota = toyota_raw.rename(columns=str.lower).drop(
    columns=['peninsular malaysia'] + list(toyota_raw.columns[-7:].str.lower()), index=0).rename(
    columns={'unnamed: 11': 'value', 'family': 'model'})
toyota.insert(loc=0, column="import_status", value=None)

motorcycle = motorcycle_raw.rename(columns=str.lower).drop(
    columns=['unit of measurement(uom)', 'import status'] + list(motorcycle_raw.columns[-5:].str.lower())).rename(
    columns={'family': 'model', 'capacity': 'cc', 'import status (short)': 'import_status', 'q1 jan 2026 west value': 'value'})

light = light_raw.rename(columns=str.lower).drop(
    columns=['body type in bm', 'import status'] + list(light_raw.columns[-2:].str.lower())).rename(
    columns={'body type in english ': 'style', 'import status.1': 'import_status', ' west mv july 2025 ': 'value'})
light.insert(loc=0, column="series", value=None)

heavy = heavy_raw.rename(columns=str.lower).drop(
    columns=['body type in bm', 'import status'] + list(heavy_raw.columns[-3:-2].str.lower())).rename(
    columns={'body type in english': 'style', 'import status.1': 'import_status', 'west mv jan 2026': 'value'})

columns = ['category', 'make', 'model', 'variant', 'series', 'year', 'cc', 'import_status', 'transmission', 'style', 'value', 'specs']

def organize(df):
    sample = df.copy()
    specs_col = df.columns.difference(columns)
    sample['specs'] = sample[specs_col].apply(lambda row: row.dropna().to_dict(), axis=1)
    sample['id'] = sample[columns[1:-2]].apply(lambda row: str(uuid5(NAMESPACE_OID, ','.join(row.dropna().astype(str).to_list()))), axis=1)
    sample.drop(specs_col, axis=1, inplace=True)
    sample.drop_duplicates('id', inplace=True)
    return sample.astype({'year': int, 'cc': int, 'value': float})

vehicles = pd.concat([
    organize(private),
    organize(toyota),
    organize(motorcycle),
    organize(light),
    organize(heavy),
], keys=['private', 'private', 'motorcycle', 'light', 'heavy']).reset_index().rename(
    columns={'level_0': 'category'}).drop('level_1', axis=1).replace({nan: None})

print(f"Total processed records to upload: {len(vehicles)}")
print("Uploading records to Supabase vehicles table...")

for i in range(0, len(vehicles), 1000):
    print(f'Uploading batch {i}-{i+1000} out of {len(vehicles)}', end=" ")
    batch = vehicles.iloc[i:i+1000, vehicles.columns != 'value'].to_dict(orient='records')
    supabase.table('vehicles').upsert(batch, on_conflict='id').execute()
    print('✅')

print("Data population complete! You can now test your valuation dropdowns.")