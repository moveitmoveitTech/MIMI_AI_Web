import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";

const cropImage = ({imageForCroping, x1, y1, x2, y2, tfImage}) => {    
    const canvasRef = useRef(null);
    
  
    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      // console.log(tfImage);
      // tf.browser.toPixels(img, canvas);

      let img = new Image();
      const url = URL.createObjectURL(imageForCroping);
      img.src = url;

      img.onload = function () {
        var cropPartx1;
        var cropPartx2;
        var cropParty1;
        var cropParty2;
  
        if (img.width === img.height){
          cropPartx1 = img.width * x1;
          cropParty1 = img.height * y1;
          cropPartx2 = img.width * x2;
          cropParty2 = img.height * y2;
        } else if ( img.width > img.height) {
          cropPartx1 = img.width * x1;
          cropParty1 = (img.height + (img.width - img.height)) * y1;
          cropPartx2 = img.width * x2;
          cropParty2 = (img.height + (img.width - img.height)) * y2;
        } else if (img.width < img.height) {
          cropPartx1 = (img.width + (img.height - img.width)) * x1;
          cropParty1 = img.width * y1;
          cropPartx2 = (img.width + (img.height - img.width)) * x2;
          cropParty2 = img.width * y2;
        }

  
        const cropPartWidth = cropPartx2 - cropPartx1;
        const cropPartHeight = cropParty2 - cropParty1;

        context.drawImage(img, cropPartx1, cropParty1, cropPartWidth, cropPartHeight, 0,0,canvas.width,canvas.height);
      }
    });

    return (
        <canvas ref={canvasRef} width="40" height="40" ></canvas>
    )

}

export default cropImage;