import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SectionCard from "../../components/ui/SectionCard";
import VacancyCard from "../../components/ui/VacancyCard";
import { postsApi } from "../../features/posts/api";
import SelectField from "../../components/forms/SelectField";
import { Save, Files } from "lucide-react";

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
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <Files className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Manage Vacancies</h1>
        </div>
        <p className="text-orange-100">Review and change status of all open and pending vacancies</p>
      </div>

      <SectionCard title={`All Vacancies (${data?.items.length ?? 0})`}>
        {data && data.items.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((post) => (
              <div key={post.id} className="space-y-4">
                <VacancyCard
                  post={post}
                  showActions={false}
                />
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
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
                    onClick={() => mutation.mutate({ id: post.id, status: statusUpdate[post.id] ?? post.status })}
                    disabled={mutation.isPending || (statusUpdate[post.id] === undefined && post.status === statusUpdate[post.id]) || statusUpdate[post.id] === post.status}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    <Save className="h-4 w-4" />
                    Update Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No vacancies yet.</p>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default AdminPostsPage;
