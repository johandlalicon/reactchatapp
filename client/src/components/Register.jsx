import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import UserContext from "../UserContext";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAuth, setIsAuth] = useState(true);
  const [isExisting, setIsExisting] = useState(false);
  const [closeAlert, setCloseAlert] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const { setUsername: setLoggedUser, setId } = useContext(UserContext);

  function handleSubmit(e) {
    e.preventDefault();
    const url = isRegistered ? "/login" : "/register";
    const loginUser = async () => {
      try {
        const { data } = await axios.post(url, {
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
    };
    loginUser();
  }

  function handleGuestLogin() {
    const guestUsername = "Guest1";
    const guestPassword = "123";

    const loginUser = async () => {
      try {
        const { data } = await axios.post("/login", {
          username: guestUsername,
          password: guestPassword,
        });
        if (data) {
          setLoggedUser(guestUsername);
          setId(data.id);
          setIsGuest(false);
        }
      } catch (error) {
        if (error.response.status === 401) {
          setIsAuth(false);
        } else if (error.response.status === 409) {
          setIsExisting(true);
        }
        console.log(error);
      }
    };
    loginUser();
  }

  return (
    <div className="static">
      {/* <div
        className={`absolute top-30 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-center p-2 border mt-5 text-sm drop-shadow-md ${
          closeAlert ? "hidden" : ""
        }`}
      >
        <div className="relative">
          <button
            className="absolute top-0 right-0"
            onClick={() => setCloseAlert(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-right"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex flex-row justify-center pb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
          </div>
        </div>
        Try out the app by logging in as{" "}
        <span className="block pt-2">Username: Morty</span>
        <span>Password: 12345</span>
      </div> */}
      <div className="bg-blue-50 h-screen flex items-center">
        <form action="" className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="username"
            className="block w-full rounded-sm p-2 mb-2 border"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
            disabled={isGuest}
          />
          <input
            type="password"
            placeholder="password"
            className="block w-full rounded-sm p-2 mb-2 border"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            disabled={isGuest}
          />
          <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
            {!isRegistered ? "Register" : "Login"}
          </button>
          <button
            className="bg-gray-400 text-white  w-full rounded-sm p-2 mt-4"
            onClick={handleGuestLogin}
            type="button"
          >
            Login as Guest
          </button>
          <div className="text-center mt-2 text-sm">
            {!isAuth && <div>Incorrect Username or Password</div>}
            {isExisting && <div>Username already exists</div>}
            {!isRegistered && (
              <div>
                Already a member?{" "}
                <button
                  className="font-medium hover:underline"
                  onClick={() => setIsRegistered(true)}
                >
                  Login
                </button>{" "}
                here!
              </div>
            )}
            {isRegistered && (
              <div>
                Don't have an account?{" "}
                <button
                  className="font-medium hover:underline"
                  onClick={() => setIsRegistered(false)}
                >
                  Register
                </button>{" "}
                here!
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
