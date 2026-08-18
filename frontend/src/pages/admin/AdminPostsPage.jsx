import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SectionCard from "../../components/ui/SectionCard";
import VacancyCard from "../../components/ui/VacancyCard";
import PageHeader from "../../components/ui/PageHeader";
import { postsApi } from "../../features/posts/api";
import SelectField from "../../components/forms/SelectField";
import { Briefcase, Save } from "lucide-react";

const AdminPostsPage = () => {
  const [statusUpdate, setStatusUpdate] = useState({});
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: () => postsApi.allPosts({ page: 1, pageSize: 50 }),
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }) => postsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      setStatusUpdate({});
    },
  });

  const handleChange = (postId, status) => {
    setStatusUpdate((prev) => ({ ...prev, [postId]: status }));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader
        title="Manage Vacancies"
        subtitle="Review and update status of all tuition postings"
        icon={Briefcase}
      />

      <SectionCard
        title={`All Vacancies`}
        subtitle={`${data?.items.length ?? 0} total postings`}
      >
        {data && data.items.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((post) => (
              <div key={post.id} className="flex flex-col gap-3">
                <VacancyCard post={post} showActions={false} />

                {/* Status control */}
                <div className="card p-4 bg-slate-50 border-slate-100">
                  <SelectField
                    label="Update Status"
                    value={statusUpdate[post.id] ?? post.status}
                    onChange={(e) => handleChange(post.id, e.target.value)}
                    className="mb-3"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </SelectField>
                  <button
                    onClick={() =>
                      mutation.mutate({ id: post.id, status: statusUpdate[post.id] ?? post.status })
                    }
                    disabled={
                      mutation.isPending ||
                      statusUpdate[post.id] === undefined ||
                      statusUpdate[post.id] === post.status
                    }
                    className="btn-primary w-full text-sm"
                  >
                    <Save className="h-4 w-4" />
                    {mutation.isPending ? "Saving…" : "Update Status"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <Briefcase className="h-6 w-6 text-slate-300" />
            </div>
            <p className="font-semibold text-slate-700">No vacancies yet</p>
            <p className="text-slate-400 text-sm mt-1">Post your first vacancy to get started.</p>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default AdminPostsPage;
