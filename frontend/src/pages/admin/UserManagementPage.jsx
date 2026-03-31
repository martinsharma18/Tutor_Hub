import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SectionCard from "../../components/ui/SectionCard";
import { adminApi } from "../../features/admin/api";
import { Users, Shield, Ban, CheckCircle2, UserCog } from "lucide-react";
import { useState } from "react";

const UserManagementPage = () => {
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminApi.getUsers,
  });

  const statusMutation = useMutation({
    mutationFn: ({ userId, isActive }) => adminApi.updateUserStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setUpdating(null);
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) => adminApi.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setUpdating(null);
    },
  });

  const handleStatusToggle = (user) => {
    setUpdating(user.id);
    statusMutation.mutate({ userId: user.id, isActive: !user.isActive });
  };

  const handleRoleChange = (userId, newRole) => {
    setUpdating(userId);
    roleMutation.mutate({ userId, role: newRole });
  };

  if (isLoading) {
    return <div className="p-12 text-center text-slate-500">Loading users...</div>;
  }

  const activeCount = users?.filter(u => u.isActive).length ?? 0;
  const suspendedCount = (users?.length ?? 0) - activeCount;

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
          <div className="text-4xl font-bold text-orange-600 mb-2">{users?.length ?? 0}</div>
          <p className="text-sm text-slate-500">Registered users</p>
        </SectionCard>
        <SectionCard title="Active Users" className="text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">{activeCount}</div>
          <p className="text-sm text-slate-500">Currently active</p>
        </SectionCard>
        <SectionCard title="Suspended" className="text-center">
          <div className="text-4xl font-bold text-red-600 mb-2">{suspendedCount}</div>
          <p className="text-sm text-slate-500">Suspended accounts</p>
        </SectionCard>
      </div>

      <SectionCard title="All Users">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 px-4 font-semibold text-slate-700">Name</th>
                <th className="py-4 px-4 font-semibold text-slate-700">Email</th>
                <th className="py-4 px-4 font-semibold text-slate-700">Role</th>
                <th className="py-4 px-4 font-semibold text-slate-700">Status</th>
                <th className="py-4 px-4 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-medium text-slate-900">{user.fullName}</div>
                    <div className="text-xs text-slate-400">Joined {new Date(user.createdAtUtc).toLocaleDateString()}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-600">{user.email}</td>
                  <td className="py-4 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={updating === user.id}
                      className="bg-slate-100 border-none rounded-lg text-sm font-medium py-1 px-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Parent">Parent</option>
                      <option value="Teacher">Teacher</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      {user.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleStatusToggle(user)}
                      disabled={updating === user.id}
                      className={`p-2 rounded-xl transition-all duration-200 ${
                        user.isActive 
                          ? 'text-red-600 hover:bg-red-50' 
                          : 'text-green-600 hover:bg-green-50'
                      } disabled:opacity-50`}
                      title={user.isActive ? 'Suspend User' : 'Activate User'}
                    >
                      {user.isActive ? <Ban className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
};

export default UserManagementPage;
