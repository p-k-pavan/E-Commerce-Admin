import { useMutation } from "@tanstack/react-query";
import { Login } from "@/types/api";
import { useRouter } from "next/navigation";
import { loginUser } from "@/api/auth";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore"
import { logout as logoutApi } from "@/api/auth";


export const useLogin = () => {
  const navigate = useRouter();
  const { login } = useAuthStore();


  return useMutation({
    mutationFn: (formData: Login) => loginUser(formData),

    onSuccess: async (data) => {
      const user = data?.user;

      if (!user) {
        toast.error("Invalid server response");
        return;
      }

      const { name, email, mobile, avatar ,address} = user;

      login({ name, email, mobile, avatar,address});

      toast.success("Login successful!");

      navigate.push("/dashboard");
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed";

      toast.error(message);
    },
  });
};

export const useLogout = () => {
    const router = useRouter();
    const { logout } = useAuthStore();

    return useMutation({
        mutationFn: async () => {
            await logoutApi();
        },

        onSuccess: () => {
            logout();
            router.push("/");
        },

        onError: () => {
            toast.error("Logout failed");
        },
    });
};