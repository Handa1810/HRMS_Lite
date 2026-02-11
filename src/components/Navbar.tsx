import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
];

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <span className="text-lg font-bold tracking-tight text-primary">HRMS Lite</span>
        <nav className="flex gap-1">
          {links.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
