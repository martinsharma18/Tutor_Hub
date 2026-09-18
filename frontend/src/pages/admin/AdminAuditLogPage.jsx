import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../features/admin/api";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import { ScrollText, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const AdminAuditLogPage = () => {
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-audit-log", page],
    queryFn: () => adminApi.auditLog({ page, pageSize }),
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / pageSize)) : 1;

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader
        title="Audit Log"
        subtitle="Every sensitive admin action — who did what, to which record, and when."
        icon={ScrollText}
      />

      <SectionCard title="Recent Activity" subtitle={`${data?.totalCount ?? 0} total entries`} noPadding>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Actor</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Details</th>
                <th className="text-right">When</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-400">Loading…</td></tr>
              ) : data && data.items.length > 0 ? (
                data.items.map((entry) => (
                  <tr key={entry.id}>
                    <td className="font-medium text-slate-800 text-sm">{entry.actorName}</td>
                    <td>
                      <span className="badge-slate">{entry.action}</span>
                    </td>
                    <td className="text-sm text-slate-600">
                      {entry.entityType} · <span className="font-mono text-xs">{entry.entityId.slice(0, 8)}</span>
                    </td>
                    <td className="text-sm text-slate-500 max-w-xs truncate">{entry.details ?? "—"}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-500 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-slate-300" />
                        {new Date(entry.createdAtUtc).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                        <ScrollText className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="font-semibold text-slate-700">No audit entries yet</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data && data.totalCount > pageSize && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default AdminAuditLogPage;
