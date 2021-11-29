import { Provider } from "react-redux";
import { Route, Switch } from "react-router-dom";
import Layout from "./components/MainPage/component/Layout";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import "./styles/App.scss";
import LobbyPage from "./pages/LobbyPage";
import MyInfo from "./pages/MyInfo";
import AuthRedirect from "./pages/AuthRedirect";
import initializeStore from "./store/initializeStore";
import RoomPage from "./pages/RoomPage";
import Hunmin from "./components/GamePage/Hunmin";
import hunmin2 from "./components/GamePage/hunmin2";

const store = initializeStore();

function App() {
  return (
    <Provider store={store}>
      <Layout>
        <Switch>
          <Route path="/" exact component={MainPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/my-info" component={MyInfo} />
          <Route path="/lobby" component={LobbyPage} />
          <Route path="/auth-redirect" component={AuthRedirect} />
          <Route path="/room/:roomId" component={RoomPage} />
          <Route path="/hunmin" component={hunmin2} />
        </Switch>
      </Layout>
    </Provider>
  );
}

export default App;
