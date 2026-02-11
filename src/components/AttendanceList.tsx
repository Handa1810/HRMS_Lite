import { useState, useEffect } from "react";
import { getAttendance, getEmployees, AttendanceRecord, Employee } from "@/api/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import StatusMessage from "@/components/StatusMessage";

interface Props {
  refreshKey: number;
}

const AttendanceList = ({ refreshKey }: Props) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    getEmployees()
      .then((r) => setEmployees(r.data))
      .catch(() => {});
  }, [refreshKey]);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    setError(false);
    getAttendance(selectedId)
      .then((r) => setRecords(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [selectedId, refreshKey]);

  return (
    <div className="rounded-lg border bg-card p-5">
      <h3 className="mb-4 text-base font-semibold text-card-foreground">Attendance Records</h3>
      <div className="mb-4 max-w-xs space-y-1.5">
        <Label>Employee</Label>
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger>
            <SelectValue placeholder="Select employee to view" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((e) => (
              <SelectItem key={e.employee_id} value={e.employee_id}>
                {e.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedId && <StatusMessage type="empty" message="Select an employee to view attendance." />}
      {selectedId && loading && <StatusMessage type="loading" />}
      {selectedId && error && <StatusMessage type="error" />}
      {selectedId && !loading && !error && records.length === 0 && (
        <StatusMessage type="empty" message="No attendance records for this employee." />
      )}
      {selectedId && !loading && !error && records.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((r, i) => (
              <TableRow key={i}>
                <TableCell>{r.date}</TableCell>
                <TableCell>
                  <Badge variant={r.status === "Present" ? "default" : "destructive"}>
                    {r.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AttendanceList;
