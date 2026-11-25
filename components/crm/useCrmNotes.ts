import { supabase } from "@/lib/supabaseClient";
import { useCallback, useEffect, useState } from "react";
import { CrmNote } from "./types";

export function useCrmNotes(contactId?: string) {
  const [notes, setNotes] = useState<CrmNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : null;
  }, []);

  const loadNotes = useCallback(async () => {
    if (!contactId) return;
    setIsLoading(true);
    setError(null);
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      setIsLoading(false);
      return;
    }
    const response = await fetch(`/api/crm/notes?contactId=${encodeURIComponent(contactId)}`, {
      headers: authHeaders,
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Nie udalo sie pobrac notatek.");
      setIsLoading(false);
      return;
    }
    setNotes(result.notes || []);
    setIsLoading(false);
  }, [contactId, getAuthHeaders]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  async function send(method: "POST" | "PATCH" | "DELETE", body: Record<string, string>) {
    setError(null);
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      setError("Zaloguj sie ponownie.");
      return null;
    }
    const response = await fetch("/api/crm/notes", {
      method,
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Nie udalo sie zapisac notatki.");
      return null;
    }
    return result;
  }

  async function addNote(text: string) {
    if (!contactId) return null;
    const result = await send("POST", { contactId, body: text });
    if (!result?.note) return null;
    setNotes((current) => [result.note, ...current]);
    return result.note as CrmNote;
  }

  async function updateNote(id: string, text: string) {
    const result = await send("PATCH", { id, body: text });
    if (!result?.note) return null;
    setNotes((current) => current.map((note) => (note.id === id ? result.note : note)));
    return result.note as CrmNote;
  }

  async function deleteNote(id: string) {
    const result = await send("DELETE", { id });
    if (!result) return false;
    setNotes((current) => current.filter((note) => note.id !== id));
    return true;
  }

  return { notes, isLoading, error, addNote, updateNote, deleteNote, reload: loadNotes };
}
