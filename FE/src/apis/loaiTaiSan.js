import axiosConfig from "../axiosConfig";

export const getAllLoaiTaiSan = async (params = {}) => {
  return axiosConfig({
    method: "get",
    url: "/admin/loai_tai_san",
    params,
  });
};
export const createLoaiTaiSan = async (data) => {
  return axiosConfig({
    method: "post",
    url: "/admin/loai_tai_san",
    data,
  });
};

export const updateLoaiTaiSan = async (id, data) => {
  return axiosConfig({
    method: "patch",
    url: `/admin/loai_tai_san/${id}`,
    data,
  });
};

export const deleteLoaiTaiSan = async (id) => {
  return axiosConfig({
    method: "delete",
    url: `/admin/loai_tai_san/${id}`,
  });
};
