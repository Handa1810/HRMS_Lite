import { useState, useEffect } from "react";
import { getEmployees, markAttendance, Employee } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Props {
  onMarked: () => void;
}

const AttendanceForm = ({ onMarked }: Props) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"Present" | "Absent" | "">("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getEmployees()
      .then((r) => setEmployees(r.data))
      .catch(() => {});
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!employeeId) e.employeeId = "Select an employee";
    if (!date) e.date = "Pick a date";
    if (!status) e.status = "Select status";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await markAttendance({ employee_id: employeeId, date, status: status as "Present" | "Absent" });
      toast.success("Attendance recorded");
      setDate("");
      setStatus("");
      onMarked();
    } catch {
      toast.error("Failed to record attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-5">
      <h3 className="mb-4 text-base font-semibold text-card-foreground">Mark Attendance</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Employee</Label>
          <Select value={employeeId} onValueChange={(v) => { setEmployeeId(v); setErrors((p) => ({ ...p, employeeId: "" })); }}>
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((e) => (
                <SelectItem key={e.employee_id} value={e.employee_id}>
                  {e.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.employeeId && <p className="text-xs text-destructive">{errors.employeeId}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="att-date">Date</Label>
          <Input id="att-date" type="date" value={date} onChange={(e) => { setDate(e.target.value); setErrors((p) => ({ ...p, date: "" })); }} />
          {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => { setStatus(v as "Present" | "Absent"); setErrors((p) => ({ ...p, status: "" })); }}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Present">Present</SelectItem>
              <SelectItem value="Absent">Absent</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
        </div>
      </div>
      <Button type="submit" className="mt-4" disabled={loading}>
        {loading ? "Submitting…" : "Record Attendance"}
      </Button>
    </form>
  );
};

export default AttendanceForm;
