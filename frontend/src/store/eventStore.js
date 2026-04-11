import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "react-toastify";
import { apiFetch } from "@/helpers/httpClient";

const useEventStore = create(
  devtools(
    (set, get) => ({
      events: [],
      loading: false,
      error: null,
      lastFetched: null,

      fetchEvents: async (force = false) => {
        const { events, lastFetched } = get();
        const isStale = !lastFetched || Date.now() - lastFetched > 5 * 60 * 1000;
        if (!force && events.length > 0 && !isStale) return;

        set({ loading: true, error: null }, false, "fetchEvents/start");
        try {
          const data = await apiFetch("/api/events", {
            headers: { "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET },
          });
          set({ events: data?.data || data, loading: false, lastFetched: Date.now() }, false, "fetchEvents/success");
        } catch (err) {
          const message = err.message || "Failed to load events";
          set({ error: message, loading: false }, false, "fetchEvents/error");
          toast.error(message, { position: "top-right", toastId: "events-fetch-error" });
        }
      },

      createEvent: async (payload) => {
        try {
          const data = await apiFetch("/api/events", {
            method: "POST",
            headers: {
              "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          const created = data?.data || data;
          set((state) => ({ events: [created, ...state.events] }), false, "createEvent/success");
          toast.success("Event created successfully", { position: "top-right", toastId: "event-create-success" });
          return created;
        } catch (err) {
          const message = err.message || "Failed to create event";
          toast.error(message, { position: "top-right", toastId: "event-create-error" });
          return null;
        }
      },

      updateEvent: async (id, payload) => {
        try {
          const data = await apiFetch(`/api/events/${id}`, {
            method: "PUT",
            headers: {
              "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          const updated = data?.data || data;
          set(
            (state) => ({ events: state.events.map((e) => (e._id === id ? updated : e)) }),
            false,
            "updateEvent/success"
          );
          toast.success("Event updated successfully", { position: "top-right", toastId: "event-update-success" });
          return updated;
        } catch (err) {
          const message = err.message || "Failed to update event";
          toast.error(message, { position: "top-right", toastId: "event-update-error" });
          return null;
        }
      },

      deleteEvent: async (id) => {
        try {
          await apiFetch(`/api/events/${id}`, {
            method: "DELETE",
            headers: { "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET },
          });
          set(
            (state) => ({ events: state.events.filter((e) => e._id !== id) }),
            false,
            "deleteEvent/success"
          );
          toast.success("Event deleted", { position: "top-right", toastId: "event-delete-success" });
          return true;
        } catch (err) {
          const message = err.message || "Failed to delete event";
          toast.error(message, { position: "top-right", toastId: "event-delete-error" });
          return false;
        }
      },

      resetEvents: () => set({ events: [], lastFetched: null }, false, "resetEvents"),
    }),
    { name: "EventStore" }
  )
);

export default useEventStore;
