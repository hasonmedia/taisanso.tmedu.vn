import axiosConfig from "../axiosConfig";

export const getAllMails = async () => {
  return axiosConfig({
    method: "get",
    url: "/admin/mails",
  });
};

export const saveMail = async (recipients) => {
  return axiosConfig({
    method: "put",
    url: "/admin/mails",
    data: { recipients },
  });
};


