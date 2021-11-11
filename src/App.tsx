import React from "react";
import "./styles/App.scss";
import { Route } from "react-router-dom";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <div className="App">
      <Route path="/" component={MainPage} />
    </div>
  );
}

export default App;
