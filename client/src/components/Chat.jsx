import React, { useContext, useEffect, useState, useRef } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import UserContext from "../UserContext";
import { uniqBy } from "lodash";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Contacts from "./Contacts";
import Search from "./Search";

function Chat() {
  const [ws, setWs] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [offlineUsers, setOfflineUsers] = useState({});
  const [selectUser, setSelectUser] = useState("");
  const [newMsg, setNewMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [openSearch, setOpenSearch] = useState(false);

  const { username, id, setId, setUsername } = useContext(UserContext);
  const viewNewMsg = useRef();
  //AUTOMATICALLY CONNECTS CLIENT TO SERVER ONSET OF PAGE LOAD OR IF DATA RECEIVED FROM SERVER SOCKET

  function wsConnect() {
    const ws = new WebSocket("ws://localhost:4000");
    setWs(ws);
    ws.addEventListener("message", handleMessage); //ONCE MSG COMES IN IT GETS HANDLED BY FUNCTION
    ws.addEventListener("close", () => {
      console.log("DISCONNECTED FROM WS. ATTEMPTING TO RECONNECT...");
      setTimeout(() => {
        wsConnect();
      }, 1000);
    });
  }

  useEffect(() => {
    wsConnect();
  }, []);

  //RECEIVES AND HANDLES ALL DATA FROM SERVER THROUGH WEBSOCKET
  function handleMessage(e) {
    const messageData = JSON.parse(e.data);

    if ("online" in messageData) {
      showUsersOnline(messageData.online);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          ...messageData,
        },
      ]);
    }
  }
  //FILTERS THE DATA TO SHOW CONNECTED USERS
  function showUsersOnline(onlineArr) {
    const users = {};
    onlineArr.forEach(({ userId, username }) => {
      if (userId !== id) {
        users[userId] = username;
      }
    });
    setOnlineUsers(users);
  }

  //SENDS MESSAGE TO SERVER
  function sendNewMsg(e) {
    e.preventDefault();
    console.log("Youre sending a message...");
    ws.send(
      JSON.stringify({
        text: newMsg,
        recipient: selectUser,
      })
    );
    //ACCESS THE PREV STATE THEN RESAVE WITH NEW DATA TO MAKE SURE IT STAYS WHEN RERENDERED
    setMessages((prev) => [
      ...prev,
      {
        _id: uuidv4(),
        text: newMsg,
        sender: id,
        recipient: selectUser,
      },
    ]); //SET isOur TO INDICATE IF INCOMING OR OUTGOING MESSAGE
    setNewMsg("");
  }

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

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await axios.get("/allusers");
        const filterOfflineUsers = response.data
          .filter((user) => user._id !== id)
          .filter((users) => !Object.keys(onlineUsers).includes(users._id));

        const offlineUsers = {};
        filterOfflineUsers.forEach((user) => {
          offlineUsers[user._id] = user.username;
        });
        setOfflineUsers(offlineUsers);
      } catch (error) {
        console.log(error);
      }
    };
    getAllUsers();
    console.log(onlineUsers, offlineUsers);
  }, [onlineUsers]);

  //GETS MESSAGE ARCHIVE FROM SERVER
  useEffect(() => {
    if (selectUser !== "") {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`/messages/${selectUser}/${id}`);
          setMessages(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchMessages();
    }
  }, [selectUser]);

  useEffect(() => {
    viewNewMsg.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/4 pt-4 flex flex-col content-center">
        <div className="flex-grow">
          <div className="flex justify-evenly">
            <Logo />
            <button className="justify-end" onClick={() => setOpenSearch(true)}>
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
            </button>
          </div>
          <div className="flex place-content-center">
            {openSearch && <Search id={id} />}
          </div>

          {Object.keys(onlineUsers).map((user) => (
            <Contacts
              id={user}
              username={onlineUsers[user]}
              onClick={() => setSelectUser(user)}
              selectUser={selectUser}
              online={true}
            />
          ))}
          {Object.keys(offlineUsers).map((user) => (
            <Contacts
              id={user}
              username={offlineUsers[user]}
              onClick={() => setSelectUser(user)}
              selectUser={selectUser}
              online={false}
            />
          ))}
        </div>
        <div className="p-2 text-center items-center flex">
          <div className="flex">
            {" "}
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
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            <span className="mr-4">{username}</span>
          </div>

          <button
            className="text-sm text-gray-500 bg-blue-50 px-4 py-2 border rounded-sm"
            onClick={userLogout}
          >
            LOG OUT
          </button>
        </div>
      </div>

      <div className="bg-blue-50 w-3/4 flex flex-col">
        <div className="flex-grow p-2">
          {!selectUser && (
            <div className="h-full flex flex-grow items-center justify-center">
              <div className="text-gray-400">
                &larr; Start conversation with your friends
              </div>
            </div>
          )}
          {!!selectUser && (
            <div className="h-full relative">
              <div className="overflow-y-scroll absolute inset-0">
                {uniqBy(messages, "_id").map((message) => (
                  <div
                    className={
                      message.sender === id ? "text-right" : "text-left"
                    }
                  >
                    <div
                      className={
                        (message.sender === id
                          ? "bg-blue-500 text-white text-left"
                          : "bg-white text-gray-500") +
                        " rounded-md inline-block my-2"
                      }
                    >
                      <div className="p-2">{message.text}</div>
                    </div>
                  </div>
                ))}
                <div ref={viewNewMsg} />
              </div>
            </div>
          )}
        </div>

        {!!selectUser && (
          <form className="flex gap-2 mx-2 my-2" onSubmit={sendNewMsg}>
            <input
              value={newMsg}
              type="text"
              placeholder="Type message here"
              className="bg-white border p-2 flex-grow rounded-sm"
              onChange={(e) => setNewMsg(e.target.value)}
            />
            <button
              type="submit"
              className="text-white bg-blue-500 p-2 rounded-sm"
              disabled={newMsg ? false : true}
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
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Chat;
