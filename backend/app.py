from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
import uuid
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise RuntimeError("Missing Supabase credentials in environment variables")

HEADERS = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    "Content-Type": "application/json",
}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Employee(BaseModel):
    employee_id: Optional[str] = None
    employee_code: Optional[str] = None
    full_name: str
    email: str
    department: str


class AttendanceRecord(BaseModel):
    employee_id: str
    date: str
    status: str


def supabase_get(path: str, params: Optional[dict] = None):
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    try:
        r = requests.get(url, headers=HEADERS, params=params, timeout=3)
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=str(e))
    if not r.ok:
        raise HTTPException(status_code=r.status_code, detail=r.text)
    return r.json()


def supabase_post(path: str, payload: dict):
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    headers = {**HEADERS, "Prefer": "return=representation"}
    try:
        r = requests.post(url, headers=headers, json=payload, timeout=3)
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=str(e))
    if not r.ok:
        raise HTTPException(status_code=r.status_code, detail=r.text)
    return r.json()


def supabase_delete(path: str, query: str):
    url = f"{SUPABASE_URL}/rest/v1/{path}?{query}"
    try:
        r = requests.delete(url, headers=HEADERS, timeout=3)
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=str(e))
    if not (r.ok or r.status_code == 204):
        raise HTTPException(status_code=r.status_code, detail=r.text)
    return {"deleted": True}


@app.post("/api/employees/clear")
def clear_employees():
    """Delete all attendance and employee rows. Uses PostgREST filters to target all rows."""
    # delete attendance first
    supabase_delete("attendance", "id=not.is.null")
    # delete employees
    supabase_delete("employees", "employee_id=not.is.null")
    return {"cleared": True}


@app.get("/api/employees")
def list_employees():
    q = "select=employee_id,employee_code,full_name,email,department&order=created_at.desc"
    return supabase_get(f"employees?{q}")


@app.post("/api/employees")
def create_employee(emp: Employee):
    # Ensure employee_id is a UUID; if missing or invalid, generate one.
    if emp.employee_id:
        try:
            uuid.UUID(emp.employee_id)
        except Exception:
            emp.employee_id = str(uuid.uuid4())
    else:
        emp.employee_id = str(uuid.uuid4())
    payload = {
        "employee_id": emp.employee_id,
        "employee_code": emp.employee_code,
        "full_name": emp.full_name,
        "email": emp.email,
        "department": emp.department,
    }
    res = supabase_post("employees", payload)
    # supabase returns a list of inserted rows
    return res[0] if isinstance(res, list) and res else res


@app.delete("/api/employees/{employee_id}")
def delete_employee(employee_id: str):
    query = f"employee_id=eq.{employee_id}"
    return supabase_delete("employees", query)


@app.post("/api/attendance")
def mark_attendance(record: AttendanceRecord):
    payload = {
        "employee_id": record.employee_id,
        "date": record.date,
        "status": record.status,
    }
    res = supabase_post("attendance", payload)
    return res[0] if isinstance(res, list) and res else res


@app.get("/api/attendance/{employee_id}")
def get_attendance(employee_id: str):
    q = f"select=employee_id,date,status&employee_id=eq.{employee_id}&order=date.desc"
    return supabase_get(f"attendance?{q}")


@app.get("/api/_health")
def health_check():
    """Simple health endpoint that verifies Supabase REST access."""
    try:
        # try to fetch zero-or-one employee to validate connectivity and auth
        res = requests.get(
            f"{SUPABASE_URL}/rest/v1/employees?select=employee_id&limit=1",
            headers=HEADERS,
            timeout=10,
        )
        return {"ok": res.ok, "status_code": res.status_code, "body": res.json() if res.ok else res.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
