import { useRouter } from "next/router";

export const useNavigation = () => {
  const router = useRouter();

  return {
    router,
  };
};
