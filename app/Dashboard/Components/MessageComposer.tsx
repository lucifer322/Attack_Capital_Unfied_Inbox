"use client";
import { useState } from "react";
import { safeFetch } from "@/lib/safeFetch";

export default function MessageComposer({ contact }: { contact: any }) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await safeFetch("/api/twilio/send", {
        method: "POST",
        body: JSON.stringify({
          to: contact.phone,
          body,
        }),
      });

      setBody("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSend}
      className="border-t bg-white p-3 flex items-center gap-2"
    >
      <input
        type="text"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={`Message ${contact.name}...`}
        className="flex-1 border rounded p-2"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Sending..." : "Send"}
      </button>
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </form>
  );
}
