import { useState } from "react";
import AttendanceForm from "@/components/AttendanceForm";
import AttendanceList from "@/components/AttendanceList";

const Attendance = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
      <AttendanceForm onMarked={() => setRefreshKey((k) => k + 1)} />
      <AttendanceList refreshKey={refreshKey} />
    </div>
  );
};

export default Attendance;
