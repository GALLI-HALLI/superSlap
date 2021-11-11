import styles from "./styles/App.module.scss";
import { Route, Switch } from "react-router-dom";
import MainPage from "./pages/MainPage";
import InputForm from "./components/MainPage/InputForm";
import RegisterPage from "./components/RegisterPage/RegisterPage";

function App() {
  return (
    <div className={styles.App}>
      <Route path="/">
        <MainPage>
          <Switch>
            <Route path="/" exact component={InputForm} />
            <Route path="/register" component={RegisterPage} />
          </Switch>
        </MainPage>
      </Route>
    </div>
  );
}

export default App;
