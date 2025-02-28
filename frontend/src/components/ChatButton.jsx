import React from "react";
import { FaComments } from "react-icons/fa";

const ChatButton = () => {
  const handleClick = () => {
    window.open("https://chatbot-for-newbie.streamlit.app/", "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
    >
      <FaComments size={24} />
    </button>
  );
};

export default ChatButton;
