import os
import requests
from dotenv import load_dotenv

load_dotenv()
SUPABASE_URL = os.getenv('SUPABASE_URL')
ANON = os.getenv('SUPABASE_ANON_KEY')
HEAD = {'apikey': ANON, 'Authorization': f'Bearer {ANON}'}

for path in ['attendance', 'employees']:
    if path == 'attendance':
        query = 'id=not.is.null'
    else:
        query = 'employee_id=not.is.null'
    url = f"{SUPABASE_URL}/rest/v1/{path}?{query}"
    try:
        r = requests.delete(url, headers=HEAD, timeout=15)
        print(path, r.status_code, r.text)
    except Exception as e:
        print(path, 'error', e)
