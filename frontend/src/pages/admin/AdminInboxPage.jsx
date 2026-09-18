import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import ChatPanel from "../../components/messaging/ChatPanel";
import { messagesApi } from "../../features/messages/api";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/authSlice";
import { Inbox, Search, GraduationCap, Users, PenSquare } from "lucide-react";

/**
 * The office's communication hub. Because parent<->teacher chat is gated behind a live placement,
 * every pre-placement conversation lands here — without this page the platform tells users to
 * contact an admin who cannot reply.
 *
 * Two panes: existing threads (with unread markers) and a directory for starting a new one.
 */
const AdminInboxPage = () => {
  const user = useAppSelector(selectCurrentUser);
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState("");
  const [showDirectory, setShowDirectory] = useState(false);
  const [search, setSearch] = useState("");

  const { data: inbox = [], isLoading: inboxLoading } = useQuery({
    queryKey: ["messages-inbox"],
    queryFn: messagesApi.inbox,
    refetchInterval: 60_000, // realtime push also invalidates this; polling is the safety net
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ["message-contacts"],
    queryFn: messagesApi.contacts,
    enabled: showDirectory,
  });

  const { data: conversation, refetch } = useQuery({
    queryKey: ["messages", selectedId],
    queryFn: () => messagesApi.conversation(selectedId),
    enabled: Boolean(selectedId),
  });

  const sendMutation = useMutation({
    mutationFn: (body) => messagesApi.send({ receiverId: selectedId, body }),
    onSuccess: () => {
      refetch();
      // A brand-new thread won't appear in the inbox list until it has a message.
      queryClient.invalidateQueries({ queryKey: ["messages-inbox"] });
    },
  });

  const filteredContacts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return contacts;
    return contacts.filter((c) => c.name.toLowerCase().includes(term));
  }, [contacts, search]);

  // Prefer the inbox entry's name; fall back to the directory when starting a fresh thread.
  const selectedName =
    inbox.find((c) => c.otherUserId === selectedId)?.otherUserName ??
    contacts.find((c) => c.userId === selectedId)?.name ??
    "Conversation";

  const unreadCount = inbox.filter((c) => c.lastMessageIsUnread).length;

  const openThread = (userId) => {
    setSelectedId(userId);
    setShowDirectory(false);
    // Opening a thread marks it read server-side, so refresh the unread markers.
    queryClient.invalidateQueries({ queryKey: ["messages-inbox"] });
    queryClient.invalidateQueries({ queryKey: ["messages-unread-count"] });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader
        title="Inbox"
        subtitle={
          unreadCount > 0
            ? `${unreadCount} conversation${unreadCount !== 1 ? "s" : ""} need a reply`
            : "Messages from parents and teachers."
        }
        icon={Inbox}
        actions={
          <button
            onClick={() => setShowDirectory((v) => !v)}
            className="btn-primary text-sm"
          >
            <PenSquare className="h-4 w-4" />
            {showDirectory ? "Back to inbox" : "New message"}
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {showDirectory ? (
          <SectionCard title="Start a conversation" noPadding>
            <div className="border-b border-slate-100 p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name…"
                  className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <ul className="max-h-[520px] overflow-y-auto">
              {filteredContacts.map((contact) => (
                <li key={contact.userId}>
                  <button
                    onClick={() => openThread(contact.userId)}
                    className="flex w-full items-center gap-3 border-b border-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      {contact.role === "Teacher" ? <GraduationCap className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-900">{contact.name}</span>
                      <span className="block truncate text-xs text-slate-400">{contact.context}</span>
                    </span>
                  </button>
                </li>
              ))}
              {filteredContacts.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-slate-400">
                  {search ? "No one matches that name." : "No parents or teachers yet."}
                </li>
              )}
            </ul>
          </SectionCard>
        ) : (
          <SectionCard title="Conversations" subtitle={`${inbox.length} total`} noPadding>
            {inboxLoading ? (
              <p className="px-6 py-8 text-center text-sm text-slate-400">Loading…</p>
            ) : inbox.length > 0 ? (
              <ul className="max-h-[560px] overflow-y-auto">
                {inbox.map((c) => (
                  <li key={c.otherUserId}>
                    <button
                      onClick={() => openThread(c.otherUserId)}
                      className={`flex w-full flex-col gap-1 border-b border-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                        selectedId === c.otherUserId ? "bg-primary-50/50" : ""
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-slate-900">{c.otherUserName}</span>
                        {c.lastMessageIsUnread && (
                          <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary-600" />
                        )}
                      </span>
                      <span className="truncate text-xs text-slate-500">{c.lastMessageBody}</span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(c.lastMessageAtUtc).toLocaleString()}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state px-6 py-10">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Inbox className="h-6 w-6 text-slate-300" />
                </div>
                <p className="font-semibold text-slate-700">No messages yet</p>
                <p className="mt-1 text-sm text-slate-400">
                  Use "New message" to reach a parent or teacher.
                </p>
              </div>
            )}
          </SectionCard>
        )}

        <div>
          {selectedId && conversation && user ? (
            <ChatPanel
              currentUserId={user.id}
              otherUserName={selectedName}
              messages={conversation}
              onSend={(body) => sendMutation.mutateAsync(body)}
            />
          ) : (
            <SectionCard>
              <div className="empty-state">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Inbox className="h-6 w-6 text-slate-300" />
                </div>
                <p className="font-semibold text-slate-700">Select a conversation</p>
                <p className="mt-1 text-sm text-slate-400">
                  Parents and teachers contact the office here before a tuition is set up.
                </p>
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInboxPage;
