import React from "react";
import { Switch, Route } from "react-router-dom";
import InputForm from "../components/MainPage/InputForm";
import "./MainPage.scss";
import RegisterPage from "../components/RegisterPage/RegisterPage";
import LOGO from "../image/LOGO.png";

const MainPage = () => {
  return (
    <div className="MainPage">
      <div>
        <img className="LogoImg" alt="MainLogo" src={LOGO} />
      </div>
      <Switch>
        <Route path="/" exact component={InputForm} />
        <Route path="/register" component={RegisterPage} />
        <Route
          render={({ location }) => (
            <div>존재하지 않은 페이지 입니다. : {location.pathname}</div>
          )}
        />
      </Switch>
    </div>
  );
};

export default MainPage;
