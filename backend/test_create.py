import requests
b='http://127.0.0.1:8000'
try:
    r=requests.post(b+'/api/employees', json={'employee_code':'Emp-001','full_name':'Seed Emp1','email':'seed1@example.com','department':'IT'}, timeout=10)
    print('POST', r.status_code)
    print(r.text)
    r2=requests.get(b+'/api/employees', timeout=10)
    print('GET', r2.status_code)
    print(r2.text)
except Exception as e:
    print('error', e)
