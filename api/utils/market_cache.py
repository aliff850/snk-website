from datetime import datetime, timedelta, timezone
from typing import Optional

from api.utils.db import supabase, execute
from api.utils.error_log import log_error

# Saved market results are reused for this many days, then the next search scrapes again.
FRESH_DAYS = 7


def build_key(parts: dict) -> str:
    """Combines search inputs into one stable string, e.g. 'make=honda|model=civic|year=2022'.
    Empty inputs are skipped and keys are sorted, so the same search always gives the same key."""
    clean = {k: str(v).strip().lower() for k, v in parts.items() if v not in (None, "")}
    return "|".join(f"{k}={clean[k]}" for k in sorted(clean))


def get_fresh(table: str, search_key: str, scraper_version: int) -> Optional[dict]:
    """Returns the newest saved row ({'listings', 'scraped_at'}) from the last FRESH_DAYS days, or None."""
    cutoff = (datetime.now(timezone.utc) - timedelta(days=FRESH_DAYS)).isoformat()
    try:
        res = execute(lambda: (
            supabase.table(table)
            .select("listings, scraped_at")
            .eq("search_key", search_key)
            .eq("scraper_version", scraper_version)
            .gte("scraped_at", cutoff)
            .order("scraped_at", desc=True)
            .limit(1)
        ))
        if res.data:
            print(f"Using saved {table} result from {res.data[0]['scraped_at']}")
            return res.data[0]
    except Exception as e:
        log_error("cache", "db_error", f"Reading {table}: {e}", {"search_key": search_key})
    return None


def save(table: str, search_key: str, vehicle_key: str, scraper_version: int, search_inputs: dict, listings: list):
    """Saves a fresh scrape as a new row. Older rows are kept as history."""
    try:
        execute(lambda: supabase.table(table).insert({
            "search_key": search_key,
            "vehicle_key": vehicle_key,
            "scraper_version": scraper_version,
            "search_inputs": search_inputs,
            "listings": listings,
            "listing_count": len(listings),
        }))
    except Exception as e:
        log_error("cache", "db_error", f"Saving to {table}: {e}", search_inputs)
