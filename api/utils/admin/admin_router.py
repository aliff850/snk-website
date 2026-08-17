import io
import os
import asyncio
import pandas as pd
from uuid import uuid5, NAMESPACE_OID
from numpy import nan
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv('.env')

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    raise RuntimeError("Supabase credentials not found in environment variables.")

supabase: Client = create_client(url, key)
router = APIRouter()

@router.post("/admin/upload-prices")
async def upload_prices(file: UploadFile = File(...), category: str = Form(...)):
    # Read file into memory immediately so we don't lose the upload stream
    contents = await file.read()

    # Define an async generator to stream logs back to the frontend
    async def log_streamer():
        try:
            yield f"🚀 Received file: {file.filename} for category: {category}\n"
            yield "📊 Reading Excel file into memory (this takes a few seconds)...\n"
            await asyncio.sleep(0.1) # Force flush the stream to the frontend
            
            try:
                df = pd.read_excel(io.BytesIO(contents), sheet_name='MASTER DATA')
            except Exception:
                yield "❌ ERROR: Could not read Excel file. Ensure it has a 'MASTER DATA' sheet.\n"
                return

            yield "🔍 Scanning for target columns...\n"
            await asyncio.sleep(0.1)
            
            avg_col_name, low_col_name, high_col_name = None, None, None
            for col in reversed(df.columns):
                col_upper = str(col).upper()
                if not avg_col_name and ('AVERAGE' in col_upper or 'CURRENT MARKET' in col_upper) and 'LOWEST' not in col_upper and 'HIGHEST' not in col_upper:
                    avg_col_name = col
                if not low_col_name and 'LOWEST' in col_upper and 'MARKET' in col_upper:
                    low_col_name = col
                if not high_col_name and 'HIGHEST' in col_upper and 'MARKET' in col_upper:
                    high_col_name = col

            if not all([avg_col_name, low_col_name, high_col_name]):
                yield "❌ ERROR: Could not find Average, Lowest, and Highest target columns.\n"
                return

            yield "🧹 Cleaning data and applying historical fallbacks...\n"
            await asyncio.sleep(0.1)

            df_clean = df.rename(columns={
                'MAKE': 'make', 'FAMILY': 'model', 'VARIANT': 'variant', 'SERIES': 'series',
                'YEAR': 'year', 'CAPACITY': 'cc', 'IMPORT STATUS (SHORT)': 'import_status',
                'TRANSMISSION': 'transmission', 'STYLE': 'style',
                avg_col_name: 'value', low_col_name: 'lowest_value', high_col_name: 'highest_value'
            })

            df_clean['category'] = category
            df_clean = df_clean.dropna(subset=['make', 'model'])
            df_clean['value'] = pd.to_numeric(df_clean['value'], errors='coerce')
            df_clean['lowest_value'] = pd.to_numeric(df_clean['lowest_value'], errors='coerce')
            df_clean['highest_value'] = pd.to_numeric(df_clean['highest_value'], errors='coerce')

            avg_col_idx = df.columns.get_loc(avg_col_name)
            historical_cols = df.columns[:avg_col_idx] 

            def apply_fallback(row):
                if pd.notna(row['value']): return row
                original_row = df.loc[row.name]
                for c in reversed(historical_cols):
                    c_upper = str(c).upper()
                    if any(keyword in c_upper for keyword in ['VALUE', 'MARKET', 'CHUBB', 'PRICE']):
                        try:
                            num = float(original_row[c])
                            if num > 1000:
                                row['value'] = num
                                row['lowest_value'] = num * 0.90
                                row['highest_value'] = num * 1.10
                                break
                        except (ValueError, TypeError): continue
                return row

            df_clean = df_clean.apply(apply_fallback, axis=1).dropna(subset=['value'])

            yield "🔑 Generating unique vehicle IDs...\n"
            await asyncio.sleep(0.1)
            hash_columns = ['make', 'model', 'variant', 'series', 'year', 'cc', 'import_status', 'transmission', 'style']
            
            def generate_id(row):
                row_values = [str(x).upper() for x in row[hash_columns].dropna().astype(str).to_list()]
                return str(uuid5(NAMESPACE_OID, ','.join(row_values)))

            df_clean['vehicle_id'] = df_clean.apply(generate_id, axis=1)
            df_clean = df_clean.drop_duplicates(subset=['vehicle_id'])
            batch_size = 1000
            
            yield "\n==============================================\n"
            yield "⚡ STAGE 1: SYNCING MASTER 'VEHICLES' CATALOG\n"
            yield "==============================================\n"
            
            vehicles_df = df_clean[['vehicle_id', 'category', 'make', 'model', 'variant', 'series', 'year', 'cc', 'import_status', 'transmission', 'style']].copy().rename(columns={'vehicle_id': 'id'})
            text_cols = ['category', 'make', 'model', 'variant', 'series', 'import_status', 'transmission', 'style']
            for c in text_cols: vehicles_df[c] = vehicles_df[c].apply(lambda x: str(x).upper() if pd.notna(x) else None)
            vehicles_df = vehicles_df.replace({nan: None})

            for i in range(0, len(vehicles_df), batch_size):
                yield f"➡️ Uploading vehicles batch {i} to {i+batch_size} (Total: {len(vehicles_df)})\n"
                await asyncio.sleep(0.01)
                batch = vehicles_df.iloc[i:i+batch_size].to_dict(orient='records')
                # Fixed: Added on_conflict for vehicles
                supabase.table('vehicles').upsert(batch, on_conflict="id").execute()

            yield "\n==============================================\n"
            yield "💰 STAGE 2: SYNCING 'VEHICLE_VALUES' PRICES\n"
            yield "==============================================\n"
            
            upload_df = df_clean[['vehicle_id', 'value', 'lowest_value', 'highest_value']].copy()
            upload_df.insert(0, 'valuation_period', '2026-aug-01')
            upload_df = upload_df.replace({nan: None}) 

            for i in range(0, len(upload_df), batch_size):
                yield f"➡️ Uploading prices batch {i} to {i+batch_size} (Total: {len(upload_df)})\n"
                await asyncio.sleep(0.01)
                batch = upload_df.iloc[i:i+batch_size].to_dict(orient='records')
                # Fixed: Added on_conflict for the composite unique constraint
                supabase.table('vehicle_values').upsert(batch, on_conflict="vehicle_id,valuation_period").execute()

            yield "\n🎉 ALL DONE! Data population complete.\n"

        except Exception as e:
            import traceback
            traceback.print_exc()
            yield f"\n❌ BACKEND CRASH: {str(e)}\n"

    # Return the stream instead of a standard JSON response
    return StreamingResponse(log_streamer(), media_type="text/plain")