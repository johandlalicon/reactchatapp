import axios from "axios";

import { React, useState, useEffect } from "react";
import Avatar from "./Avatar";

function Search({ myId, openSearch }) {
  const [searchResult, setSearchResult] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("");

  useEffect(() => {
    const searchContacts = async () => {
      const response = await axios.get("/allusers");
      const allUsers = response.data;
      const locateUser = allUsers
        .filter((user) => {
          return user.username
            .toLowerCase()
            .includes(searchCriteria.toLowerCase());
        })
        .map((user) => {
          return user;
        });
      setSearchResult(locateUser);
    };
    searchContacts();
  }, [searchCriteria]);

  function handleAddContact(userId) {
    if (searchCriteria) {
      try {
        const addUser = async () => {
          const response = await axios.post(`/addcontact/${userId}/${myId}`);
          if (response.status === 200) {
            openSearch(false);
          }
        };
        addUser();
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className="bg-white relative">
      <div className="p-4 border rounded-sm shadow-md">
        <button
          className="fixed top-0 right-0 p-1"
          onClick={() => openSearch(false)}
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h1 className="text-center pb-2">Search Friends</h1>
        <input
          type="text"
          className="border px-1 rounded-sm"
          onChange={(e) => {
            setSearchCriteria(e.target.value);
          }}
        />
        {searchResult.length !== 0 ? (
          <div className="pt-4 text-center">
            <button
              onClick={(e) => {
                handleAddContact(searchResult[0]._id);
              }}
            >
              {!searchCriteria ? "" : searchResult[0].username}
              {searchCriteria && <Avatar username={searchResult[0].username} />}
            </button>
          </div>
        ) : (
          <div>No users found</div>
        )}
      </div>
    </div>
  );
}

export default Search;
