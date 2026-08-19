import { useState, useRef, useEffect } from 'react';
import './App.css';
import Settings from './components/Settings';
import Canvas from './components/Canvas';

function App() {
  const [width, setWidth] = useState(32);
  const [height, setHeight] = useState(32);
  const [size, setSize] = useState(1);
  const [colorInput, setColorInput] = useState('#000000');
  const [fileState, setFileState] = useState('file');
  const [toolState, setToolState] = useState('tool');
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const actionRef = useRef('draw');
  const isMouseDownRef = useRef(false);
  const posRef = useRef({x: -1, y: -1});
  const previousSizeRef = useRef(1);
  const colorRef = useRef('#000000');
  const visualRef = useRef(null);
  const fileInputRef = useRef(null);


  function reduceIndex() {
    historyIndexRef.current -= 1;
  }

  function increaseIndex() {
    historyIndexRef.current += 1;
  }
  
  function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }

  function setColorRef(color) {
    colorRef.current = color;
  }

  function colorsMatch(c1, c2) {
    return (c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2] && c1[3] / 255 === c2[3] / 255);
  }

  function fillColor(ctx, xCoord, yCoord, color, replacedColor) {
    const queue = [[xCoord,yCoord]];
    const visitHistory = new Set();
    ctx.fillStyle = color;

    while (queue.length > 0) {
      const [x,y] = queue.pop();
      if ((x < 0) || (x > width - 1) || (y < 0) || (y > height - 1) || visitHistory.has(`${x},${y}`)) continue;
      const rgbaData = ctx.getImageData(x, y, 1, 1).data;
      visitHistory.add(`${x},${y}`);
      if (!colorsMatch(rgbaData, replacedColor)) continue;
      
      undoStackRef.current[historyIndexRef.current].points.set(`${x},${y}`, {x: x, y: y, replacedColor: rgbaData});
      ctx.fillRect(x, y, 1, 1);
      
      queue.push([x - 1, y]);
      queue.push([x + 1, y]);
      queue.push([x, y - 1]);
      queue.push([x, y + 1]);

    }

  }

  function handleAction(ctx, points, color) {
    switch (actionRef.current) {
      case 'draw':
        ctx.fillStyle = color;
        points.forEach((point) => {
          ctx.clearRect(point.x, point.y, 1, 1);
          ctx.fillRect(point.x, point.y, 1, 1);
        });
        break;
      case 'erase':
        points.forEach((point) => ctx.clearRect(point.x, point.y, 1, 1));
        break;
      case 'undo':
        points.forEach((point) => {
          const rgba = {
            red: point.replacedColor[0],
            green: point.replacedColor[1],
            blue: point.replacedColor[2],
            alpha: point.replacedColor[3] / 255
          };
          if (rgba.alpha === 0) {
            ctx.clearRect(point.x, point.y, 1, 1);
          }
          else {
            ctx.fillStyle = `rgba(${rgba.red},${rgba.green},${rgba.blue},${rgba.alpha})`;
            ctx.fillRect(point.x, point.y, 1, 1);
          }
        });
        break;
      case 'redo':
        points.forEach((point) => {
          if (color === null || color === 'rgba(0,0,0,0)') {
            ctx.clearRect(point.x, point.y, 1, 1);
          }
          else {
            ctx.fillStyle = color;
            ctx.fillRect(point.x, point.y, 1, 1);
          }
        });
        break;
      case 'fill': {
        const firstPoint = points.entries().next().value[1];
        const rgbaData = firstPoint.replacedColor;
        fillColor(ctx, firstPoint.x, firstPoint.y, color, rgbaData);
        break;
      }
      case 'eyeDropper':
        points.forEach((point) => {
          const dropperColor = ctx.getImageData(point.x, point.y, 1, 1);
          const rgba = {
            red: dropperColor.data[0],
            green: dropperColor.data[1],
            blue: dropperColor.data[2],
            alpha: dropperColor.data[3] / 255
          };
          if (rgba.alpha === 0) {
            setColorRef(`rgba(255,255,255,1`);
            setColorInput(rgbToHex(255, 255, 255));
          }
          else {
            setColorRef(`rgba(${rgba.red},${rgba.green},${rgba.blue},${rgba.alpha})`);
            setColorInput(rgbToHex(rgba.red, rgba.green, rgba.blue));
          }
        });
        break;
      default:
        break;
    } 
  }


  function setIsMouseDown(value) {
    isMouseDownRef.current = value;
  }

  function handleMouseDown() {
    setIsMouseDown(true);
  }

  function handleMouseUp() {
    setIsMouseDown(false);
  }

  function setActionRef(action) {
    actionRef.current = action;
  }

  function undo() {
    if (historyIndexRef.current === -1) {
      return;
    }
    const action = actionRef.current;
    setActionRef('undo');
    const currentEvent = undoStackRef.current[historyIndexRef.current];
    handleAction(currentEvent.ctx, currentEvent.points, null);
    redoStackRef.current.push(currentEvent);
    reduceIndex();
    setActionRef(action);
  }
  
  function redo() {
    if (historyIndexRef.current === (undoStackRef.current.length - 1)) {
      return;
    }
    const action = actionRef.current;
    setActionRef('redo');
    const currentEvent = undoStackRef.current[historyIndexRef.current + 1];
    handleAction(currentEvent.ctx, currentEvent.points, currentEvent.color);
    increaseIndex();
    setActionRef(action);
  }


  function setPosRef(object)  {
    posRef.current = object;
  }

  function selectErase() {
    setActionRef('erase');
    setPosRef({x: -1, y: -1});
  }

  function selectDraw() {
    setActionRef('draw');
    setSize(previousSizeRef.current);
    setPosRef({x: -1, y: -1});
  }

  function selectEyeDropper() {
    setActionRef('eyeDropper');
    setPosRef({x: -1, y: -1});
    previousSizeRef.current = size;
    setSize(1)
  }

  function selectFill() {
    setActionRef('fill');
    setPosRef({x: -1, y: -1});
    previousSizeRef.current = size;
    setSize(1);
  }

  function saveCanvas() {
    const dataURL = visualRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function loadCanvas(e) {
    var file = e.target.files[0]; 

    if (!file) return;

    var reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = visualRef.current;
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      img.src = e.target.result;
    }

    reader.readAsDataURL(file);
  }

  useEffect(() => {
    const keyDownFunction = function(event) {
      if (event.ctrlKey && event.key === 'z') {
        undo();
      }
      else if (event.ctrlKey && event.key === 'y') {
        redo();
      }
      else if (event.ctrlKey && event.key === 's') {
        event.preventDefault()
        saveCanvas();
      }
      else if (event.ctrlKey && event.key === 'l') {
        event.preventDefault();
        fileInputRef.current.click();
      }
      else if (event.key === 'e') {
        selectErase();
      }
      else if (event.key === 'd') {
        selectDraw();
      }
      else if (event.key === 'f') {
        selectFill();
      }
    }

    document.addEventListener('keydown', keyDownFunction);

    return () => {
      document.removeEventListener('keydown', keyDownFunction)
    };
  });

  function fileSettingOnChange(value) {
    switch(value) {
      case 'load':
        fileInputRef.current.click();
        break;
      case 'save':
        saveCanvas()
        break;
      default:
        console.log('Unexpected Value');
    }
  }

  function toolSettingOnChange(value) {
    switch(value) {
      case 'undo':
        undo();
        break;
      case 'redo':
        redo();
        break;
      case 'draw':
        selectDraw();
        break;
      case 'fill':
        selectFill();
        break;
      case 'erase':
        selectErase();
        break;
      case 'eye':
        selectEyeDropper();
        break;
      default:
        console.log('Unexpected Value')
    }
  }

  return (
    <>
      <main onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <h1>Pixel Art App</h1>
        <input type='file' id='load-button' onChange={loadCanvas} accept={'image/png'} ref={fileInputRef} aria-label='Load File'></input>
        <Settings setWidth={setWidth} setHeight={setHeight} setSize={setSize} undo={undo} redo={redo} size={size} selectFill={selectFill} selectDraw={selectDraw}
                  selectErase={selectErase} selectEyeDropper={selectEyeDropper} saveCanvas={saveCanvas} loadCanvas={loadCanvas}
                  setColorInput={setColorInput} setColorRef={setColorRef} color={colorInput} fileSettingOnChange={fileSettingOnChange} toolSettingOnChange={toolSettingOnChange}
                  toolState={toolState} fileState={fileState}>
        </Settings>
        <Canvas color={colorRef} width={width} height={height} undo={undo} historyIndex={historyIndexRef} increaseIndex={increaseIndex} size={size} action={actionRef} handleAction={handleAction} 
                isMouseDown={isMouseDownRef} pos={posRef} setPos={setPosRef} undoStack={undoStackRef} redoStack={redoStackRef} visualRef={visualRef}>
        </Canvas>
      </main>
    </>
  )
}

export default App
