export interface Employee {
  employee_id?: string;
  employee_code?: string;
  full_name: string;
  email: string;
  department: string;
}

export interface AttendanceRecord {
  employee_id: string;
  date: string;
  status: "Present" | "Absent";
}

const API_BASE = (import.meta as any).env.VITE_API_URL || "";

const handleRes = async (res: Response) => {
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || res.statusText);
  }
  const json = await res.json();
  return { data: json };
};

export const getEmployees = async () => {
  const res = await fetch(`${API_BASE}/api/employees`);
  return handleRes(res);
};

export const addEmployee = async (employee: Employee) => {
  const res = await fetch(`${API_BASE}/api/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  });
  return handleRes(res);
};

export const deleteEmployee = async (employee_id: string) => {
  const res = await fetch(`${API_BASE}/api/employees/${employee_id}`, { method: "DELETE" });
  return handleRes(res);
};

export const markAttendance = async (attendance: AttendanceRecord) => {
  const res = await fetch(`${API_BASE}/api/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(attendance),
  });
  return handleRes(res);
};

export const getAttendance = async (employee_id: string) => {
  const res = await fetch(`${API_BASE}/api/attendance/${employee_id}`);
  return handleRes(res);
};
