import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SectionCard from "../../components/ui/SectionCard";
import StatCard from "../../components/ui/StatCard";
import PageHeader from "../../components/ui/PageHeader";
import { adminApi } from "../../features/admin/api";
import { Users, ShieldCheck, Ban, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const roleBadge = {
  Admin:   "badge-indigo",
  Teacher: "badge-blue",
  Parent:  "badge-slate",
};

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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner text-primary-600" />
      </div>
    );
  }

  const activeCount = users?.filter((u) => u.isActive).length ?? 0;
  const suspendedCount = (users?.length ?? 0) - activeCount;

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader
        title="User Management"
        subtitle="Manage all platform users, roles, and permissions"
        icon={Users}
      />

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Users"    value={users?.length ?? 0} accent="indigo"  icon={Users}       subtitle="Registered accounts" />
        <StatCard label="Active Users"   value={activeCount}         accent="emerald" icon={CheckCircle2} subtitle="Currently active"    />
        <StatCard label="Suspended"      value={suspendedCount}      accent="rose"    icon={Ban}          subtitle="Blocked accounts"    />
      </div>

      {/* Table */}
      <SectionCard title="All Users" subtitle={`${users?.length ?? 0} registered`} noPadding>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id}>
                  {/* Name + avatar */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {user.fullName?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{user.fullName}</p>
                        <p className="text-xs text-slate-400">
                          Joined {new Date(user.createdAtUtc).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="text-slate-500 text-sm">{user.email}</td>

                  {/* Role selector */}
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={updating === user.id}
                      className="input !py-1.5 !px-2.5 !text-xs w-auto min-w-[100px] disabled:opacity-50"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Parent">Parent</option>
                      <option value="Teacher">Teacher</option>
                    </select>
                  </td>

                  {/* Status badge */}
                  <td>
                    <span className={user.isActive ? "badge-green" : "badge-red"}>
                      <span className={`h-1.5 w-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                      {user.isActive ? "Active" : "Suspended"}
                    </span>
                  </td>

                  {/* Toggle action */}
                  <td className="text-right">
                    <button
                      onClick={() => handleStatusToggle(user)}
                      disabled={updating === user.id}
                      className={`btn text-xs px-3 py-1.5 rounded-lg disabled:opacity-50 ${
                        user.isActive
                          ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
                      }`}
                      title={user.isActive ? "Suspend User" : "Activate User"}
                    >
                      {updating === user.id ? (
                        <span className="spinner h-3.5 w-3.5" />
                      ) : user.isActive ? (
                        <><Ban className="h-3.5 w-3.5" /> Suspend</>
                      ) : (
                        <><CheckCircle2 className="h-3.5 w-3.5" /> Activate</>
                      )}
                    </button>
                  </td>
                </tr>
              ))}

              {(!users || users.length === 0) && (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <Users className="h-10 w-10 text-slate-300 mb-3" />
                      <p className="font-semibold text-slate-600">No users found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
};

export default UserManagementPage;
