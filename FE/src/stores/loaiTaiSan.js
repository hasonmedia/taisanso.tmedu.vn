import { create } from "zustand";
import {
  getAllLoaiTaiSan as apiGetAll,
  createLoaiTaiSan as apiCreate,
  updateLoaiTaiSan as apiUpdate,
  deleteLoaiTaiSan as apiDelete,
} from "../apis/loaiTaiSan";

export const LoaiTaiSanStore = create((set) => ({
  data: [],

  // Lấy tất cả loại tài sản
  getAllLoaiTaiSan: async (params = {}) => {
    try {
      const response = await apiGetAll(params);
      set({ data: response.data });
      return response.data;
    } catch (error) {
      console.error("Error fetching LoaiTaiSan:", error);
      return [];
    }
  },

  // Thêm loại tài sản
  createLoaiTaiSan: async (newData) => {
    try {
      const response = await apiCreate(newData);
      set((state) => ({
        data: [...state.data, response.data],
      }));
      return response.data;
    } catch (error) {
      console.error("Error creating LoaiTaiSan:", error);
      throw error; // Re-throw để component có thể catch
    }
  },

  // Cập nhật loại tài sản
  updateLoaiTaiSan: async (id, updatedData) => {
    try {
      const response = await apiUpdate(id, updatedData);
      set((state) => ({
        data: state.data.map((item) => (item.id === id ? response.data : item)),
      }));
      return response.data;
    } catch (error) {
      console.error("Error updating LoaiTaiSan:", error);
      throw error; // Re-throw để component có thể catch
    }
  },

  // Xóa loại tài sản
  deleteLoaiTaiSan: async (id) => {
    try {
      await apiDelete(id);
      set((state) => ({
        data: state.data.filter((item) => item.id !== id),
      }));
      return true;
    } catch (error) {
      console.error("Error deleting LoaiTaiSan:", error);
      throw error; // Re-throw để component có thể catch
    }
  },
}));
