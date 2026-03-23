import { useQuery } from "@tanstack/react-query";
import SectionCard from "../../components/ui/SectionCard";
import { Users, Shield, Ban, CheckCircle2 } from "lucide-react";

const UserManagementPage = () => {
  // Placeholder - would need backend API endpoint
  const users = [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-6 w-6" />
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <p className="text-blue-100">Manage all platform users, roles, and permissions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard title="Total Users" className="text-center">
          <div className="text-4xl font-bold text-orange-600 mb-2">0</div>
          <p className="text-sm text-slate-500">Registered users</p>
        </SectionCard>
        <SectionCard title="Active Users" className="text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">0</div>
          <p className="text-sm text-slate-500">Currently active</p>
        </SectionCard>
        <SectionCard title="Suspended" className="text-center">
          <div className="text-4xl font-bold text-red-600 mb-2">0</div>
          <p className="text-sm text-slate-500">Suspended accounts</p>
        </SectionCard>
      </div>

      <SectionCard title="All Users">
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500">User management features coming soon</p>
          <p className="text-sm text-slate-400 mt-2">View, edit, suspend, and manage user accounts</p>
        </div>
      </SectionCard>
    </div>
  );
};

export default UserManagementPage;



