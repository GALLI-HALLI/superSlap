import { Route, Switch } from "react-router-dom";
import Layout from "./components/MainPage/component/Layout";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import "./styles/App.scss";
import LobbyPage from "./pages/LobbyPage";
import MyInfo from "./pages/MyInfo";
import AuthRedirect from "./pages/AuthRedirect";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact component={MainPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/my-info" component={MyInfo} />
        <Route path="/lobby" component={LobbyPage} />
        <Route path="/auth-redirect" component={AuthRedirect} />
      </Switch>
    </Layout>
  );
}

export default App;
