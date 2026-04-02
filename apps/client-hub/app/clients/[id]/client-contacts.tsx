"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ContactForm } from "@/components/contact-form";

interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  isPrimary: boolean;
}

interface ClientContactsProps {
  clientId: string;
  initialContacts: Contact[];
}

export function ClientContacts({ clientId, initialContacts }: ClientContactsProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  async function handleDelete(contactId: string) {
    if (!confirm("Remove this contact?")) return;
    await fetch(`/api/clients/${clientId}/contacts/${contactId}`, {
      method: "DELETE",
    });
    router.refresh();
  }

  function handleSuccess() {
    setShowForm(false);
    setEditingContact(null);
    router.refresh();
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">
          Contacts ({initialContacts.length})
        </h3>
        {!showForm && !editingContact && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + Add Contact
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-4">
          <ContactForm
            clientId={clientId}
            mode="create"
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {initialContacts.length === 0 && !showForm ? (
        <p className="text-sm text-gray-500">No contacts yet.</p>
      ) : (
        <ul className="space-y-3">
          {initialContacts.map((contact) => (
            <li key={contact.id}>
              {editingContact?.id === contact.id ? (
                <ContactForm
                  clientId={clientId}
                  initialData={{
                    id: contact.id,
                    name: contact.name,
                    email: contact.email || "",
                    phone: contact.phone || "",
                    role: contact.role || "",
                    isPrimary: contact.isPrimary,
                  }}
                  mode="edit"
                  onSuccess={handleSuccess}
                  onCancel={() => setEditingContact(null)}
                />
              ) : (
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{contact.name}</span>
                      {contact.isPrimary && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded font-medium">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {[contact.role, contact.email, contact.phone]
                        .filter(Boolean)
                        .join(" \u00B7 ")}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingContact(contact)}
                      className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="text-xs text-red-400 hover:text-red-600 px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
