import axios from "axios";
import { debounce } from "lodash";
import { React, useState, useEffect } from "react";

function Search({ id }) {
  const [contactName, setContactName] = useState("");
  const [searchResult, setSearchResult] = useState("");

  useEffect(() => {
    const searchContacts = async () => {
      try {
        const response = await axios.get("/allusers");
        const allUsers = response.data;
        const filteredUsers = allUsers.filter((user) => {
          return user.username
            .toLowerCase()
            .includes(contactName.toLowerCase());
        });

        setSearchResult(filteredUsers);
      } catch (error) {
        console.log(error);
      }
    };
    searchContacts();
  }, [contactName]);

  function handleAddContact() {
    if (searchResult) {
      const addContact = async () => {
        await axios.post(`/addcontact/${searchResult[0]._id}/${id}`);
      };
      addContact();
    }
  }

  return (
    <div>
      <input
        type="text"
        className="border px-1 rounded-sm"
        onChange={(e) => {
          setContactName(e.target.value);
        }}
      />
      {searchResult.length === 0 ? (
        <p className="text-gray-400">No contacts found</p>
      ) : (
        <div className="p-2 flex justify-between">
          <div>{searchResult[0].username}</div>
          <button onClick={() => handleAddContact()}>
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
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default Search;
