import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import ChatPanel from "../../components/messaging/ChatPanel";
import { messagesApi } from "../../features/messages/api";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/authSlice";
import { MessageSquare, Headset, GraduationCap } from "lucide-react";

const ParentMessagesPage = () => {
  const user = useAppSelector(selectCurrentUser);
  const [selectedId, setSelectedId] = useState("");

  // Comes from the API rather than being derived from applications, so the list can never offer
  // a conversation the server would reject.
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["message-contacts"],
    queryFn: messagesApi.contacts,
  });

  const { data: conversation, refetch, isFetching } = useQuery({
    queryKey: ["messages", selectedId],
    queryFn: () => messagesApi.conversation(selectedId),
    enabled: Boolean(selectedId),
  });

  const sendMutation = useMutation({
    mutationFn: (body) => messagesApi.send({ receiverId: selectedId, body }),
    onSuccess: () => refetch(),
  });

  const selected = contacts.find((c) => c.userId === selectedId);

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader title="Messages" subtitle="Talk to your support team or your current teachers." icon={MessageSquare} />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <SectionCard title="Contacts" noPadding>
          {isLoading ? (
            <p className="px-6 py-8 text-center text-sm text-slate-400">Loading…</p>
          ) : contacts.length > 0 ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.userId}>
                  <button
                    onClick={() => setSelectedId(contact.userId)}
                    className={`flex w-full items-center gap-3 border-b border-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                      selectedId === contact.userId ? "bg-primary-50/50" : ""
                    }`}
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      {contact.role === "Admin" ? <Headset className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-900">{contact.name}</span>
                      <span className="block truncate text-xs text-slate-400">{contact.context}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 py-8 text-center text-sm text-slate-400">No contacts available.</p>
          )}
        </SectionCard>

        <div>
          {selectedId && conversation && user ? (
            <ChatPanel
              currentUserId={user.id}
              otherUserName={selected?.name ?? "Conversation"}
              messages={conversation}
              onSend={(body) => sendMutation.mutateAsync(body)}
            />
          ) : (
            <SectionCard>
              <div className="empty-state">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <MessageSquare className="h-6 w-6 text-slate-300" />
                </div>
                <p className="font-semibold text-slate-700">
                  {isFetching ? "Loading conversation…" : "Select a contact to start"}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Looking for a teacher you haven't hired yet? Message our support team — we'll
                  handle the introduction.
                </p>
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentMessagesPage;
