import React, { useState } from "react";
import cheeseLogo from "../assets/cheese.svg";
import axios from "axios";

function Logo({ setWs, setId, setUsername, myId, setOpenSearch, username }) {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  function userLogout(e) {
    const toLogout = async () => {
      try {
        await axios.post("/logout");
        setWs(null);
        setId(null);
        setUsername(null);
      } catch (error) {
        console.log(error);
      }
    };
    toLogout();
  }

  function deleteUser(e) {
    const toDelete = async () => {
      try {
        const response = await axios.delete(`/deleteuser/${myId}`);
        setWs(null);
        setId(null);
        setUsername(null);
        console.log(response.data);
      } catch (error) {}
    };
    toDelete();
  }

  return (
    <div className="text-center pt-4">
      <div className={showMenu ? "visible" : "hidden"}>
        <ul className="py-4 flex flex-col gap-2 text-sm text-gray-500">
          <li className="border-b border-gray-200 flex items-center justify-center pb-2">
            <button
              className="flex items-center gap-2"
              onClick={() => setOpenSearch(true)}
            >
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
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>
              Add Friend
            </button>
          </li>
          <li className="border-b border-gray-200 flex items-center justify-center pb-2">
            <button onClick={userLogout} className="flex items-center gap-2">
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
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              Logout
            </button>
          </li>
          <li className="border-b border-gray-200  items-center justify-center pb-2">
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
              Delete
            </button>

            {confirmDelete && (
              <div className="flex items-center justify-evenly pt-2 ">
                <button onClick={() => setConfirmDelete(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 "
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button onClick={deleteUser}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
      <button
        className="flex-grow"
        onClick={() => {
          if (!showMenu) {
            setShowMenu(true);
          } else {
            setShowMenu(false);
          }
        }}
      >
        <img src={cheeseLogo} className="w-8 h-8 md:flex-grow" />
      </button>
      <div className="w-full text-sm p-0">
        Hello <span className="font-medium">{username}</span>!
      </div>
    </div>
  );
}

export default Logo;
