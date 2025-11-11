import {
  getAllAssetLoginInfo,
  createAssetLoginInfo,
  getAssetLoginInfoPrivate,
  getAssetExpired,
  updateAssetLoginInfo as update,
} from "../apis/assetLoginInfo";
import { create } from "zustand";

export const AssetLoginInfoStore = create((set) => ({
  data: [],
  dataPrivate: [],
  expired: [],

  getAllAssetLoginInfo: async (page, filters) => {
    try {
      const response = await getAllAssetLoginInfo(page, filters);
      set({ data: response });
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  getAssetLoginInfoPrivate: async () => {
    try {
      const response = await getAssetLoginInfoPrivate();
      set({ dataPrivate: response });
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  getAssetExpired: async () => {
    try {
      const response = await getAssetExpired();
      set({ expired: response.value });
      return response.value;
    } catch (error) {
      console.log(error);
    }
  },

  createAssetLoginInfo: async (data) => {
    try {
      const response = await createAssetLoginInfo(data);
      set((state) => ({
        data: [...(state.data || []), response.data],
      }));
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  updateAssetLoginInfo: async (id, data) => {
    try {
      const response = await update(id, data);
      const updatedItem = response.data;
      console.log(updatedItem);
      set((state) => ({
        data: state.data.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        ),
        expired: state.expired.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        ),
      }));
      ``;

      if (updatedItem.error) {
        alert(updatedItem.error);
        return updatedItem.error;
      }
      return updatedItem;
    } catch (error) {
      console.log(error);
    }
  },
}));
