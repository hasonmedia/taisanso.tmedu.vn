import axiosConfig from "../axiosConfig";

export const getAllAsset = async (filters = {}) => {
  return axiosConfig({
    method: "get",
    url: "/admin/tai_san",
    params: filters,
  });
};

export const createAsset = async (data) => {
  return axiosConfig({
    method: "post",
    url: "/admin/tai_san",
    data,
  });
};

export const updateAsset = async (id, data) => {
  return axiosConfig({
    method: "patch",
    url: `/admin/tai_san/${id}`,
    data,
  });
};

export const deleteAsset = async (id) => {
  return axiosConfig({
    method: "delete",
    url: `/admin/tai_san/${id}`,
  });
};

export const getAssetsExpiringSoon = async () => {
  return axiosConfig({
    method: "get",
    url: "/admin/tai_san_sap_het_han",
  });
};

export const getAssetsDetailedInfo = async (filters = []) => {
  return axiosConfig({
    method: "get",
    url: "/admin/tai_san/details",
    params: {
      "nhaCungCapIds[]": filters,
    },
  });
};
