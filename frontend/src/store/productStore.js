import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "react-toastify";

const useProductStore = create(
  devtools(
    (set, get) => ({
      products: [],
      loading: false,
      error: null,
      lastFetched: null,

      fetchProducts: async (force = false) => {
        const { products, lastFetched } = get();
        const isStale = !lastFetched || Date.now() - lastFetched > 5 * 60 * 1000;
        if (!force && products.length > 0 && !isStale) return;

        set({ loading: true, error: null }, false, "fetchProducts/start");
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/product`, {
            headers: {
              "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
              "Content-Type": "application/json",
            },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          set({ products: data?.data || data, loading: false, lastFetched: Date.now() }, false, "fetchProducts/success");
        } catch (err) {
          const message = err.message || "Failed to load products";
          set({ error: message, loading: false }, false, "fetchProducts/error");
          toast.error(message, { position: "top-right", toastId: "products-error" });
        }
      },

      createProduct: async (payload) => {
        try {
          const formData = new FormData();
          Object.entries(payload).forEach(([key, value]) => {
            if (key === "images" && Array.isArray(value)) {
              value.forEach((file) => formData.append("images", file));
            } else if (value !== null && value !== undefined && value !== "") {
              formData.append(key, value);
            }
          });

          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/product`, {
            method: "POST",
            headers: {
              "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
            },
            body: formData,
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const created = data?.data || data;
          set(
            (state) => ({ products: [created, ...state.products] }),
            false,
            "createProduct/success"
          );
          toast.success("Product created successfully", { position: "top-right", toastId: "product-create-success" });
          return created;
        } catch (err) {
          const message = err.message || "Failed to create product";
          toast.error(message, { position: "top-right", toastId: "product-create-error" });
          return null;
        }
      },

      updateProduct: async (id, payload) => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/product/${id}`, {
            method: "PUT",
            headers: {
              "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const updated = data?.data || data;
          set(
            (state) => ({ products: state.products.map((p) => (p._id === id ? updated : p)) }),
            false,
            "updateProduct/success"
          );
          toast.success("Product updated successfully", { position: "top-right", toastId: "product-update-success" });
          return updated;
        } catch (err) {
          const message = err.message || "Failed to update product";
          toast.error(message, { position: "top-right", toastId: "product-update-error" });
          return null;
        }
      },

      deleteProduct: async (id) => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/product/${id}`, {
            method: "DELETE",
            headers: {
              "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
            },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          set(
            (state) => ({ products: state.products.filter((p) => p._id !== id) }),
            false,
            "deleteProduct/success"
          );
          toast.success("Product deleted", { position: "top-right", toastId: "product-delete-success" });
          return true;
        } catch (err) {
          const message = err.message || "Failed to delete product";
          toast.error(message, { position: "top-right", toastId: "product-delete-error" });
          return false;
        }
      },

      resetProducts: () => set({ products: [], lastFetched: null }, false, "resetProducts"),
    }),
    { name: "ProductStore" }
  )
);

export default useProductStore;
