import React from "react";
import NowPlaying from "components/playback/NowPlaying";
import Tracklist from "components/tracklist/Tracklist";
import QRCode from "react-qr-code";

const DisplayPage = () => {
  const joinLink = new URL(window.location);
  joinLink.pathname = "pibox/";

  return (
    <div className="flex flex-col h-screen p-5 cursor-none">
      <div className="flex flex-row items-center flex-1">
        <div className="flex-grow-0 flex-shrink-1 w-1/2">
          <NowPlaying />
        </div>
        <Tracklist display={5} readOnly />
      </div>
      <div className="flex flex-1 text-2xl items-end justify-between">
        <div>
          <a className="">{joinLink.toString()}</a>
        </div>
        <div className="h-auto max-w-24 w-full flex">
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={joinLink.toString()}
            viewBox={`0 0 256 256`}
          />
        </div>
      </div>
    </div>
  );
};

export default DisplayPage;
