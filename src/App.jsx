import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import Loader from "./components/loader";
import ButtonHandler from "./components/btn-handler";
import { detectImage, detectVideo } from "./utils/detect";
import "./style/App.css";
import logoBar from "./image/MoveitLogo.png";
import MainPage from './pages/mainPage';
import ListResultPage from './pages/listResult';

import {BrowserRouter, Routes, Route} from 'react-router-dom';

const App = () => {
  // const [image, setImage] = useState(null);
  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<MainPage />}/>
    //     <Route path="/list_Result" element={<ListResultPage />}/>
    //   </Routes>
    // </BrowserRouter>
    <MainPage />
  );
}; 

export default App;
