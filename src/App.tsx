import React from "react";
import "./styles/App.scss";
import { Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MyInfo from "./pages/MyInfo";
import MyInfoEdit from "./components/MyInfo/MyInfoEdit";

function App() {
  return (
    <div className="App">
      <Route path="/main" component={MainPage} />
      <Route path="/my-info" component={MyInfo} />
      <Route path="/my-info-edit" component={MyInfoEdit} />
    </div>
  );
}

export default App;