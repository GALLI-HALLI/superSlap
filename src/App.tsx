import { Route, Switch } from "react-router-dom";
import Layout from "./components/MainPage/component/Layout";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import "./styles/App.scss";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact component={MainPage} />
        <Route path="/register" component={RegisterPage} />
      </Switch>
    </Layout>
  );
}

export default App;
