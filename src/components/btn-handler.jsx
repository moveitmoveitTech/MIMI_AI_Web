import { useState, useRef, useEffect } from "react";
import { Webcam } from "../utils/webcam";
import "../style/App.css";
import { useNavigate } from "react-router-dom";
import uploadBody from "../image/uploadBody.png";


const ButtonHandler = ({ imageRef, cameraRef, videoRef, classArr, listResult, btn_setImageForCroping }) => {
  const [streaming, setStreaming] = useState(null); // streaming state
  const inputImageRef = useRef(null); // video input reference
  const inputVideoRef = useRef(null); // video input reference
  const webcam = new Webcam(); // webcam handler

  // closing image
  const closeImage = () => {
    const url = imageRef.current.src;
    imageRef.current.src = "#"; // restore image source
    URL.revokeObjectURL(url); // revoke url

    setStreaming(null); // set streaming to null
    inputImageRef.current.value = ""; // reset input image
    imageRef.current.style.display = "none"; // hide image
  };

  // closing video streaming
  const closeVideo = () => {
    const url = videoRef.current.src;
    videoRef.current.src = ""; // restore video source
    URL.revokeObjectURL(url); // revoke url

    setStreaming(null); // set streaming to null
    inputVideoRef.current.value = ""; // reset input video
    videoRef.current.style.display = "none"; // hide video
  };

  return (
    <div className="body">

      {streaming === null &&
        <div className="uploadBody">
          <img src={uploadBody} />
        </div>
      }


      <div className="btn-container">


        {/* Image Handler */}
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const url = URL.createObjectURL(e.target.files[0]); // create blob url
            imageRef.current.src = url; // set image source
            imageRef.current.style.display = "block"; // show image
            btn_setImageForCroping(e.target.files[0]);

            setStreaming("image"); // set streaming to image
          }}
          ref={inputImageRef}
        />
        <button
          onClick={() => {
            // if not streaming
            if (streaming === null) inputImageRef.current.click();
            // closing image streaming
            else if (streaming === "image") closeImage();
            else alert(`Can't handle more than 1 stream\nCurrently streaming : ${streaming}`); // if streaming video or webcam
          }}
        >
          {streaming === "image" ? "Close" : "Upload"} Image
        </button>



        {/* Video Handler */}
        <input
          type="file"
          accept="video/*"
          style={{ display: "none" }}
          onChange={(e) => {
            if (streaming === "image") closeImage(); // closing image streaming
            const url = URL.createObjectURL(e.target.files[0]); // create blob url
            videoRef.current.src = url; // set video source
            // videoRef.current.addEventListener("ended", () => closeVideo()); // add ended video listener
            videoRef.current.style.display = "block"; // show video
            setStreaming("video"); // set streaming to video
          }}
          ref={inputVideoRef}
        />
        <button
          onClick={() => {
            // if not streaming
            if (streaming === null || streaming === "image") inputVideoRef.current.click();
            // closing video streaming
            else if (streaming === "video") closeVideo();
            else alert(`Can't handle more than 1 stream\nCurrently streaming : ${streaming}`); // if streaming webcam
          }}
        >
          {streaming === "video" ? "Close" : "Upload"} Video
        </button>



        {/* Webcam Handler */}
        <button
          onClick={() => {
            // if not streaming
            if (streaming === null || streaming === "image") {
              // closing image streaming
              if (streaming === "image") closeImage();
              webcam.open(cameraRef.current); // open webcam
              cameraRef.current.style.display = "block"; // show camera
              setStreaming("camera"); // set streaming to camera
            }
            // closing video streaming
            else if (streaming === "camera") {
              webcam.close(cameraRef.current);
              cameraRef.current.style.display = "none";
              setStreaming(null);
            } else alert(`Can't handle more than 1 stream\nCurrently streaming : ${streaming}`); // if streaming video
          }}
        >
          {streaming === "camera" ? "Close" : "Open"} Webcam
        </button>



        {/* "Next Button" */}
        {(streaming === "image" || streaming === "video") &&
          <button className="next"
            onClick={() => {
              if (streaming === null) alert("please upload image or video");
              else {
                closeImage();
                closeVideo();
                listResult();
              }
            }}
          >
            Next
          </button>}



      </div>
    </div>

  );
};

export default ButtonHandler;
