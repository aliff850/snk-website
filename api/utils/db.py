import os
import ssl
import threading

import httpx
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(".env.local")

_URL = os.environ.get("SUPABASE_URL")
# The service role key bypasses Row Level Security, which is what lets the API use the private cache and log tables
_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY")

_local = threading.local()


def _client() -> Client:
    # One client per thread: a single client shared by parallel searches drops connections
    client = getattr(_local, "client", None)
    if client is None:
        client = _local.client = create_client(_URL, _KEY)
    return client


class _ThreadLocalClient:
    def __getattr__(self, name):
        return getattr(_client(), name)


supabase: Client = _ThreadLocalClient()  # type: ignore[assignment]

# Connection-level failures (an idle connection closed by the server) that are worth one retry
RETRYABLE = (httpx.TransportError, ssl.SSLError, ConnectionError)


def execute(build):
    """Runs build().execute(), retrying once on a dropped connection. `build` returns a fresh query."""
    try:
        return build().execute()
    except RETRYABLE:
        _local.client = None
        return build().execute()
