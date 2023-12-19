import "../style/App.css";
import "../style/furnitureList.css";
import React, { useState, useEffect, useRef } from "react";
import CropImage from "./cropImage";
import imageSrc from "../image/painting.png";



// import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Render prediction boxes
 * @param {HTMLCanvasElement} canvasRef canvas tag reference
 */


const listResult = ({classArr, closeList, imageForCroping, tfImage, btn_setImageForCroping}) => {
  const furnitures = countFurnitureInArray(classArr);

  return (
    <div className="body">
      <div className="header">
        <h1>Detected Furnitures</h1>
      </div>
      <section className="container">
        <ul className="furnitures">
          <li className="row">
            <div className="col left">
              <div className="detail">
                <p style={{ fontWeight: 700 }}>Furniture</p>
              </div>
            </div>
            <div className="col right">
              <div className="detail">
                <p style={{ fontWeight: 700 }}>Quantity</p>
              </div>
            </div>
          </li>
          {furnitures.map((furniture, index) => {
            return (
              <li className="row" key={index}>
                <div className="col left">
                  <div className="thumbnail">
                  {imageForCroping && <CropImage imageForCroping={imageForCroping} x1={furniture.name.x1} y1={furniture.name.y1} x2={furniture.name.x2} y2={furniture.name.y2} tfImage={tfImage}/> }
                  {/* <CropImage imageForCroping={imageForCroping} x1={furniture.name.x1} y1={furniture.name.y1} x2={furniture.name.x2} y2={furniture.name.y2} tfImage={tfImage}/> */}
                  </div>
                  <div className="detail">
                    <div className="name">
                      <p>{furniture.name.klass}</p>
                    </div>
                  </div>
                </div>

                <div className="col right">
                  <div className="detail">
                    <p>{furniture.count}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      <div className="btn-container">
        <button style={{ width: 70 }} onClick={() => {
          closeList();
          btn_setImageForCroping(null);
        }
        }>Back
        </button>
      </div>

    </div>
  );
};



const countFurnitureInArray = (arr = []) => {
  const res = [];
  arr.forEach(el => {

    // skip the image url
    if (typeof el === "string") {
      return;
    }

    // return index that determine the current list contain the furniture or not
    const index = res.findIndex(obj => {
      return obj['name'].klass === el.klass;
    });

    // if index = -1, it mean current list do not have that furniture, then push the furniture name and count 
    // it 's appearance = 1
    if (index === -1) {
      res.push({
        "name": el,
        "count": 1
      })
    }

    // if the current list contain that furniture, simply count of that furniture +1
    else {
      res[index]["count"]++;
    };
  });
  return res;
};

export default listResult;