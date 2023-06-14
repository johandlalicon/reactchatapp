import React from "react";

function Avatar({ userId, username, online }) {
  const colors = [
    "bg-red-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-blue-200",
    "bg-yellow-200",
    "bg-teal-200",
  ];
  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  return (
    <div
      className={`w-14 h-14 bg-red-200 rounded-full text-center flex items-center ${color} relative md:w-10 md:h-10`}
    >
      {username && username.length !== 0 && (
        <div className="text-center w-full opacity-70 font-bold">
          {username[0]}
        </div>
      )}
      {online && (
        <div className="absolute w-4 h-4 bg-green-400 bottom-0 right-0 rounded-full border border-white"></div>
      )}
      {!online && (
        <div className="absolute w-4 h-4 bg-gray-300 bottom-0 right-0 rounded-full border border-white md:w-3 md:h-3"></div>
      )}
    </div>
  );
}

export default Avatar;
