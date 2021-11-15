import { Route, Switch } from "react-router-dom";
import Layout from "./components/MainPage/component/Layout";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import "./styles/App.scss";
import MyInfo from "./pages/MyInfo";
import MyInfoEdit from "./components/MyInfo/MyInfoEdit";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact component={MainPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/my-info" component={MyInfo} />
        <Route path="/my-info-edit" component={MyInfoEdit} />
      </Switch>
    </Layout>
  );
}

export default App;