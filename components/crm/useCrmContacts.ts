import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CrmContact, CrmStatus } from "./types";

type NewContactPayload = {
  name: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  country: string;
  maxBudget: number;
  bedrooms: string;
  bathrooms: string;
  coast: string;
  purchaseTimeline: string;
  pipelineOwner?: string;
  status: CrmStatus;
};

type UpdateContactPayload = Partial<NewContactPayload> & {
  id: string;
};

export function useCrmContacts(owner?: string) {
  const [contacts, setContacts] = useState<CrmContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      return null;
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const loadContacts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      setContacts([]);
      setError("Zaloguj sie, aby zobaczyc CRM.");
      setIsLoading(false);
      return;
    }

    const query = owner ? `?owner=${encodeURIComponent(owner)}` : "";
    const response = await fetch(`/api/crm/contacts${query}`, {
      headers: authHeaders,
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Nie udalo sie pobrac kontaktow.");
      setIsLoading(false);
      return;
    }
    setContacts(result.contacts || []);
    setIsLoading(false);
  }, [getAuthHeaders, owner]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  async function addContact(payload: NewContactPayload) {
    setError(null);
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      setError("Zaloguj sie, aby dodac kontakt.");
      return null;
    }

    const response = await fetch("/api/crm/contacts", {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Nie udalo sie dodac kontaktu.");
      return null;
    }
    setContacts((current) => [result.contact, ...current]);
    return result.contact as CrmContact;
  }

  async function updateContactStatus(id: string, status: CrmStatus) {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      setError("Zaloguj sie, aby zmienic etap.");
      return null;
    }

    const previousContacts = contacts;
    setContacts((current) =>
      current.map((contact) => (contact.id === id ? { ...contact, status } : contact)),
    );

    const response = await fetch("/api/crm/contacts", {
      method: "PATCH",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const result = await response.json();
    if (!response.ok) {
      setContacts(previousContacts);
      setError(result.error || "Nie udalo sie zmienic etapu.");
      return null;
    }
    setContacts((current) =>
      current.map((contact) => (contact.id === id ? result.contact : contact)),
    );
    return result.contact as CrmContact;
  }

  async function updateContact(payload: UpdateContactPayload) {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      setError("Zaloguj sie, aby edytowac kontakt.");
      return null;
    }

    const previousContacts = contacts;
    setContacts((current) =>
      current.map((contact) =>
        contact.id === payload.id
          ? {
              ...contact,
              ...payload,
              value: payload.value ?? contact.value,
              status: payload.status ?? contact.status,
            }
          : contact,
      ),
    );

    const response = await fetch("/api/crm/contacts", {
      method: "PATCH",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      setContacts(previousContacts);
      setError(result.error || "Nie udalo sie edytowac kontaktu.");
      return null;
    }
    setContacts((current) =>
      current.map((contact) => (contact.id === payload.id ? result.contact : contact)),
    );
    return result.contact as CrmContact;
  }

  async function deleteContact(id: string) {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      setError("Zaloguj sie, aby usunac kontakt.");
      return false;
    }

    const previousContacts = contacts;
    setContacts((current) => current.filter((contact) => contact.id !== id));

    const response = await fetch("/api/crm/contacts", {
      method: "DELETE",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const result = await response.json();
    if (!response.ok) {
      setContacts(previousContacts);
      setError(result.error || "Nie udalo sie usunac kontaktu.");
      return false;
    }
    return true;
  }

  return {
    contacts,
    isLoading,
    error,
    addContact,
    updateContact,
    updateContactStatus,
    deleteContact,
    reload: loadContacts,
  };
}
