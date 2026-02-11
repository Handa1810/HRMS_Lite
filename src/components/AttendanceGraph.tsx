import { useState, useEffect, useMemo } from "react";
import { getEmployees, getAttendance, Employee, AttendanceRecord } from "@/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Search, User, CalendarCheck, CalendarX } from "lucide-react";
import { cn } from "@/lib/utils";
import StatusMessage from "@/components/StatusMessage";

const chartConfig = {
  present: { label: "Present", color: "hsl(160 50% 42%)" },
  absent: { label: "Absent", color: "hsl(0 65% 52%)" },
};

const AttendanceGraph = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    getEmployees()
      .then((r) => setEmployees(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedEmployee) return;
    setRecordsLoading(true);
    getAttendance(selectedEmployee.employee_id)
      .then((r) => setRecords(r.data))
      .catch(() => setRecords([]))
      .finally(() => setRecordsLoading(false));
  }, [selectedEmployee]);

  const filteredEmployees = useMemo(
    () =>
      employees.filter(
        (e) =>
          e.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [employees, searchQuery]
  );

  const filteredRecords = useMemo(() => {
    if (!searchDate) return records;
    return records.filter((r) => r.date.includes(searchDate));
  }, [records, searchDate]);

  const chartData = useMemo(() => {
    const monthMap: Record<string, { present: number; absent: number }> = {};
    records.forEach((r) => {
      const month = r.date.substring(0, 7); // YYYY-MM
      if (!monthMap[month]) monthMap[month] = { present: 0, absent: 0 };
      if (r.status === "Present") monthMap[month].present++;
      else monthMap[month].absent++;
    });
    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));
  }, [records]);

  const presentDates = useMemo(
    () => records.filter((r) => r.status === "Present").map((r) => new Date(r.date)),
    [records]
  );
  const absentDates = useMemo(
    () => records.filter((r) => r.status === "Absent").map((r) => new Date(r.date)),
    [records]
  );

  const totalPresent = records.filter((r) => r.status === "Present").length;
  const totalAbsent = records.filter((r) => r.status === "Absent").length;

  if (loading) return <StatusMessage type="loading" message="Loading employees…" />;

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* Employee List Sidebar */}
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Employees</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or ID…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="max-h-[400px] overflow-y-auto p-0">
          {filteredEmployees.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">No employees found.</p>
          )}
          {filteredEmployees.map((emp) => (
            <button
              key={emp.employee_id}
              onClick={() => setSelectedEmployee(emp)}
              className={cn(
                "flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-muted/50",
                selectedEmployee?.employee_id === emp.employee_id &&
                  "bg-primary/10 border-l-2 border-l-primary"
              )}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{emp.full_name}</p>
                <p className="truncate text-xs text-muted-foreground">{emp.department}</p>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="space-y-6">
        {!selectedEmployee ? (
          <Card className="flex min-h-[300px] items-center justify-center">
            <p className="text-muted-foreground">Select an employee to view attendance details.</p>
          </Card>
        ) : recordsLoading ? (
          <StatusMessage type="loading" message="Loading attendance…" />
        ) : (
          <>
            {/* Employee Header + Stats */}
            <Card>
              <CardContent className="flex flex-wrap items-center gap-6 p-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-foreground">{selectedEmployee.full_name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedEmployee.department} · {selectedEmployee.email}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 rounded-lg bg-accent/10 px-4 py-2">
                    <CalendarCheck className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Present</p>
                      <p className="text-lg font-bold text-accent">{totalPresent}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-2">
                    <CalendarX className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="text-xs text-muted-foreground">Absent</p>
                      <p className="text-lg font-bold text-destructive">{totalAbsent}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Monthly Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No attendance data to chart.</p>
                ) : (
                  <ChartContainer config={chartConfig} className="h-[260px] w-full">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="present" fill="var(--color-present)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="absent" fill="var(--color-absent)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Calendar + Date Search */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Attendance Calendar</CardTitle>
                  <div className="flex gap-3 pt-1">
                    <Badge variant="outline" className="border-accent/40 bg-accent/10 text-accent">
                      <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-accent" />
                      Present
                    </Badge>
                    <Badge variant="outline" className="border-destructive/40 bg-destructive/10 text-destructive">
                      <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-destructive" />
                      Absent
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="multiple"
                    selected={[...presentDates, ...absentDates]}
                    className="p-3 pointer-events-auto"
                    modifiers={{
                      present: presentDates,
                      absent: absentDates,
                    }}
                    modifiersStyles={{
                      present: {
                        backgroundColor: "hsl(160 50% 42%)",
                        color: "white",
                        borderRadius: "50%",
                      },
                      absent: {
                        backgroundColor: "hsl(0 65% 52%)",
                        color: "white",
                        borderRadius: "50%",
                      },
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Search by Date</CardTitle>
                  <div className="relative mt-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredRecords.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      {searchDate ? "No records for this date." : "All records shown below."}
                    </p>
                  ) : (
                    <div className="max-h-[250px] space-y-2 overflow-y-auto">
                      {filteredRecords.map((r, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-md border px-3 py-2"
                        >
                          <span className="text-sm font-medium text-foreground">{r.date}</span>
                          <Badge variant={r.status === "Present" ? "default" : "destructive"}>
                            {r.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AttendanceGraph;
