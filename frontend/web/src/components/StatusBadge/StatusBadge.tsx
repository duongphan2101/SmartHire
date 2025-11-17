// import React from 'react';

const STATUS_CONFIG: Record<string, { text: string; className: string }> = {
  pending: {
    text: "Đang chờ",
    className: "bg-yellow-100 text-yellow-800",
  },
  confirmed: {
    text: "Đã xác nhận tham gia",
    className: "bg-blue-100 text-blue-800",
  },
  rejected: {
    text: "Đã từ chối",
    className: "bg-red-100 text-red-800",
  },
  completed: {
    text: "Đã hoàn thành",
    className: "bg-green-100 text-green-800",
  },
  failed: {
    text: "Đã thất bại",
    className: "bg-pink-100 text-pink-800",
  },
  default: {
    text: "Không rõ",
    className: "bg-gray-100 text-gray-800",
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.default;
  const baseClassName = "inline-flex items-center rounded-full text-sm font-medium";

  return (
    <span className={`${baseClassName} ${config.className}`} style={{paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10}}>
      {config.text}
    </span>
  );
};

export default StatusBadge;