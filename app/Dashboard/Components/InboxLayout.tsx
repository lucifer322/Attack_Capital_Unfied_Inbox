"use client";
import { useState } from "react";
import SidebarContacts from "@/app/Dashboard/Components/SidebarContacts";
import MessageThread from "@/app/Dashboard/Components/MessageThread"
import MessageComposer from "@/app/Dashboard/Components/MessageComposer";

export default function InboxLayout() {
  const [selectedContact, setSelectedContact] = useState<any>(null);

  return (
    <div className="h-full flex">
      {/* Sidebar (Contacts) */}
      <div className="w-1/3 border-r bg-white p-4 overflow-y-auto">
        <SidebarContacts onSelect={setSelectedContact} />
      </div>

      {/* Main thread */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {selectedContact ? (
          <>
            <MessageThread contact={selectedContact} />
            <MessageComposer contact={selectedContact} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a contact to view messages 💬
          </div>
        )}
      </div>
    </div>
  );
}
