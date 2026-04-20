import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCustomers, getCustomerStats } from "@/api/customers";

export const useCustomers = (search: string, page: number) => {
  return useQuery({
    queryKey: ["customers", search, page],
    queryFn: () => getCustomers({ search, page }),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData, 
  });
};

export const useCustomerStats = () => {
  return useQuery({
    queryKey: ["customer-stats"],
    queryFn: getCustomerStats,
    staleTime: 1000 * 60 * 5,
  });
};
