import React from "react";
import "./styles/App.scss";
import { Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MyInfo from "./pages/MyInfo";

function App() {
  return (
    <div className="App">
      <Route path="/" component={MainPage} />
      <Route path="/my-info" component={MyInfo} />
    </div>
  );
}

export default App;