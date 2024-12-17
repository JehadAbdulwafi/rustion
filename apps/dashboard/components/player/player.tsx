import React from "react";

export default function Player({
  streamStatus,
}: {
  streamStatus?: StreamStatus;
}) {
  return (
    <div className="w-full h-full rounded-md">
      {streamStatus?.status === "published" ? (
        <video
          src="http://d23dyxeqlo5v.cloudfront.net/livestream"
          className="w-full h-full"
          poster={streamStatus?.thumbnail}
          controls
          controlsList="nodownload"
          disableRemotePlayback
          onError={(e) => console.log("error", e)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-accent rounded-md">
          <p>The stream is currently offline.</p>
        </div>
      )}
    </div>
  );
}
