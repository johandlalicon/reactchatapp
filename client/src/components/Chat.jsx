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
  const [displayFriends, setDisplayFriends] = useState({});
  const [selectUser, setSelectUser] = useState("");
  const [newMsg, setNewMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [openSearch, setOpenSearch] = useState(false);

  const { username, id, setId, setUsername } = useContext(UserContext);
  const viewNewMsg = useRef();

  //AUTOMATICALLY CONNECTS CLIENT TO SERVER ONSET OF PAGE LOAD OR IF DATA RECEIVED FROM SERVER SOCKET

  function wsConnect() {
    // ws://localhost:4000
    // "wss://cheesemiss-api.onrender.com"
    const ws = new WebSocket("wss://cheesemiss-api.onrender.com");
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
    } else if ("text" in messageData) {
      if (messageData.sender === selectUser) {
        setMessages((prev) => [
          ...prev,
          {
            ...messageData,
          },
        ]);
      }
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
    showUserFriends();
  }

  function showUserFriends() {
    const getFriendList = async () => {
      const response = await axios.get("/friendslist");
      setDisplayFriends(response.data);
    };
    getFriendList();
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

  useEffect(() => {
    const showUserFriends = async () => {
      try {
        const response = await axios.get("/friendslist");
        setDisplayFriends(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    showUserFriends();
  }, [displayFriends]);

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
    <div className="relative">
      {openSearch && (
        <div
          className="filter-none fixed z-50 
            top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
        >
          <Search myId={id} openSearch={setOpenSearch} />
        </div>
      )}

      <div className={"flex h-screen"}>
        <div
          className={`bg-white w-1/4 flex flex-col content-center flex-shrink-0 ${
            openSearch ? "blur" : ""
          }`}
        >
          <div className="flex-grow">
            {Object.keys(displayFriends).map((user) => (
              <Contacts
                key={user}
                id={user}
                username={displayFriends[user]}
                onClick={() => setSelectUser(user)}
                selectUser={selectUser}
                online={user in onlineUsers ? true : false}
              />
            ))}
          </div>

          <div className="p-2 text-center items-center flex flex-col gap-2 md:flex-row">
            <div className="flex">
              <Logo
                setWs={setWs}
                setId={setId}
                setUsername={setUsername}
                myId={id}
                setOpenSearch={setOpenSearch}
                username={username}
              />{" "}
            </div>
          </div>
        </div>

        <div
          className={
            "flex flex-col flex-nowrap bg-blue-50 w-3/4 " +
            `${openSearch ? "blur" : ""}`
          }
        >
          {!!selectUser && (
            <div className="flex items-center gap-5 px-2 py-2 border-b border-l border-gray-200 bg-white">
              <Avatar
                username={onlineUsers[selectUser] || displayFriends[selectUser]}
                online={onlineUsers[selectUser] ? true : false}
              />
              <span className="text-lg font-semibold">
                {displayFriends[selectUser]}
              </span>
            </div>
          )}

          <div className="flex-grow p-2">
            {!selectUser && (
              <div className="h-full flex flex-grow items-center justify-center">
                <div className="text-gray-400">
                  {displayFriends === 0
                    ? "&larr; Start conversation with your friends"
                    : "You have no friends listed yet, add friends by clicking the cheese! Hint: Try adding Rick and Morty characters"}
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
            <div className="">
              <form
                className="flex gap-2 mx-2 my-2 sticky"
                onSubmit={sendNewMsg}
              >
                <input
                  value={newMsg}
                  type="text"
                  placeholder="Type message here"
                  className="bg-white border p-2 flex-grow rounded-sm w-full"
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
