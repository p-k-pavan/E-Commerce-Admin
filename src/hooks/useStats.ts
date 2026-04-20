import { getStats } from "@/api/stats";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useStats = () => {
    return useQuery({
        queryFn: getStats,
        queryKey: ["stats"],
        placeholderData: keepPreviousData,
        staleTime: Infinity,
        gcTime: Infinity,
    });
};