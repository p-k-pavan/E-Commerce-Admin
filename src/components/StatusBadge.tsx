interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    DELIVERED: {
      bg: "bg-[#DCFCE7]",
      text: "text-[#16A34A]",
      label: "Delivered",
    },
    delivered: {
      bg: "bg-[#DCFCE7]",
      text: "text-[#16A34A]",
      label: "Delivered",
    },
    SHIPPED: {
      bg: "bg-[#DBEAFE]",
      text: "text-[#3B82F6]",
      label: "Shipped",
    },
    shipped: {
      bg: "bg-[#DBEAFE]",
      text: "text-[#3B82F6]",
      label: "Shipped",
    },
    PENDING: {
      bg: "bg-[#FEF9C3]",
      text: "text-[#A16207]",
      label: "Pending",
    },
    pending: {
      bg: "bg-[#FEF9C3]",
      text: "text-[#A16207]",
      label: "Pending",
    },
   CANCELLED: {
      bg: "bg-[#FEE2E2]",
      text: "text-[#EF4444]",
      label: "Cancelled",
    },
    cancelled: {
      bg: "bg-[#FEE2E2]",
      text: "text-[#EF4444]",
      label: "Cancelled",
    },
    PAID: {
      bg: "bg-[#DCFCE7]",
      text: "text-[#16A34A]",
      label: "Paid",
    },
    paid: {
      bg: "bg-[#DCFCE7]",
      text: "text-[#16A34A]",
      label: "Paid",
    },
    "cash on delivery": {
      bg: "bg-[#DCFCE7]",
      text: "text-[#16A34A]",
      label: "COD",
    },
    PUBLISHED: {
      bg: "bg-[#DCFCE7]",
      text: "text-[#16A34A]",
      label: "Published",
    },
    DRAFT: {
      bg: "bg-[#F3F4F6]",
      text: "text-[#6B7280]",
      label: "Draft",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
