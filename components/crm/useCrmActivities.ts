import { supabase } from "@/lib/supabaseClient";
import { useCallback, useEffect, useState } from "react";
import { CrmActivity, CrmActivityStatus, CrmActivityType } from "./types";

type NewActivityPayload = {
  contactId: string;
  type: CrmActivityType;
  title: string;
  note: string;
  dueDate: string;
  dueTime: string;
  status?: CrmActivityStatus;
};

type UpdateActivityPayload = Partial<NewActivityPayload> & {
  id: string;
  status?: CrmActivityStatus;
};

export function useCrmActivities(contactId?: string) {
  const [activities, setActivities] = useState<CrmActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : null;
  }, []);

  const loadActivities = useCallback(async () => {
    if (!contactId) return;
    setIsLoading(true);
    setError(null);
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      setError("Zaloguj sie, aby zobaczyc dzialania.");
      setIsLoading(false);
      return;
    }

    const response = await fetch(`/api/crm/activities?contactId=${encodeURIComponent(contactId)}`, {
      headers: authHeaders,
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Nie udalo sie pobrac dzialan.");
      setIsLoading(false);
      return;
    }

    setActivities(result.activities || []);
    setIsLoading(false);
  }, [contactId, getAuthHeaders]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  async function addActivity(payload: NewActivityPayload) {
    setError(null);
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      setError("Zaloguj sie, aby dodac dzialanie.");
      return null;
    }

    const response = await fetch("/api/crm/activities", {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Nie udalo sie dodac dzialania.");
      return null;
    }

    setActivities((current) => [result.activity, ...current]);
    return result.activity as CrmActivity;
  }

  async function updateActivityStatus(id: string, status: CrmActivityStatus) {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      setError("Zaloguj sie, aby zmienic dzialanie.");
      return null;
    }

    const previousActivities = activities;
    setActivities((current) =>
      current.map((activity) => (activity.id === id ? { ...activity, status } : activity)),
    );

    const response = await fetch("/api/crm/activities", {
      method: "PATCH",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const result = await response.json();
    if (!response.ok) {
      setActivities(previousActivities);
      setError(result.error || "Nie udalo sie zmienic dzialania.");
      return null;
    }

    setActivities((current) =>
      current.map((activity) => (activity.id === id ? result.activity : activity)),
    );
    return result.activity as CrmActivity;
  }

  async function updateActivity(payload: UpdateActivityPayload) {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      setError("Zaloguj sie, aby edytowac dzialanie.");
      return null;
    }

    const previousActivities = activities;
    setActivities((current) =>
      current.map((activity) =>
        activity.id === payload.id
          ? {
              ...activity,
              ...payload,
              contactId: payload.contactId ?? activity.contactId,
              dueDate: payload.dueDate ?? activity.dueDate,
              dueTime: payload.dueTime ?? activity.dueTime,
              status: payload.status ?? activity.status,
            }
          : activity,
      ),
    );

    const response = await fetch("/api/crm/activities", {
      method: "PATCH",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      setActivities(previousActivities);
      setError(result.error || "Nie udalo sie edytowac dzialania.");
      return null;
    }

    setActivities((current) =>
      current.map((activity) => (activity.id === payload.id ? result.activity : activity)),
    );
    return result.activity as CrmActivity;
  }

  async function deleteActivity(id: string) {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      setError("Zaloguj sie, aby usunac dzialanie.");
      return false;
    }

    const previousActivities = activities;
    setActivities((current) => current.filter((activity) => activity.id !== id));

    const response = await fetch("/api/crm/activities", {
      method: "DELETE",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const result = await response.json();
    if (!response.ok) {
      setActivities(previousActivities);
      setError(result.error || "Nie udalo sie usunac dzialania.");
      return false;
    }
    return true;
  }

  return {
    activities,
    isLoading,
    error,
    addActivity,
    updateActivity,
    updateActivityStatus,
    deleteActivity,
    reload: loadActivities,
  };
}
