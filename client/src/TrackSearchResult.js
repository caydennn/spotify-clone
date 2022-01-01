import React from "react";

export default function TrackSearchResult({ track, chooseTrack }) {

    function handlePlay() {
        chooseTrack(track)
    }
  return (
    <div
      className="d-flex m-1 align-items-center"
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} />
      <div className="m-3">
        <div>{track.title}</div>
        <div className="text-muted">{track.artist}</div>
      </div>
    </div>
  );
}
