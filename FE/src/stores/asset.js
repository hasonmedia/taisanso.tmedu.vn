import { create } from "zustand";
import {
  getAllAsset as fetch,
  createAsset,
  updateAsset,
  deleteAsset, 
  getAssetByIdCategory,
  getAssetsExpiringSoon
} from "../apis/asset";

export const AssetStore = create((set) => ({
  data: [],

  getAllAsset: async (filters) => {
    try {
      const response = await fetch(filters);
      set({ data: response });
      return response;
    } catch (error) {
      console.log(error.message);
    }
  },
  getAssetByIdCategory: async (id) => {
    try {
      console.log(id)
     const response = await getAssetByIdCategory(id);
      set({ data: response });
      return response;
    } catch (error) {
      console.log(error.message);
    }
  },
  createAsset: async (data) => {
    try {
      const response = await createAsset(data);
      set((state) => ({
        data: [...state.data, response],
      }));
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  updateAsset: async (id, data) => {
    try {
      const response = await updateAsset(id, data);
      set((state) => ({
        data: state.data.map((item) =>
        (item.id === id ? response : item)
        )
      }));

      return response;
    } catch (error) {
      console.log(error);
    }
  },

  deleteAsset: async (id) => {
    try {
      const response = await deleteAsset(id);
      set((state) => ({
      data: state.data.filter((item) => item.id !== id),
    }));
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  getAssetsExpiringSoon: async () => {
    try {
      const response = await getAssetsExpiringSoon();
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));
