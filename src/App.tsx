import { Route, Switch } from "react-router-dom";
import Layout from "./components/MainPage/component/Layout";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import "./styles/App.scss";
import MyInfo from "./pages/MyInfo";
import lobbyPage from "./pages/lobbyPage";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact component={MainPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/my-info" component={MyInfo} />
        <Route path="/lobby" component={lobbyPage} />
      </Switch>
    </Layout>
  );
}

export default App;
