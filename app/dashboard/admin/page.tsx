import { LogoutButton } from "@/components/LogoutButton";

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2">Solo visible para rol: admin</p>
      <LogoutButton />
    </div>
  );
}


