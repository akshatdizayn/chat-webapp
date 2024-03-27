import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/constants/routes.constants";
import useAuth from "@/hooks/useAuth";

import Loader from "@/components/Loader/Loader";

const withAuth = (WrappedComponent, prevent = false) => {
  const Wrapper = (props) => {
    const router = useRouter();
    const [user, loading] = useAuth();

    useEffect(() => {
      if (!loading) {
        if (prevent && user) {
          router.replace(ROUTES.HOMEPAGE);
        } else if (!prevent && !user) {
          router.replace(ROUTES.LOGIN);
        }
      }
    }, [user, loading]);

    if (loading) {
      return <Loader isLoading={loading} />;
    }

    return <WrappedComponent {...props} />;
  };
  return Wrapper;
};

export default withAuth;
