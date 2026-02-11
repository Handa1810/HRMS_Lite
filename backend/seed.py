import requests
import sys

BACKEND = "http://127.0.0.1:8000"

employees = [
    {"full_name": "Alice Johnson", "email": "alice@example.com", "department": "Engineering"},
    {"full_name": "Bob Smith", "email": "bob@example.com", "department": "Sales"},
    {"full_name": "Cara Lee", "email": "cara@example.com", "department": "HR"},
]

attendance = [
    {"employee_email": "alice@example.com", "date": "2026-02-11", "status": "Present"},
    {"employee_email": "bob@example.com", "date": "2026-02-11", "status": "Absent"},
    {"employee_email": "cara@example.com", "date": "2026-02-11", "status": "Present"},
]


def create_employee(emp):
    r = requests.post(f"{BACKEND}/api/employees", json=emp, timeout=10)
    r.raise_for_status()
    return r.json()


def get_employees():
    r = requests.get(f"{BACKEND}/api/employees", timeout=10)
    r.raise_for_status()
    return r.json()


def find_employee_by_email(email):
    emps = get_employees()
    for e in emps:
        if e.get("email") == email:
            return e
    return None


def mark_attendance(record):
    r = requests.post(f"{BACKEND}/api/attendance", json=record, timeout=10)
    r.raise_for_status()
    return r.json()


if __name__ == "__main__":
    print("Seeding employees...")
    created = []
    for e in employees:
        try:
            c = create_employee(e)
            created.append(c)
            print("Created:", c.get("employee_id") or c)
        except Exception as exc:
            print("Create employee failed:", exc)
    print("Seeding attendance...")
    for a in attendance:
        try:
            emp = find_employee_by_email(a["employee_email"])
            if not emp:
                print("Employee not found for attendance:", a["employee_email"])
                continue
            rec = {"employee_id": emp["employee_id"], "date": a["date"], "status": a["status"]}
            r = mark_attendance(rec)
            print("Marked attendance:", r)
        except Exception as exc:
            print("Mark attendance failed:", exc)
    print("Done.")
