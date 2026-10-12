from typing import Optional

from api.utils.db import supabase, execute


def log_error(source: str, error_type: str, message: str, search_inputs: Optional[dict] = None):
    """Prints the problem and saves it to the error_logs table. Never raises."""
    print(f"[{source}] {error_type}: {message}")
    try:
        execute(lambda: supabase.table("error_logs").insert({
            "source": source,
            "error_type": error_type,
            "message": str(message)[:2000],
            "search_inputs": search_inputs,
        }))
    except Exception as e:
        print(f"Could not write to error_logs: {e}")
