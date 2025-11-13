import {
  getUsers as getUser,
  themTaiKhoan as them,
  suaTaiKhoan as update,
  xoaTaiKhoan,
} from "../apis/tai_khoan";
import { create } from "zustand";
export const UserStore = create((set, get) => ({
  data: [],

  getUsers: async () => {
    try {
      const res = await getUser();
      set({ data: res.data });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  themTaiKhoan: async (data) => {
    try {
      console.log(data);
      const response = await them(data);
      console.log(response);
      return response;
    } catch (error) {
      console.error("Lỗi API:", error.response || error.message);
      // Trả về object giống format của server để FE xử lý
      return (
        error.response?.data || {
          success: false,
          error: "Lỗi Username đã tồn tại",
        }
      );
    }
  },

  suaTaiKhoan: async (id, data1) => {
    try {
      const response = await update(id, data1);
      set((state) => ({
        data: state.data.map((u) => (u.id === id ? { ...u, ...data1 } : u)),
      }));
      return response;
    } catch (error) {
      console.log(error.message);
    }
  },

  xoaTaiKhoan: async (id) => {
    try {
      console.log("Xóa tài khoản với id:", id);
      await xoaTaiKhoan(id);
      set((state) => ({
        data: state.data.filter((u) => u.id !== id),
      }));
    } catch (error) {
      console.log(error.message);
    }
  },
}));
