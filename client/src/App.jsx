import axios from "axios";
import "./App.css";
import Routes from "./Routes";
import { UserContextProvider } from "./UserContext";

function App() {
  axios.defaults.baseURL = "http://localhost:4000";
  axios.defaults.withCredentials = true; //ALLOWS SERVER TO AUTHORIZE BASED ON CREDENTIALS

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  );
}

export default App;
