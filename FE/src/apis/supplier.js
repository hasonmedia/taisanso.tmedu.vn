import axiosConfig from "@/axiosConfig";

export const getSuppliers = async (filter) => {
  return await axiosConfig({
    method: "get",
    url: "/admin/nha_cung_cap",
    params: {
      "danhmucIds[]": filter,
    },
  });
};

export const themNhaCungCap = async (data) => {
  return axiosConfig({
    method: "post",
    url: "/admin/nha_cung_cap",
    data,
  });
};

export const suaNhaCungCap = async (id, data) => {
  return axiosConfig({
    method: "patch",
    url: `/admin/nha_cung_cap/${id}`,
    data,
  });
};

export const xoaNhaCungCap = async (id) => {
  return axiosConfig({
    method: "delete",
    url: `/admin/nha_cung_cap/${id}`,
  });
};
