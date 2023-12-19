import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import Loader from "../components/loader";
import ButtonHandler from "../components/btn-handler";
import ListResultPage from "./listResult"
import { detectImage, detectVideo, detectCameraVideo } from "../utils/detect";
import "../style/App.css";
import "../style/furnitureList.css";
import logoBar from "../image/MoveitLogo.png";

const main = (props) => {
  const [loading, setLoading] = useState({ loading: true, progress: 0 }); // loading state
  const [model, setModel] = useState({
    net: null,
    inputShape: [1, 0, 0, 3],
  }); // init model & input shape

  // references
  const imageRef = useRef(null);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);


  const [listResult, setListResult] = useState(false);
  const [imageForCroping, setImageForCroping] = useState(null);
  const [tfImage, setTfImage] = useState(null);

  function showList() {
    setListResult(true);
  }
  function closeList(){
    setListResult(false);
  }
  function btn_setImageForCroping(imgSrc){
    setImageForCroping(imgSrc);
  }
  function fnSetTfImage(tfImage){
    setTfImage(tfImage);
  }


  // model configs
  const modelName = "best";
  const classThreshold = 0.2;
  const [classArray, setClassArray] = useState([]);


  useEffect(() => {
    tf.ready().then(async () => {
      const yolov5 = await tf.loadGraphModel(
        `${window.location.href}/${modelName}_web_model/model.json`,
        {
          onProgress: (fractions) => {
            setLoading({ loading: true, progress: fractions }); // set loading fractions
          },
        }
      ); // load model

      // warming up model
      const dummyInput = tf.ones(yolov5.inputs[0].shape);
      const warmupResult = await yolov5.executeAsync(dummyInput);
      tf.dispose(warmupResult); // cleanup memory
      tf.dispose(dummyInput); // cleanup memory

      setLoading({ loading: false, progress: 1 });
      setModel({
        net: yolov5,
        inputShape: yolov5.inputs[0].shape,
      }); // set model & input shape
    });
  }, []);

  return (
    <div className="App">
      {loading.loading && <Loader>Loading model... {(loading.progress * 100).toFixed(2)}%</Loader>}
      <div className="MIMItopBar">
        <img src={logoBar} />
      </div>

      {listResult === false &&

        <><div className="body">
          <div className="mainPageHeader">
            <h1>Furniture Detection AI Trial</h1>
          </div>

          <div className="content">
            {/* image */}
            <img
              src="#"
              ref={imageRef}
              onLoad={async () => {
                var tempArray = await Promise.resolve(detectImage(imageRef.current, model, classThreshold, canvasRef.current));
                setClassArray(tempArray);
              } } />

            {/* video */}
            <video
              autoPlay
              muted
              loop
              ref={videoRef}
              onPlay={async () => {
                var tempArray = await Promise.resolve(detectVideo(videoRef.current, model, classThreshold, canvasRef.current,fnSetTfImage));
                setClassArray(tempArray);
              } } />

            {/* webcam */}
            <video
              autoPlay
              muted
              ref={cameraRef}
              onPlay={() => detectCameraVideo(cameraRef.current, model, classThreshold, canvasRef.current)} />

            <canvas width={model.inputShape[1]} height={model.inputShape[2]} ref={canvasRef} />
          </div>
        </div><ButtonHandler imageRef={imageRef} videoRef={videoRef} classArr={classArray} listResult={showList} btn_setImageForCroping={btn_setImageForCroping} cameraRef={cameraRef}/></>
      }
      {listResult === true &&

        <ListResultPage classArr={classArray} closeList={closeList} imageForCroping={imageForCroping} btn_setImageForCroping={btn_setImageForCroping} tfImage={tfImage}/>
        

      }
      {/* <button onClick={() => {console.log(classArray)}}>test</button> */}
      




    </div>
  );
}; //cameraRef={cameraRef}

export default main;