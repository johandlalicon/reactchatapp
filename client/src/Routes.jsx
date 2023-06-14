import React, { useContext, useEffect } from "react";
import Register from "./components/Register";
import UserContext from "./UserContext";
import Chat from "./components/Chat";

export default function Routes() {
  const { username, id } = useContext(UserContext);

  if (username) return <Chat />;

  return <Register />;
}
