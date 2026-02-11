import { Loader2, AlertCircle, Inbox } from "lucide-react";

interface Props {
  type: "loading" | "error" | "empty";
  message?: string;
}

const StatusMessage = ({ type, message }: Props) => {
  if (type === "loading")
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm">{message || "Loading…"}</p>
      </div>
    );

  if (type === "error")
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 py-8 text-destructive">
        <AlertCircle className="h-6 w-6" />
        <p className="text-sm font-medium">{message || "Something went wrong."}</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
      <Inbox className="h-6 w-6" />
      <p className="text-sm">{message || "No records found."}</p>
    </div>
  );
};

export default StatusMessage;
