import { create } from "zustand";
import {
  getAllAsset as fetch,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetsExpiringSoon,
  getAssetsDetailedInfo,
} from "../apis/asset";

export const AssetStore = create((set, get) => ({
  data: [],
  dataExpiringSoon: [],
  detailedInfo: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  loading: false,

  getAllAsset: async (filters = {}) => {
    try {
      set({ loading: true });
      const response = await fetch(filters);
      const { data, total, page, limit, totalPages } = response;
      set({
        data: data || [],
        pagination: { total, page, limit, totalPages },
        loading: false,
      });
      return response;
    } catch (error) {
      console.log(error.message);
      set({ loading: false });
      throw error;
    }
  },

  createAsset: async (data) => {
    try {
      const response = await createAsset(data);
      await get().getAllAsset();
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  updateAsset: async (id, data) => {
    try {
      const response = await updateAsset(id, data);
      await get().getAllAsset();
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  deleteAsset: async (id) => {
    try {
      const response = await deleteAsset(id);
      await get().getAllAsset();
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getAssetsExpiringSoon: async () => {
    try {
      set({ loading: true });
      const response = await getAssetsExpiringSoon();
      set({ dataExpiringSoon: response || [], loading: false });
      return response;
    } catch (error) {
      console.log(error);
      set({ loading: false });
      throw error;
    }
  },

  getAssetsDetailedInfo: async (filters) => {
    try {
      set({ loading: true });
      const response = await getAssetsDetailedInfo(filters);
      set({ detailedInfo: response || [], loading: false });
      return response;
    } catch (error) {
      console.log(error);
      set({ loading: false });
      throw error;
    }
  },
}));
