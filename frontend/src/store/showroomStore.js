import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "react-toastify";
import { apiFetch } from "@/helpers/httpClient";

const useShowroomStore = create(
  devtools(
    (set, get) => ({
      showrooms: [],
      loading: false,
      error: null,
      lastFetched: null,

      fetchShowrooms: async (force = false) => {
        const { showrooms, lastFetched } = get();
        const isStale = !lastFetched || Date.now() - lastFetched > 5 * 60 * 1000;
        if (!force && showrooms.length > 0 && !isStale) return;

        set({ loading: true, error: null }, false, "fetchShowrooms/start");
        try {
          const data = await apiFetch("/api/showrooms", {
            headers: { "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET },
          });
          set({ showrooms: data?.data || data, loading: false, lastFetched: Date.now() }, false, "fetchShowrooms/success");
        } catch (err) {
          const message = err.message || "Failed to load showrooms";
          set({ error: message, loading: false }, false, "fetchShowrooms/error");
          toast.error(message, { position: "top-right", toastId: "showrooms-fetch-error" });
        }
      },

      createShowroom: async (payload) => {
        try {
          const data = await apiFetch("/api/showrooms", {
            method: "POST",
            headers: {
              "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          const created = data?.data || data;
          set((state) => ({ showrooms: [created, ...state.showrooms] }), false, "createShowroom/success");
          toast.success("Showroom created successfully", { position: "top-right", toastId: "showroom-create-success" });
          return created;
        } catch (err) {
          const message = err.message || "Failed to create showroom";
          toast.error(message, { position: "top-right", toastId: "showroom-create-error" });
          return null;
        }
      },

      updateShowroom: async (id, payload) => {
        try {
          const data = await apiFetch(`/api/showrooms/${id}`, {
            method: "PUT",
            headers: {
              "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          const updated = data?.data || data;
          set(
            (state) => ({ showrooms: state.showrooms.map((s) => (s._id === id ? updated : s)) }),
            false,
            "updateShowroom/success"
          );
          toast.success("Showroom updated successfully", { position: "top-right", toastId: "showroom-update-success" });
          return updated;
        } catch (err) {
          const message = err.message || "Failed to update showroom";
          toast.error(message, { position: "top-right", toastId: "showroom-update-error" });
          return null;
        }
      },

      deleteShowroom: async (id) => {
        try {
          await apiFetch(`/api/showrooms/${id}`, {
            method: "DELETE",
            headers: { "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET },
          });
          set(
            (state) => ({ showrooms: state.showrooms.filter((s) => s._id !== id) }),
            false,
            "deleteShowroom/success"
          );
          toast.success("Showroom deleted", { position: "top-right", toastId: "showroom-delete-success" });
          return true;
        } catch (err) {
          const message = err.message || "Failed to delete showroom";
          toast.error(message, { position: "top-right", toastId: "showroom-delete-error" });
          return false;
        }
      },

      resetShowrooms: () => set({ showrooms: [], lastFetched: null }, false, "resetShowrooms"),
    }),
    { name: "ShowroomStore" }
  )
);

export default useShowroomStore;
