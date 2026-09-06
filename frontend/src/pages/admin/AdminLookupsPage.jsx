import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminLookupsApi } from "../../features/metadata/api";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import TextField from "../../components/forms/TextField";
import { toast } from "react-hot-toast";
import { ListChecks, Plus, EyeOff, Eye, Save } from "lucide-react";

// Only the closed, bounded categories are manageable here. Subject/City are deliberately absent:
// they're free-text columns with existing production data and need a proper migration first
// (see IMPLEMENTATION_STATUS.txt).
const CATEGORIES = [
  { key: "TeachingMode", label: "Teaching Modes" },
  { key: "Gender", label: "Genders" },
  { key: "Qualification", label: "Qualifications" },
];

const AdminLookupsPage = () => {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState(CATEGORIES[0].key);
  const [newItem, setNewItem] = useState({ code: "", label: "", sortOrder: 0 });
  const [edits, setEdits] = useState({});

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-lookups", category],
    queryFn: () => adminLookupsApi.byCategory(category),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-lookups", category] });
    // The public dropdowns read from /api/metadata — refresh those too or the UI stays stale.
    queryClient.invalidateQueries({ queryKey: ["metadata"] });
  };

  const createMutation = useMutation({
    mutationFn: () => adminLookupsApi.create({ ...newItem, category, sortOrder: Number(newItem.sortOrder) || 0 }),
    onSuccess: () => {
      setNewItem({ code: "", label: "", sortOrder: 0 });
      invalidate();
      toast.success("Option added.");
    },
    onError: (err) => toast.error(err.response?.data?.errors?.code?.[0] ?? "Could not add option."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => adminLookupsApi.update(id, payload),
    onSuccess: () => {
      invalidate();
      toast.success("Option updated.");
    },
    onError: () => toast.error("Could not update option."),
  });

  const saveRow = (item) => {
    const edit = edits[item.id] ?? {};
    updateMutation.mutate({
      id: item.id,
      payload: {
        label: edit.label ?? item.label,
        sortOrder: Number(edit.sortOrder ?? item.sortOrder) || 0,
        isActive: edit.isActive ?? item.isActive,
      },
    });
  };

  const toggleActive = (item) => {
    updateMutation.mutate({
      id: item.id,
      payload: { label: item.label, sortOrder: item.sortOrder, isActive: !item.isActive },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader
        title="Dropdown Options"
        subtitle="Edit the choices shown in registration and search forms — no code deploy needed."
        icon={ListChecks}
      />

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              category === c.key
                ? "bg-primary-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <SectionCard title="Add a new option">
        <div className="grid gap-4 md:grid-cols-4 md:items-end">
          <TextField
            label="Code (permanent)"
            value={newItem.code}
            onChange={(e) => setNewItem((p) => ({ ...p, code: e.target.value }))}
            placeholder="e.g. Weekend"
          />
          <TextField
            label="Label (shown to users)"
            value={newItem.label}
            onChange={(e) => setNewItem((p) => ({ ...p, label: e.target.value }))}
            placeholder="e.g. Weekends only"
          />
          <TextField
            label="Sort order"
            type="number"
            value={newItem.sortOrder}
            onChange={(e) => setNewItem((p) => ({ ...p, sortOrder: e.target.value }))}
          />
          <button
            onClick={() => createMutation.mutate()}
            disabled={!newItem.code.trim() || !newItem.label.trim() || createMutation.isPending}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Code is stored on every record that uses this option and can never be changed afterwards —
          only the label, order, and visibility can be edited later.
        </p>
      </SectionCard>

      <SectionCard title={CATEGORIES.find((c) => c.key === category)?.label} subtitle={`${items.length} option(s)`} noPadding>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Label</th>
                <th>Order</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-400">Loading…</td></tr>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id} className={item.isActive ? "" : "opacity-50"}>
                    <td className="font-mono text-xs text-slate-500">{item.code}</td>
                    <td>
                      <input
                        value={edits[item.id]?.label ?? item.label}
                        onChange={(e) => setEdits((p) => ({ ...p, [item.id]: { ...p[item.id], label: e.target.value } }))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={edits[item.id]?.sortOrder ?? item.sortOrder}
                        onChange={(e) => setEdits((p) => ({ ...p, [item.id]: { ...p[item.id], sortOrder: e.target.value } }))}
                        className="w-20 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </td>
                    <td>
                      <span className={item.isActive ? "badge-green" : "badge-slate"}>
                        {item.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => saveRow(item)}
                          disabled={updateMutation.isPending}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          <Save className="h-3.5 w-3.5" /> Save
                        </button>
                        <button
                          onClick={() => toggleActive(item)}
                          disabled={updateMutation.isPending}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          {item.isActive ? <><EyeOff className="h-3.5 w-3.5" /> Hide</> : <><Eye className="h-3.5 w-3.5" /> Show</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                        <ListChecks className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="font-semibold text-slate-700">No options in this category</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="px-6 py-4 border-t border-slate-100 text-xs text-slate-400">
          Hiding an option removes it from new forms but keeps it working on records that already use it.
        </p>
      </SectionCard>
    </div>
  );
};

export default AdminLookupsPage;
