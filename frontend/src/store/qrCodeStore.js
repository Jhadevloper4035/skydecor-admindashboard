import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "react-toastify";
import { apiFetch } from "@/helpers/httpClient";

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
          const data = await apiFetch("/api/qr-code", {
            headers: { "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET },
          });
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
