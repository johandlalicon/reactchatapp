import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/user");
      setId(response.data.userId);
      setUsername(response.data.username);
    };
    fetchData();
    console.log("This is coming from userContext");
  }, []);

  return (
    <UserContext.Provider
      value={{ username, setUsername, id, setId, setUsername }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
