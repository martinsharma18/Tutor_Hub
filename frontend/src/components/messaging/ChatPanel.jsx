import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

const ChatPanel = ({ currentUserId, otherUserName, messages, onSend }) => {
  const { register, handleSubmit, reset } = useForm({ defaultValues: { message: "" } });
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (values) => {
    if (!values.message.trim()) return;
    await onSend(values.message);
    reset();
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 px-4 py-3">
        <p className="text-sm text-slate-500">Conversation with</p>
        <p className="text-lg font-semibold text-slate-900">{otherUserName}</p>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message) => {
          const isMine = message.senderId === currentUserId;
          return (
            <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs rounded-2xl px-4 py-2 text-sm shadow ${
                  isMine ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-800"
                }`}
              >
                {message.body}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="border-t border-slate-100 p-4 flex gap-3">
        <input
          {...register("message")}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="submit"
          className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;

