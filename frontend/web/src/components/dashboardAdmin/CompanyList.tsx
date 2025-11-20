import React, { useState, useMemo } from "react";
import useDepartment, { type DepartmentStatus } from "../../hook/useDepartment";
import Swal from "sweetalert2";

// Import các component của Material-UI
import {
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  OutlinedInput,
  Typography,
  Avatar,
  Stack,
  Link,
  Paper,
  Pagination,
  CircularProgress,
} from "@mui/material";

// Import icons
import BusinessIcon from "@mui/icons-material/Business";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SearchOffIcon from "@mui/icons-material/SearchOff";

// --- Cấu hình cho trạng thái ---
const statusOptions = [
  { label: "Hoạt động", value: "Active", color: "success.main" },
  { label: "Chờ duyệt", value: "Pending", color: "text.secondary" },
  { label: "Tạm khóa", value: "Suspended", color: "error.main" },
];

const statusMap: { [key in DepartmentStatus]: string } = {
  Active: "Hoạt động",
  Suspended: "Tạm khóa",
  Pending: "Chờ duyệt", // Thêm Pending
};

// --- Cấu hình phân trang ---
const ITEMS_PER_PAGE = 5;

// --- Component ---
const CompanyList: React.FC = () => {
  // --- State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // --- Data Fetching ---
  const { departments, loading, error, updateDepartmentStatus } =
    useDepartment("all");

  // --- Logic xử lý ---

  // 1. Lọc (Filter) - Dùng useMemo để tối ưu
  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      const matchName = dept.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter.length === 0
          ? true
          : statusFilter.includes(dept.status);

      return matchName && matchStatus;
    });
  }, [departments, searchQuery, statusFilter]);

  // 2. Phân trang (Pagination) - Dùng useMemo
  const pageCount = Math.ceil(filteredDepartments.length / ITEMS_PER_PAGE);

  const paginatedDepartments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredDepartments.slice(startIndex, endIndex);
  }, [filteredDepartments, currentPage]);

  // --- Handlers ---

  // Xử lý đổi trang
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  // Xử lý cập nhật trạng thái
  const handleStatusChange = async (
    id: string,
    newStatus: DepartmentStatus
  ) => {
    const result = await Swal.fire({
      title: "Xác nhận thay đổi",
      text: `Chuyển công ty sang trạng thái "${statusMap[newStatus]}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await updateDepartmentStatus(id, newStatus);
        Swal.fire({
          icon: "success",
          title: "Cập nhật thành công!",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể cập nhật trạng thái.",
        });
      }
    }
  };

  // --- Render Loading / Error ---
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
        <Typography ml={2}>Đang tải danh sách...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
        color="error.main"
      >
        <ErrorOutlineIcon sx={{ mr: 1 }} />
        <Typography>Lỗi: {error}</Typography>
      </Box>
    );
  }

  // --- Render Chính ---
  return (
    <Box sx={{ p: { xs: 1, md: 3 }, backgroundColor: "#f9f9f9" }}>
      {/* 1. THANH LỌC VÀ TÌM KIẾM */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="center"
        >
          {/* Search */}
          <TextField
            fullWidth
            label="Tìm theo tên công ty"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <BusinessIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
          />

          {/* Lọc trạng thái (Multi-select) */}
          <FormControl fullWidth sx={{ minWidth: 250 }}>
            <InputLabel id="status-filter-label">Lọc theo trạng thái</InputLabel>
            <Select
              labelId="status-filter-label"
              multiple
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as string[])
              }
              input={<OutlinedInput label="Lọc theo trạng thái" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {selected.map((value) => {
                    const item = statusOptions.find((s) => s.value === value);
                    return (
                      <Chip
                        key={value}
                        label={item?.label}
                        size="small"
                        sx={{ bgcolor: item?.color, color: "#fff" }}
                      />
                    );
                  })}
                </Box>
              )}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* 2. DANH SÁCH CÔNG TY */}
      <Stack spacing={2}>
        {paginatedDepartments.length === 0 ? (
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              color: "text.secondary",
            }}
          >
            <SearchOffIcon sx={{ fontSize: 40 }} />
            <Typography>Không tìm thấy công ty nào phù hợp.</Typography>
          </Paper>
        ) : (
          paginatedDepartments.map((department) => {
            const badge = statusOptions.find(
              (s) => s.value === department.status
            );

            return (
              <Paper
                key={department._id}
                elevation={1}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: 3 },
                  textAlign: 'left'
                }}
              >
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2.5}
                >
                  {/* Avatar */}
                  <Avatar
                    src={
                      department.avatar ||
                      "https://via.placeholder.com/150"
                    }
                    sx={{
                      width: { xs: 80, md: 100 },
                      height: { xs: 80, md: 100 },
                      alignSelf: { xs: "center", md: "flex-start" },
                      border: "2px solid #eee",
                    }}
                  />

                  {/* Thông tin chi tiết */}
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight="bold">
                      {department.name}
                    </Typography>
                    <Chip
                      label={badge?.label}
                      size="small"
                      sx={{
                        bgcolor: badge?.color,
                        color: "#fff",
                        fontWeight: "bold",
                        my: 1,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      <strong>Địa chỉ:</strong> {department.address}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mb={1}
                      // Truncate 2 dòng
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      <strong>Mô tả:</strong> {department.description}
                    </Typography>
                    <Link
                      href={department.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                    >
                      {department.website}
                    </Link>
                  </Box>

                  {/* Điều khiển trạng thái */}
                  <Box
                    sx={{
                      minWidth: { xs: "100%", md: 200 },
                      pt: { xs: 2, md: 0 },
                      borderTop: {
                        xs: "1px solid #eee",
                        md: "none",
                      },
                    }}
                  >
                    <FormControl fullWidth>
                      <InputLabel>Thay đổi trạng thái</InputLabel>
                      <Select
                        value={department.status}
                        label="Thay đổi trạng thái"
                        onChange={(e) =>
                          handleStatusChange(
                            department._id,
                            e.target.value as DepartmentStatus
                          )
                        }
                      >
                        {statusOptions.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Stack>
              </Paper>
            );
          })
        )}
      </Stack>

      {/* 3. THANH PHÂN TRANG */}
      {pageCount > 1 && (
        <Stack spacing={2} mt={3} alignItems="center">
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Stack>
      )}
    </Box>
  );
};

export default CompanyList;