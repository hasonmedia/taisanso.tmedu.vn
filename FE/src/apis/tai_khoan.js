import axiosConfig from "../axiosConfig";

export const getUsers = async () => {
  return await axiosConfig({
    method: "get",
    url: "/admin/tai-khoan",
  });
};

export const themTaiKhoan = async (data) => {
  return axiosConfig({
    method: "post",
    url: "/auth/register",
    data,
  });
};

export const suaTaiKhoan = async (id, data) => {
  return axiosConfig({
    method: "patch",
    url: `/auth/update/${id}`,
    data,
  });
};
export const xoaTaiKhoan = async (id) => {
  return axiosConfig({
    method: "delete",
    url: `/auth/delete/${id}`,
  });
};
