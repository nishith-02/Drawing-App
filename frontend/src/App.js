import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import InputColor from 'react-input-color';
import { useNavigate } from "react-router-dom";
let state={}
function App() {
  const [currentMode, setCurrentMode] = useState("");
  const [color, setColor] = React.useState({});
  const navigate = useNavigate();
  let group={}
  const canvas = useRef(null);
  
  const grouping=(shouldGroup)=>{
    if(shouldGroup){
      const objects=canvas.current.getObjects()
      group.val=new fabric.Group(objects,{cornerColor:"white"})
      clear()
      canvas.current.add(group.val)
      canvas.current.requestRenderAll()
    }
    else{
      group.val.destroy()
      const oldGroup=group.val.getObjects()
      canvas.current.remove(group.val)
      canvas.current.add(...oldGroup)
      group.val=null
      canvas.current.requestRenderAll()
    }
  }
  const restore=()=>{
    if(state.val){
      fabric.loadSVGFromString(state.val,objects=>{
        canvas.current.add(...objects)
        canvas.current.requestRenderAll()
      })
    }
  }
  const clear=()=>{
    state.val=canvas.current.toSVG()
    console.log(state.val)
    canvas.current.getObjects().forEach(function(object){
      canvas.current.remove(object);
    }
    )
  }
  const addRectangle=()=>{
    const canvCenter=canvas.current.getCenter();
    const rect=new fabric.Rect({
      width:100,
      height:100,
      fill:"green",
      left:canvCenter.left,
      top:-50,
      originX:"center",
      originY:"center",
    })
    canvas.current.add(rect);
    canvas.current.renderAll()
    rect.animate('top',canvCenter.top,{
      onChange:canvas.current.renderAll.bind(canvas.current),
    })
  }
  const addCircle=()=>{
    const canvCenter=canvas.current.getCenter();
    const circle=new fabric.Circle({
      radius:50,
      fill:"red",
      left:canvCenter.left,
      top:-50,
      originX:"center",
      originY:"center",
    })
    canvas.current.add(circle);
    canvas.current.renderAll()
    circle.animate("top",canvas.current.height-100,{
      onChange:canvas.current.renderAll.bind(canvas.current),
    })

  }
  const toggleMode = (mode) => {
    if (mode === "pan") {
      if (currentMode === "pan") {
        setCurrentMode("");
      } else {
        setCurrentMode("pan");
      }
    } else if (mode === "drawing") {
      if (currentMode === "drawing") {
        setCurrentMode("");
        canvas.current.isDrawingMode = false;
      } else {
        setCurrentMode("drawing");
      }
    }
  };
  useEffect(() => {
    if(localStorage.getItem("userData")===null || localStorage.getItem("token")===null){
      navigate("/")
      return
    }
      canvas.current = initCanvas()
      restore()
    let mousePressed = false;
    const modes = {
      pan: "pan",
      drawing: "drawing",
    };
    canvas.current.on("mouse:move", (event) => {
      if (mousePressed && currentMode === modes.pan) {
        canvas.current.setCursor("grab");
        const mEvent = event.e;
        const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
        canvas.current.relativePan(delta);
      } else if (mousePressed && currentMode === modes.drawing) {
        canvas.current.isDrawingMode = true;
        canvas.current.freeDrawingBrush.color = color.hex;
        canvas.current.renderAll()
      }
    });
    canvas.current.on("mouse:down", (event) => {
      mousePressed = true;
      if (currentMode === modes.pan) {
        canvas.current.setCursor("grab");
        canvas.current.renderAll();
      }
    });
    canvas.current.on("mouse:up", (event) => {
      mousePressed = false;
      canvas.current.setCursor("default");
      canvas.current.renderAll();
      if(currentMode==="drawing"){
        console.log("move up")
        state.val=canvas.current.toSVG()
        console.log(state.val)
      }
    });
      return () => {
        canvas.current.dispose();
        canvas.current = null;
      };
  }, [currentMode,color]);
  const initCanvas = () => {
    const i = new fabric.Canvas("canvas", {
      height: window.innerHeight,
      width: window.innerWidth,
      backgroundColor: "white",
      selection: false,
      renderOnAddRemove: true,
    });
    return i;
  };

  return (
    <div>
      <button onClick={() => toggleMode("pan")}>Toggle Pan</button>
      <button onClick={() => toggleMode("drawing")}>Toggle Drawing</button>
      <button onClick={addRectangle}>Rectangle</button>
      <button onClick={addCircle}>Circle</button>
      <button onClick={()=>grouping(true)}>Group</button>
      <button onClick={()=>grouping(false)}>Ungroup</button>
      <button onClick={restore}>Restore</button>
      <button onClick={clear}>Clear</button>
      <InputColor
        initialValue="#000000"
        onChange={setColor}
      />
      <canvas id="canvas" />
    </div>
  );
}

export default App;
