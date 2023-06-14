import React, { useContext, useState } from "react";
import axios from "axios";
import UserContext from "../UserContext";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAuth, setIsAuth] = useState(true);
  const [isExisting, setIsExisting] = useState(false);

  const { setUsername: setLoggedUser, setId } = useContext(UserContext);

  async function handleSubmit(e) {
    e.preventDefault();
    const url = isRegistered ? "login" : "register";

    try {
      const { data } = await axios.post(`/${url}`, {
        username,
        password,
      });
      setLoggedUser(username);
      setId(data.id);
    } catch (error) {
      if (error.response.status === 401) {
        setIsAuth(false);
      } else if (error.response.status === 409) {
        setIsExisting(true);
      }
      console.log(error);
    }
  }

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form action="" className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <input
          type="password"
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2 border"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          {!isRegistered ? "Register" : "Login"}
        </button>
        <div className="text-center mt-2">
          {!isAuth && <div>Incorrect Username or Password</div>}
          {isExisting && <div>Username already exists</div>}
          {!isRegistered && (
            <div>
              Already a member?
              <button onClick={() => setIsRegistered(true)}>Login</button> here!
            </div>
          )}
          {isRegistered && (
            <div>
              Don't have an account?
              <button onClick={() => setIsRegistered(false)}>Register</button>
              here!
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default Register;
