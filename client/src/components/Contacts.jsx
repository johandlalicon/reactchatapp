import React from "react";
import Avatar from "./Avatar";

function Contacts({ id, username, onClick, selectUser, online }) {
  return (
    <div
      key={id}
      className={
        "border-b border-gray-100 flex gap-2 item-center cursor-pointer " +
        (id === selectUser ? "bg-blue-50" : "")
      }
      onClick={() => onClick(id)}
    >
      {selectUser === id && <div className="w-1 bg-blue-500 h-12"></div>}
      <div className="flex pl-4 py-2 items-center gap-2">
        <Avatar username={username} userId={id} online={online} />
        <span className="text-gray-800">{username}</span>
      </div>
    </div>
  );
}

export default Contacts;
