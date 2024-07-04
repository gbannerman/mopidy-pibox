import React from "react";
import logo from "res/logo-black.png";
import { useState } from "react";

const NothingPlaying = () => {
  return (
    <div className="flex flex-wrap justify-center flex-col items-center">
      <h2>Welcome to pibox!</h2>
      <img className="w-[70px] h-auto m-1" alt="logo" src={logo} />
      <ol type="1">
        <li className="p-1">Tap the search icon at the top right</li>
        <li className="p-1">Search for an artist, song or album</li>
        <li className="p-1">Tap on the song you want to queue</li>
        <Step4 className="p-1" />
      </ol>
    </div>
  );
};

const Step4 = ({ className }) => {
  const options = [
    "Enjoy! 🎵",
    "Have a wee boogie! 💃",
    "Have a wee boogie! 🕺",
    "Sing your heart out! 🎤",
    "Just bust a move! 😎",
    "Dance like nobody's watching! 🙈",
    "Turn it up to 11! 🎸",
  ];

  const [option] = useState(
    () => options[(options.length * Math.random()) | 0],
  );

  return <li className={className}>{option}</li>;
};

export default NothingPlaying;
