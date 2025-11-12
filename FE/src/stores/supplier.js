import {
  getSuppliers,
  themNhaCungCap,
  suaNhaCungCap,
  xoaNhaCungCap,
} from "../apis/supplier";
import { create } from "zustand";
export const SupplierStore = create((set) => ({
  data: [],
  getSuppliers: async (filter = []) => {
    try {
      const response = await getSuppliers(filter);
      set({ data: response });
      return response;
    } catch (error) {
      console.log(error.message);
    }
  },
  themNhaCungCap: async (data) => {
    try {
      const response = await themNhaCungCap(data);
      if (response.success === false) {
        throw new Error(response.message);
      }
      set((state) => ({
        data: [...state.data, response],
      }));
      return response;
    } catch (error) {
      console.log(error);
      throw error; // Re-throw để component có thể catch
    }
  },
  suaNhaCungCap: async (id, data) => {
    try {
      const response = await suaNhaCungCap(id, data);
      set((state) => ({
        data: state.data.map((item) => (item.id === id ? response : item)),
      }));
      return response;
    } catch (error) {
      console.log(error);
      throw error; // Re-throw để component có thể catch
    }
  },

  xoaNhaCungCap: async (id) => {
    try {
      await xoaNhaCungCap(id);
      set((state) => ({
        data: state.data.filter((item) => item.id !== id),
      }));
    } catch (error) {
      console.log(error);
      throw error; // Re-throw để component có thể catch
    }
  },
}));
