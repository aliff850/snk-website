import os
import tkinter as tk
from tkinter import filedialog
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client
from uuid import uuid5, NAMESPACE_OID
from numpy import nan

load_dotenv('.env')

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

# 1. Initialize GUI
root = tk.Tk()
root.withdraw() 
root.attributes('-topmost', True) 

# 2. Pop up a File Selector Window
print("Opening file selector... Please select your SNK Excel file.")
file_path = filedialog.askopenfilename(
    title="Select your SNK Excel file",
    filetypes=[("Excel files", "*.xlsx *.xls")]
)

if not file_path:
    print("❌ No file selected. Upload cancelled.")
    exit(1)

print(f"\n✅ File successfully selected: {file_path}")

# 3. Pop up Category Selector Window
selected_category = None

def set_category(cat):
    global selected_category
    selected_category = cat
    cat_window.destroy()

cat_window = tk.Toplevel(root)
cat_window.title("Select Vehicle Category")
cat_window.geometry("300x250")
cat_window.attributes('-topmost', True)

tk.Label(cat_window, text="What category of vehicles are in this file?", pady=15, font=("Arial", 10, "bold")).pack()

categories = ['PRIVATE', 'COMMERCIAL', 'MOTORCYCLE', 'LIGHT', 'HEAVY']
for cat in categories:
    tk.Button(cat_window, text=cat, width=20, pady=2, command=lambda c=cat: set_category(c)).pack(pady=4)

# Wait for the user to click a button and close the window
root.wait_window(cat_window)

if not selected_category:
    print("❌ No category selected. Upload cancelled.")
    exit(1)

print(f"✅ Category set to: {selected_category}\n")

# 4. Load Data
print("Loading the 'MASTER DATA' sheet...")
df = pd.read_excel(file_path, sheet_name='MASTER DATA')

# 5. Scan for the newest columns
print("Scanning columns from right-to-left for the latest market values...")
avg_col_name = None
low_col_name = None
high_col_name = None

for col in reversed(df.columns):
    col_upper = str(col).upper()
    if not avg_col_name and ('AVERAGE' in col_upper or 'CURRENT MARKET' in col_upper) and 'LOWEST' not in col_upper and 'HIGHEST' not in col_upper:
        avg_col_name = col
    if not low_col_name and 'LOWEST' in col_upper and 'MARKET' in col_upper:
        low_col_name = col
    if not high_col_name and 'HIGHEST' in col_upper and 'MARKET' in col_upper:
        high_col_name = col

print(f"- Found Latest Average at: {avg_col_name}")
print(f"- Found Latest Lowest at:  {low_col_name}")
print(f"- Found Latest Highest at: {high_col_name}")

if not all([avg_col_name, low_col_name, high_col_name]):
    print("\nERROR: Could not find all three target columns.")
    exit(1)

# 6. Process and Rename
df_clean = df.rename(columns={
    'MAKE': 'make',
    'FAMILY': 'model',
    'VARIANT': 'variant',
    'SERIES': 'series',
    'YEAR': 'year',
    'CAPACITY': 'cc',
    'IMPORT STATUS (SHORT)': 'import_status',
    'TRANSMISSION': 'transmission',
    'STYLE': 'style',
    avg_col_name: 'value',
    low_col_name: 'lowest_value',
    high_col_name: 'highest_value'
})

# Apply the category you clicked to every single car in the file
df_clean['category'] = selected_category

df_clean = df_clean.dropna(subset=['make', 'model'])
df_clean['value'] = pd.to_numeric(df_clean['value'], errors='coerce')
df_clean['lowest_value'] = pd.to_numeric(df_clean['lowest_value'], errors='coerce')
df_clean['highest_value'] = pd.to_numeric(df_clean['highest_value'], errors='coerce')

# 7. The Fallback Logic
print("Checking for missing prices and calculating historical fallbacks...")
avg_col_idx = df.columns.get_loc(avg_col_name)
historical_cols = df.columns[:avg_col_idx] 

def apply_fallback(row):
    if pd.notna(row['value']):
        return row
    original_row = df.loc[row.name]
    for col in reversed(historical_cols):
        col_upper = str(col).upper()
        if any(keyword in col_upper for keyword in ['VALUE', 'MARKET', 'CHUBB', 'PRICE']):
            val = original_row[col]
            try:
                num = float(val)
                if num > 1000:
                    row['value'] = num
                    row['lowest_value'] = num * 0.90
                    row['highest_value'] = num * 1.10
                    break
            except (ValueError, TypeError):
                continue
    return row

df_clean = df_clean.apply(apply_fallback, axis=1)
df_clean = df_clean.dropna(subset=['value'])

# 8. UUID Generation
print("Generating UUIDs to match database...")
hash_columns = ['make', 'model', 'variant', 'series', 'year', 'cc', 'import_status', 'transmission', 'style']

def generate_id(row):
    row_values = [str(x).upper() for x in row[hash_columns].dropna().astype(str).to_list()]
    hash_string = ','.join(row_values)
    return str(uuid5(NAMESPACE_OID, hash_string))

df_clean['vehicle_id'] = df_clean.apply(generate_id, axis=1)
df_clean = df_clean.drop_duplicates(subset=['vehicle_id'])

batch_size = 1000

# 9. Sync the main 'vehicles' catalog first
print(f"\nSyncing master catalog to 'vehicles' table (Adding new {selected_category} cars)...")
vehicles_df = df_clean[['vehicle_id', 'category', 'make', 'model', 'variant', 'series', 'year', 'cc', 'import_status', 'transmission', 'style']].copy()
vehicles_df = vehicles_df.rename(columns={'vehicle_id': 'id'})

text_cols = ['category', 'make', 'model', 'variant', 'series', 'import_status', 'transmission', 'style']
for c in text_cols:
    vehicles_df[c] = vehicles_df[c].apply(lambda x: str(x).upper() if pd.notna(x) else None)
vehicles_df = vehicles_df.replace({nan: None})

for i in range(0, len(vehicles_df), batch_size):
    print(f'Syncing vehicles batch {i}-{i+batch_size} out of {len(vehicles_df)}', end=" ")
    batch = vehicles_df.iloc[i:i+batch_size].to_dict(orient='records')
    supabase.table('vehicles').upsert(batch).execute()
    print('✅')

# 10. Upload Prices
print("\nUploading exact market values to 'vehicle_values' table...")
date = '2026-aug-01'
upload_df = df_clean[['vehicle_id', 'value', 'lowest_value', 'highest_value']].copy()
upload_df.insert(0, 'valuation_period', date)
upload_df = upload_df.replace({nan: None}) 

for i in range(0, len(upload_df), batch_size):
    print(f'Uploading prices batch {i}-{i+batch_size} out of {len(upload_df)}', end=" ")
    batch = upload_df.iloc[i:i+batch_size].to_dict(orient='records')
    supabase.table('vehicle_values').upsert(batch).execute()
    print('✅')

print("\n🎉 Data population complete! Your database is now perfectly synced.")