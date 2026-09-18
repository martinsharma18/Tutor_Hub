import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { postsApi } from "../../features/posts/api";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { Briefcase, PlusCircle } from "lucide-react";

const ParentPostsPage = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["parent-posts"],
    queryFn: () => postsApi.myPosts({ page: 1, pageSize: 50 }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader
        title="My Vacancies"
        subtitle="Every requirement you've posted, and its current status."
        icon={Briefcase}
        actions={
          <Link to="/parent/create-post" className="btn-primary text-sm">
            <PlusCircle className="h-4 w-4" /> Post a requirement
          </Link>
        }
      />

      <SectionCard title="All Vacancies" subtitle={`${posts?.totalCount ?? 0} total`} noPadding>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Location</th>
                <th>Budget</th>
                <th>Status</th>
                <th className="text-right">Applications</th>
              </tr>
            </thead>
            <tbody>
              {posts?.items.map((post) => (
                <tr key={post.id}>
                  <td>
                    <p className="font-semibold text-slate-900 text-sm">{post.subject}</p>
                    <p className="text-xs text-slate-400">{post.classLevel}</p>
                  </td>
                  <td className="text-sm text-slate-600">{post.city}, {post.area}</td>
                  <td className="text-sm font-semibold text-slate-800">${post.budget.toFixed(2)}</td>
                  <td><StatusBadge status={post.status} /></td>
                  <td className="text-right">
                    <Link to={`/parent/posts/${post.id}/applications`} className="text-sm font-semibold text-brand-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {(!posts || posts.items.length === 0) && (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                        <Briefcase className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="font-semibold text-slate-700">No vacancies posted yet</p>
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

export default ParentPostsPage;
