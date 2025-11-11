import {
  getAllMails as getAllMailsAPI, saveMail as saveMailAPI
} from "../apis/nhan_mail";
import { create } from "zustand";

export const MailStore = create((set) => ({
  data: [],

  getAllMails: async () => {
    try {
      const response = await getAllMailsAPI();
        set({ data: response.data });
    
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  saveMail: async (recipients) => {
    try {
      const response = await saveMailAPI(recipients);
       await set(async (state) => {
        const updatedMails = await getAllMailsAPI();
        return { data: updatedMails.data };
      });

      return response;
    } catch (error) {
      console.error("Lỗi khi lưu mail:", error);
    }
  }
}));