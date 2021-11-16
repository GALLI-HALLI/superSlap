import qs from "qs";
import { useEffect } from "react";
import { Redirect, useLocation } from "react-router-dom";

const AuthRedirect = () => {
  const { search } = useLocation();
  const { token } = qs.parse(search.slice(1)); // 쿼리 스트링 문자열을 객체로 만들어준다. {}

  useEffect(() => {
    if (token && typeof token === "string") {
      localStorage.setItem("token", token);
    }
  }, []);

  return <Redirect to={token ? "/lobby" : "/"} push={false} />;
};

export default AuthRedirect;
