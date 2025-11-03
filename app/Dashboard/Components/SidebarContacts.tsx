"use client";
import { useEffect, useState } from "react";
import { safeFetch } from "@/lib/safeFetch";

interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

export default function SidebarContacts({
  onSelect,
}: {
  onSelect: (c: Contact) => void;
}) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await safeFetch<Contact[]>("/api/Contacts");
        setContacts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="🔍 Search contacts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border w-full rounded p-2 mb-3"
      />

      {loading && <p className="text-gray-500">Loading contacts...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !contacts.length && <p>No contacts yet.</p>}

      <ul className="space-y-2">
        {filtered.map((c) => (
          <li
            key={c.id}
            onClick={() => onSelect(c)}
            className="p-3 border rounded hover:bg-gray-100 cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold">{c.name}</p>
              {c.phone?.includes("whatsapp") ? (
                <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-1 rounded">
                  WhatsApp
                </span>
              ) : (
                <span className="text-blue-600 text-xs font-bold bg-blue-100 px-2 py-1 rounded">
                  SMS
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{c.phone || c.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
