import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import SectionCard from "../../components/ui/SectionCard";
import SelectField from "../../components/forms/SelectField";
import ChatPanel from "../../components/messaging/ChatPanel";
import { postsApi } from "../../features/posts/api";
import { applicationsApi } from "../../features/applications/api";
import { messagesApi } from "../../features/messages/api";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/authSlice";

const ParentMessagesPage = () => {
  const user = useAppSelector(selectCurrentUser);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  const { data: posts } = useQuery({
    queryKey: ["parent-posts"],
    queryFn: () => postsApi.myPosts({ page: 1, pageSize: 20 }),
  });

  const { data: applications } = useQuery({
    queryKey: ["applications", selectedPostId],
    queryFn: () => applicationsApi.listForPost(selectedPostId),
    enabled: Boolean(selectedPostId),
  });

  useEffect(() => {
    setSelectedTeacherId("");
  }, [selectedPostId]);

  const currentTeacher = applications?.find((app) => app.teacherUserId === selectedTeacherId);

  const {
    data: messages,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["messages", selectedTeacherId],
    queryFn: () => messagesApi.conversation(selectedTeacherId),
    enabled: Boolean(selectedTeacherId),
  });

  const sendMutation = useMutation({
    mutationFn: (body) => messagesApi.send({ receiverId: selectedTeacherId, body }),
    onSuccess: () => refetch(),
  });

  return (
    <div className="space-y-6">
      <SectionCard title="Choose conversation">
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField label="Tuition Post" value={selectedPostId} onChange={(e) => setSelectedPostId(e.target.value)}>
            <option value="">Select Post</option>
            {posts?.items.map((post) => (
              <option key={post.id} value={post.id}>
                {post.subject} ({post.city})
              </option>
            ))}
          </SelectField>
          {applications && (
            <SelectField
              label="Teacher"
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
            >
              <option value="">Select Teacher</option>
              {applications.map((app) => (
                <option key={app.id} value={app.teacherUserId}>
                  {app.teacherName}
                </option>
              ))}
            </SelectField>
          )}
        </div>
      </SectionCard>

      {selectedTeacherId && messages && user ? (
        <ChatPanel
          currentUserId={user.id}
          otherUserName={currentTeacher?.teacherName ?? "Teacher"}
          messages={messages}
          onSend={(body) => sendMutation.mutateAsync(body)}
        />
      ) : (
        <p className="text-sm text-slate-500">{isFetching ? "Loading conversation..." : "Select a teacher to start chatting."}</p>
      )}
    </div>
  );
};

export default ParentMessagesPage;

