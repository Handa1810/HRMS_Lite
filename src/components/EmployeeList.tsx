import { Employee, deleteEmployee } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusMessage from "@/components/StatusMessage";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  employees: Employee[];
  loading: boolean;
  error: boolean;
  onRefresh: () => void;
}

const EmployeeList = ({ employees, loading, error, onRefresh }: Props) => {
  const handleDelete = async (id: string) => {
    try {
      await deleteEmployee(id);
      toast.success("Employee deleted");
      onRefresh();
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  if (loading) return <StatusMessage type="loading" message="Loading employees…" />;
  if (error) return <StatusMessage type="error" message="Failed to load employees." />;
  if (employees.length === 0) return <StatusMessage type="empty" message="No employees yet. Add one above." />;

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp.employee_id}>
              <TableCell className="font-mono text-xs">{emp.employee_code || emp.employee_id}</TableCell>
              <TableCell className="font-medium">{emp.full_name}</TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell>{emp.department}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(emp.employee_id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeList;
