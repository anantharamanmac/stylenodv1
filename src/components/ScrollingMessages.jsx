// components/ScrollingMessages.jsx
import React from "react";

const messages = [
  "Purchases can be made through Instagram or WhatsApp.",
  "Site under maintenance mode.",
  "Check our new collection online!",
];

const ScrollingMessages = () => {
  return (
    <div className="w-full bg-black text-white overflow-hidden">
      <div className="flex animate-scroll whitespace-nowrap">
        {messages.map((msg, index) => (
          <span
            key={index}
            className="mx-8 font-bold text-lg"
          >
            {msg}
          </span>
        ))}
        {/* Duplicate messages for seamless scroll */}
        {messages.map((msg, index) => (
          <span
            key={"dup-" + index}
            className="mx-8 font-bold text-lg"
          >
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ScrollingMessages;
