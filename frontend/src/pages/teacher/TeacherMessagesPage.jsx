import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import SectionCard from "../../components/ui/SectionCard";
import SelectField from "../../components/forms/SelectField";
import ChatPanel from "../../components/messaging/ChatPanel";
import { teacherApi } from "../../features/teachers/api";
import { messagesApi } from "../../features/messages/api";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/authSlice";

const TeacherMessagesPage = () => {
  const user = useAppSelector(selectCurrentUser);
  const [selectedParentId, setSelectedParentId] = useState("");

  const { data: applications } = useQuery({
    queryKey: ["teacher-applications"],
    queryFn: teacherApi.myApplications,
  });

  const contacts = useMemo(() => {
    if (!applications) return [];
    const dedup = new Map();
    applications.forEach((app) => {
      dedup.set(app.postOwnerId, { id: app.postOwnerId, label: `Parent for ${app.postSubject}` });
    });
    return Array.from(dedup.values());
  }, [applications]);

  const {
    data: conversation,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["messages", selectedParentId],
    queryFn: () => messagesApi.conversation(selectedParentId),
    enabled: Boolean(selectedParentId),
  });

  const sendMutation = useMutation({
    mutationFn: (body) => messagesApi.send({ receiverId: selectedParentId, body }),
    onSuccess: () => refetch(),
  });

  return (
    <div className="space-y-6">
      <SectionCard title="Choose parent conversation">
        <SelectField label="Parent" value={selectedParentId} onChange={(e) => setSelectedParentId(e.target.value)}>
          <option value="">Select parent</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.label}
            </option>
          ))}
        </SelectField>
      </SectionCard>

      {selectedParentId && conversation && user ? (
        <ChatPanel
          currentUserId={user.id}
          otherUserName={contacts.find((c) => c.id === selectedParentId)?.label ?? "Parent"}
          messages={conversation}
          onSend={(body) => sendMutation.mutateAsync(body)}
        />
      ) : (
        <p className="text-sm text-slate-500">{isFetching ? "Loading conversation..." : "Select a parent to start chatting."}</p>
      )}
    </div>
  );
};

export default TeacherMessagesPage;

