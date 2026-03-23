import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SectionCard from "../../components/ui/SectionCard";
import StatusBadge from "../../components/ui/StatusBadge";
import SelectField from "../../components/forms/SelectField";
import TextField from "../../components/forms/TextField";
import { postsApi } from "../../features/posts/api";
import { applicationsApi } from "../../features/applications/api";
import { demoApi } from "../../features/demo/api";

const ParentApplicationsPage = () => {
  const [selectedPostId, setSelectedPostId] = useState("");
  const [hireAmounts, setHireAmounts] = useState({});
  const [demoInputs, setDemoInputs] = useState({});
  const queryClient = useQueryClient();

  const { data: posts } = useQuery({
    queryKey: ["parent-posts"],
    queryFn: () => postsApi.myPosts({ page: 1, pageSize: 50 }),
  });

  const { data: applications } = useQuery({
    queryKey: ["applications", selectedPostId],
    queryFn: () => applicationsApi.listForPost(selectedPostId),
    enabled: Boolean(selectedPostId),
  });

  const mutation = useMutation({
    mutationFn: ({ applicationId, status, agreedAmount }) =>
      applicationsApi.updateStatus(applicationId, { status, agreedAmount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", selectedPostId] });
      queryClient.invalidateQueries({ queryKey: ["parent-posts"] });
    },
  });

  const demoMutation = useMutation({
    mutationFn: ({ teacherProfileId, tuitionPostId, date, time }) => {
      const normalizedTime = time.length === 5 ? `${time}:00` : time;
      return demoApi.create({
        teacherProfileId,
        tuitionPostId,
        selectedDate: date,
        selectedTime: normalizedTime,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["parent-demo"] }),
  });

  return (
    <div className="space-y-6">
      <SectionCard title="Select a tuition post">
        <SelectField label="Tuition Post" value={selectedPostId} onChange={(e) => setSelectedPostId(e.target.value)}>
          <option value="">Choose a post</option>
          {posts?.items.map((post) => (
            <option key={post.id} value={post.id}>
              {post.subject} ({post.city})
            </option>
          ))}
        </SelectField>
      </SectionCard>

      {selectedPostId && (
        <SectionCard title="Teacher applications">
          {applications && applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="rounded-2xl border border-slate-200 p-4 space-y-3">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{application.teacherName}</p>
                      <p className="text-sm text-slate-500">{application.message}</p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => mutation.mutate({ applicationId: application.id, status: "shortlisted" })}
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Shortlist
                    </button>
                    <button
                      onClick={() => mutation.mutate({ applicationId: application.id, status: "rejected" })}
                      className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Reject
                    </button>
                    <div className="flex items-center gap-2">
                      <TextField
                        label="Hire amount"
                        type="number"
                        value={hireAmounts[application.id] ?? ""}
                        onChange={(e) =>
                          setHireAmounts((prev) => ({ ...prev, [application.id]: Number(e.target.value) }))
                        }
                      />
                      <button
                        onClick={() =>
                          mutation.mutate({
                            applicationId: application.id,
                            status: "hired",
                            agreedAmount: hireAmounts[application.id],
                          })
                        }
                        className="rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
                        disabled={!hireAmounts[application.id]}
                      >
                        Hire & create payment
                      </button>
                    </div>
                    <div className="flex flex-wrap items-end gap-2">
                      <TextField
                        label="Demo date"
                        type="date"
                        value={demoInputs[application.id]?.date ?? ""}
                        onChange={(e) =>
                          setDemoInputs((prev) => ({
                            ...prev,
                            [application.id]: {
                              date: e.target.value,
                              time: prev[application.id]?.time ?? "",
                            },
                          }))
                        }
                      />
                      <TextField
                        label="Demo time"
                        type="time"
                        value={demoInputs[application.id]?.time ?? ""}
                        onChange={(e) =>
                          setDemoInputs((prev) => ({
                            ...prev,
                            [application.id]: {
                              date: prev[application.id]?.date ?? "",
                              time: e.target.value,
                            },
                          }))
                        }
                      />
                      <button
                        onClick={() =>
                          demoMutation.mutate({
                            teacherProfileId: application.teacherProfileId,
                            tuitionPostId: application.tuitionPostId,
                            date: demoInputs[application.id]?.date ?? "",
                            time: demoInputs[application.id]?.time ?? "",
                          })
                        }
                        className="rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-50 disabled:opacity-60"
                        disabled={
                          !demoInputs[application.id]?.date ||
                          !demoInputs[application.id]?.time ||
                          demoMutation.isPending
                        }
                      >
                        Request demo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No applications yet.</p>
          )}
        </SectionCard>
      )}
    </div>
  );
};

export default ParentApplicationsPage;

