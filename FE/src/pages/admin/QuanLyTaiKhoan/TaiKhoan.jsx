import { useEffect, useState } from "react";
import { UserStore } from "../../../stores/tai_khoan";
import { DepartmentStore } from "../../../stores/department";
import ThemTaiKhoan from "./ThemTaiKhoan";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { capToLetter } from "@/utils/capToLetter";

export default function UserManagement() {
  const userStore = UserStore();
  const departmentStore = DepartmentStore();
  const auth = useAuth();
  const { data: dataLevel1, getUsers, themTaiKhoan, suaTaiKhoan } = userStore;
  const { data: phong_ban, getAllDepartment } = departmentStore;

  const [selectedPhongBan, setSelectedPhongBan] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getUsers();
        await getAllDepartment();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleThemTaiKhoan = async (formData) => {
    const response = await themTaiKhoan(formData);
    getUsers();
    if (!response || !response.status) {
      const errorMessage = response?.error || "Thêm tài khoản thất bại";
      alert(errorMessage);
      toast.error(errorMessage);
      return;
    }

    alert("Thêm tài khoản thành công");
    setShowModal(false);
    setEditUser(null);
    // window.location.reload();
  };

  // Hàm cập nhật
  const handleCapNhatTaiKhoan = async (formData) => {
    try {
      if (!editUser) return;
      setLoading(true);
      await suaTaiKhoan(editUser.id, formData);
      await getUsers();
      alert("Cập nhật tài khoản thành công");
      setEditUser(null);
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      console.error("Lỗi cập nhật tài khoản:", err);
      toast.error("Cập nhật tài khoản thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Lọc trực tiếp từ store
  const filteredUsers = dataLevel1.filter(
    (user) => selectedPhongBan === "all" || user.phong_ban_id === Number(selectedPhongBan)
  );

  // Mobile card component for better mobile experience
  const MobileUserCard = ({ user }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{user.ho_ten}</h3>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            if (auth.user.cap === user.cap && auth.user.id !== user.id) {
              alert("Bạn không có quyền sửa tài khoản cùng cấp");
              return;
            }
            setEditUser(user);
            setShowModal(true);
          }}
        >
          <Edit className="h-4 w-4 text-yellow-500" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="font-medium text-gray-700">Mã NV:</span>
          <p className="text-gray-600">{user.m_s_n_v}</p>
        </div>
        <div>
          <span className="font-medium text-gray-700">Cấp:</span>
          <p className="text-gray-600">{user.cap || "—"}</p>
        </div>
        <div>
          <span className="font-medium text-gray-700">Bộ phận:</span>
          <p className="text-gray-600">
            {phong_ban?.find((pb) => pb.id === user.phong_ban_id)?.ten || "Chưa có"}
          </p>
        </div>
        <div>
          <span className="font-medium text-gray-700">SĐT:</span>
          <p className="text-gray-600">{user.sdt}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 min-h-screen bg-gray-50">

      {/* Header - Bỏ sticky */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Quản Lý Tài Khoản</h1>
          <p className="text-gray-500 text-sm md:text-base">Trang quản lý tất cả tài khoản nhân viên</p>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() => {
            setEditUser(null);
            setShowModal(true);
          }}
        >
          + Thêm tài khoản
        </Button>
      </div>
      {showModal && (
        < ThemTaiKhoan
          showModal={showModal}
          setShowModal={(value) => {
            setShowModal(value);
            if (!value) setEditUser(null);
          }}
          phong_ban={phong_ban}
          onSubmit={editUser ? handleCapNhatTaiKhoan : handleThemTaiKhoan}
          editUser={editUser}
        />
      )}
      {/* Bộ lọc - Bỏ sticky */}
      <div className="w-full sm:w-64">
        <Select value={selectedPhongBan} onValueChange={setSelectedPhongBan}>
          <SelectTrigger>
            <SelectValue placeholder="Tất cả bộ phận" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả bộ phận</SelectItem>
            {phong_ban?.map((pb) => (
              <SelectItem key={pb.id} value={String(pb.id)}>
                {pb.ten}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content chính */}
      <div className="overflow-x-hidden">
        {loading ? (
          <div className="text-center py-8">Đang tải dữ liệu...</div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => <MobileUserCard key={user.id} user={user} />)
              ) : (
                <div className="text-center py-8 text-gray-500">Không có dữ liệu để hiển thị</div>
              )}
            </div>
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <Table className="rounded-lg overflow-hidden border border-gray-200 shadow-sm min-w-full">
                  <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <TableRow>
                      <TableHead className="text-left font-semibold text-gray-700 whitespace-nowrap">MÃ NV</TableHead>
                      <TableHead className="text-left font-semibold text-gray-700 whitespace-nowrap">TÀI KHOẢN</TableHead>
                      <TableHead className="text-left font-semibold text-gray-700 whitespace-nowrap">HỌ VÀ TÊN</TableHead>
                      <TableHead className="text-center font-semibold text-gray-700 whitespace-nowrap">LOẠI TÀI KHOẢN</TableHead>
                      <TableHead className="text-center font-semibold text-gray-700 whitespace-nowrap">BỘ PHẬN</TableHead>
                      <TableHead className="text-center font-semibold text-gray-700 whitespace-nowrap">SỐ ĐIỆN THOẠI</TableHead>
                      <TableHead className="text-center font-semibold text-gray-700 whitespace-nowrap">THAO TÁC</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-blue-50 transition-colors even:bg-gray-50">
                        <TableCell className="whitespace-nowrap">{user.m_s_n_v}</TableCell>
                        <TableCell className="whitespace-nowrap">{user.username}</TableCell>
                        <TableCell className="whitespace-nowrap">{user.ho_ten}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{capToLetter(user.cap) || "—"}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">
                          {phong_ban?.find((pb) => pb.id === user.phong_ban_id)?.ten || "Chưa có"}
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap">{user.sdt}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">
                          <div className="flex justify-center items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => {
                                if (auth.user.cap === user.cap && auth.user.id !== user.id) {
                                  alert("Bạn không có quyền sửa tài khoản cùng cấp");
                                  return;
                                }
                                setEditUser(user);
                                setShowModal(true);
                              }}
                            >
                              <Edit className="h-4 w-4 text-yellow-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}