"use client";
import { useEffect, useState } from "react";
import { safeFetch } from "@/lib/safeFetch";

interface Message {
  id: string;
  body: string;
  createdAt: string;
  direction: "incoming" | "outgoing";
}

export default function MessageThread({ contact }: { contact: any }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await safeFetch<Message[]>(`/api/Messages?contactId=${contact.id}`);
        setMessages(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [contact]);

  if (loading) return <p className="p-4">Loading messages...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!messages.length)
    return <p className="p-4 text-gray-500">No messages for this contact yet.</p>;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`max-w-xs p-3 rounded-2xl ${
            msg.direction === "outgoing"
              ? "ml-auto bg-blue-500 text-white rounded-br-none"
              : "mr-auto bg-gray-200 text-gray-800 rounded-bl-none"
          }`}
        >
          <p className="whitespace-pre-line">{msg.body}</p>
          <p
            className={`text-[10px] mt-1 ${
              msg.direction === "outgoing" ? "text-blue-100" : "text-gray-500"
            }`}
          >
            {new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
