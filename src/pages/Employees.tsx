import { useEffect, useState, useCallback } from "react";
import { getEmployees, Employee } from "@/api/api";
import EmployeeForm from "@/components/EmployeeForm";
import EmployeeList from "@/components/EmployeeList";

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
      <EmployeeForm onAdded={load} />
      <EmployeeList employees={employees} loading={loading} error={error} onRefresh={load} />
    </div>
  );
};

export default Employees;
