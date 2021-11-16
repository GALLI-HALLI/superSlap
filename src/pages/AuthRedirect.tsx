import qs from "qs";
import { useEffect } from "react";
import { Redirect, useLocation } from "react-router-dom";

const AuthRedirect = () => {
  const { search } = useLocation();
  const { token } = qs.parse(search.slice(1));

  useEffect(() => {
    if (token && typeof token === "string") {
      localStorage.setItem("token", token);
    }
  }, []);

  return <Redirect to="/" push={false} />;
};

export default AuthRedirect;
