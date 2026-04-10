import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "react-toastify";

const useQrCodeStore = create(
  devtools(
    (set, get) => ({
      qrCodes: [],
      loading: false,
      error: null,
      lastFetched: null,

      fetchQrCodes: async (force = false) => {
        const { qrCodes, lastFetched } = get();
        const isStale = !lastFetched || Date.now() - lastFetched > 5 * 60 * 1000;
        if (!force && qrCodes.length > 0 && !isStale) return;

        set({ loading: true, error: null }, false, "fetchQrCodes/start");
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/qr-code`, {
            headers: {
              "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
              "Content-Type": "application/json",
            },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          set({ qrCodes: data?.data || data, loading: false, lastFetched: Date.now() }, false, "fetchQrCodes/success");
        } catch (err) {
          const message = err.message || "Failed to load QR codes";
          set({ error: message, loading: false }, false, "fetchQrCodes/error");
          toast.error(message, { position: "top-right", toastId: "qrcodes-error" });
        }
      },

      resetQrCodes: () => set({ qrCodes: [], lastFetched: null }, false, "resetQrCodes"),
    }),
    { name: "QrCodeStore" }
  )
);

export default useQrCodeStore;
