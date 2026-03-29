import os

os.environ.setdefault("SUPABASE_URL", "https://fake.supabase.co")
os.environ.setdefault("SUPABASE_KEY", "fake-key")

from unittest.mock import MagicMock
import sys

mock_supabase_module = MagicMock()
sys.modules.setdefault("supabase", mock_supabase_module)
