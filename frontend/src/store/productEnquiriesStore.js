import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "react-toastify";
const useProductEnquiriesStore = create(
  devtools(
    (set, get) => ({
      leads: [],
      loading: false,
      error: null,
      lastFetched: null,

      fetchLeads: async (force = false) => {
        const { leads, lastFetched } = get();
        const isStale = !lastFetched || Date.now() - lastFetched > 5 * 60 * 1000;
        if (!force && leads.length > 0 && !isStale) return;

        set({ loading: true, error: null }, false, "fetchLeads/start");
        try {
          const res = await fetch(`${import.meta.env.VITE_WEBSITE_BASE_URL}/api/lead/productEnquiry`, {
            headers: {
              "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
              "Content-Type": "application/json",
            },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          set({ leads: data?.data || data, loading: false, lastFetched: Date.now() }, false, "fetchLeads/success");
        } catch (err) {
          const message = err.message || "Failed to load product enquiries";
          set({ error: message, loading: false }, false, "fetchLeads/error");
          toast.error(message, { position: "top-right", toastId: "product-enquiries-error" });
        }
      },

      resetLeads: () => set({ leads: [], lastFetched: null }, false, "resetLeads"),
    }),
    { name: "ProductEnquiriesStore" }
  )
);

export default useProductEnquiriesStore;
