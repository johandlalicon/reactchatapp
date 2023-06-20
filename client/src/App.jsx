import axios from "axios";

import Routes from "./Routes";
import { UserContextProvider } from "./UserContext";

//http://localhost:4000/
//https://cheesemiss-api.onrender.com
function App() {
  axios.defaults.baseURL = "https://cheesemiss-api.onrender.com";
  axios.defaults.withCredentials = true; //ALLOWS SERVER TO AUTHORIZE BASED ON CREDENTIALS

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  );
}

export default App;
