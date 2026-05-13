import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "react-toastify";
import { apiFetch } from "@/helpers/httpClient";

const useCisrEventStore = create(
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

        set({ loading: true, error: null }, false, "fetchCisrEvents/start");
        try {
          const data = await apiFetch("/api/cisr-events", {
            headers: { "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET },
          });
          set({ events: data?.data || data, loading: false, lastFetched: Date.now() }, false, "fetchCisrEvents/success");
        } catch (err) {
          const message = err.message || "Failed to load CISR events";
          set({ error: message, loading: false }, false, "fetchCisrEvents/error");
          toast.error(message, { position: "top-right", toastId: "cisr-events-fetch-error" });
        }
      },

      createEvent: async (payload) => {
        try {
          const data = await apiFetch("/api/cisr-events", {
            method: "POST",
            headers: {
              "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          const created = data?.data || data;
          set((state) => ({ events: [created, ...state.events] }), false, "createCisrEvent/success");
          toast.success("CISR event created successfully", { position: "top-right", toastId: "cisr-event-create-success" });
          return created;
        } catch (err) {
          const message = err.message || "Failed to create CISR event";
          toast.error(message, { position: "top-right", toastId: "cisr-event-create-error" });
          return null;
        }
      },

      updateEvent: async (id, payload) => {
        try {
          const data = await apiFetch(`/api/cisr-events/${id}`, {
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
            "updateCisrEvent/success"
          );
          toast.success("CISR event updated successfully", { position: "top-right", toastId: "cisr-event-update-success" });
          return updated;
        } catch (err) {
          const message = err.message || "Failed to update CISR event";
          toast.error(message, { position: "top-right", toastId: "cisr-event-update-error" });
          return null;
        }
      },

      deleteEvent: async (id) => {
        try {
          await apiFetch(`/api/cisr-events/${id}`, {
            method: "DELETE",
            headers: { "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET },
          });
          set(
            (state) => ({ events: state.events.filter((e) => e._id !== id) }),
            false,
            "deleteCisrEvent/success"
          );
          toast.success("CISR event deleted", { position: "top-right", toastId: "cisr-event-delete-success" });
          return true;
        } catch (err) {
          const message = err.message || "Failed to delete CISR event";
          toast.error(message, { position: "top-right", toastId: "cisr-event-delete-error" });
          return false;
        }
      },

      resetEvents: () => set({ events: [], lastFetched: null }, false, "resetCisrEvents"),
    }),
    { name: "CisrEventStore" }
  )
);

export default useCisrEventStore;
