import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SectionCard from "../../components/ui/SectionCard";
import VacancyCard from "../../components/ui/VacancyCard";
import { postsApi } from "../../features/posts/api";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const PendingPostsPage = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["pending-posts"],
    queryFn: () => postsApi.pendingPosts({ page: 1, pageSize: 20 }),
  });

  const approveMutation = useMutation({
    mutationFn: (postId) => postsApi.approve(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-posts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });

  const handleApprove = (post) => {
    if (window.confirm(`Approve post: ${post.subject}?`)) {
      approveMutation.mutate(post.id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Pending Posts Review</h1>
        </div>
        <p className="text-orange-100">Review and approve tuition posts from parents</p>
      </div>

      <SectionCard title={`Pending Posts (${data?.items.length ?? 0})`}>
        {data && data.items.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((post) => (
              <div key={post.id} className="relative">
                <VacancyCard
                  post={post}
                  showActions={false}
                  className="border-2 border-amber-300 bg-amber-50/50"
                />
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleApprove(post)}
                    disabled={approveMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 disabled:opacity-60 transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Approve
                  </button>
                  <button
                    disabled={approveMutation.isPending}
                    className="px-4 py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 hover:border-red-300 disabled:opacity-60 transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-green-50 rounded-xl border-2 border-green-200">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-green-700">All caught up!</p>
            <p className="text-sm text-green-600 mt-2">No pending posts requiring approval</p>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default PendingPostsPage;

