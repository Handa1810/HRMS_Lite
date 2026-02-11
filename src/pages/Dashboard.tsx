import { useEffect, useState } from "react";
import { getEmployees, getAttendance, Employee } from "@/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, TrendingUp, BarChart3 } from "lucide-react";
import StatusMessage from "@/components/StatusMessage";
import AttendanceGraph from "@/components/AttendanceGraph";

const Dashboard = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [_absentCount, setAbsentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const empRes = await getEmployees();
        setEmployees(empRes.data);

        let total = 0;
        let present = 0;
        let absent = 0;
        for (const emp of empRes.data) {
          try {
            const attRes = await getAttendance(emp.employee_id);
            total += attRes.data.length;
            present += attRes.data.filter((r) => r.status === "Present").length;
            absent += attRes.data.filter((r) => r.status === "Absent").length;
          } catch {
            // skip
          }
        }
        setTotalAttendance(total);
        setPresentCount(present);
        setAbsentCount(absent);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <StatusMessage type="loading" message="Loading dashboard…" />;
  if (error) return <StatusMessage type="error" message="Unable to load dashboard data. Make sure the API is running." />;

  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

  const cards = [
    {
      label: "Total Employees",
      value: employees.length,
      icon: Users,
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/15 text-primary",
    },
    {
      label: "Attendance Records",
      value: totalAttendance,
      icon: CalendarCheck,
      gradient: "from-accent/20 to-accent/5",
      iconBg: "bg-accent/15 text-accent",
    },
    {
      label: "Present Days",
      value: presentCount,
      icon: TrendingUp,
      gradient: "from-accent/20 to-accent/5",
      iconBg: "bg-accent/15 text-accent",
    },
    {
      label: "Attendance Rate",
      value: `${attendanceRate}%`,
      icon: BarChart3,
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/15 text-primary",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of employee attendance and activity.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, gradient, iconBg }) => (
          <Card key={label} className={`bg-gradient-to-br ${gradient} border shadow-sm transition-shadow hover:shadow-md`}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold text-foreground">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance Graph Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Employee Attendance Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceGraph />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
