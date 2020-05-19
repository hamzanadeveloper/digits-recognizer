import React, { useState, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
import Button from '@material-ui/core/Button'

function App() {
  const { host, protocol } = window.location;
  const [isPressed, setIsPressed] = useState(false)
  const [MX, setMX] = useState(4)
  const [MY, setMY] = useState(4)

  const [can, setCan] = useState(null)
  const [can2, setCan2] = useState(null)

  const [ctx, setCTX] = useState(null)
  const [ctx2, setCTX2] = useState(null)

  const [model, setModel] = useState(null)

  const [numDisplay, setNumDisplay] = useState({
    showNum: false,
    numVal: null
  })

  useEffect(async () => {
    setCan(document.getElementById('canvas1'))
    setCan2(document.getElementById('canvas2'))

    setModel(await tf.loadLayersModel(`${protocol}//${host}/mnist-model/mnist-model.json`))
  }, []) 


  useEffect(() => {
    if(can !== null){
      setCTX(can.getContext('2d'))
      setCTX2(can2.getContext('2d'))
    }
  }, [can, can2])

  useEffect(() => {
    if(ctx !== null){
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#cfd8dc'
      ctx2.lineWidth = 1;
    }
  }, [ctx, ctx2])

  useEffect(() => {
    if(model !== null){
      console.log("Model has been loaded")
      model.summary()
    }
  }, [model])

  const move = (e) => {
    getMouse(e);
    if (isPressed) {
      ctx.lineTo(MX, MY);
      ctx2.lineTo(MX/8, MY/8);
      ctx.stroke()
      ctx2.stroke()
    }
  }

  const up = (e) => {
    getMouse(e);
    setIsPressed(false)
  }

  const down = (e) => {
    getMouse(e);
    ctx.beginPath();
    ctx2.beginPath();
    ctx.moveTo(MX, MY);
    ctx2.moveTo(MX/8, MY/8);
    setIsPressed(true)
  }

  const getMouse = (e) => {
    const rect = can.getBoundingClientRect()
    setMX(e.pageX - rect.left)
    setMY(e.pageY - rect.top)
  }

  const clearCanvas = () => {
    const rect = can.getBoundingClientRect()
    const rect2 = can2.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.right, rect.bottom);
    ctx2.clearRect(0, 0, rect.right, rect.bottom)
  }

  const get1Prediction = (model, canvasArr) => {
    
    const IMAGE_HEIGHT = 28;
    const IMAGE_WIDTH = 28;
  
    const testxsflat = tf.tensor2d([canvasArr])
    const testxs = testxsflat.reshape([1, IMAGE_WIDTH, IMAGE_HEIGHT, 1]);
  
    const preds = model.predict(testxs).argMax([-1]);
    testxs.dispose();
    preds.print()

    return preds[0]
    // return [preds, labels];
  }

  // ============================
  // TROUBLESHOOTING FUNC

  const convToArr = (arr) => {
    let numArr = Array(28).fill(0).map(elem => Array(28).fill(0))
    for(let i = 0; i < 28; i++){
        for(let j = 0; j < 28; j++){
            numArr[i][j] = arr[i*28+j]
        }
    }
    return numArr
  }

  // ===========================

  const submitNum = () => {
    
    const pixelData = ctx2.getImageData(0, 0, 28, 28).data;
    let testPixels = [];
    for (let i = 3; i < pixelData.length; i+=4) {
        if (pixelData[i] > 0) {
            testPixels.push(1);
        } else {
          testPixels.push(0)
        }
    }
    //const numArr = convToArr(testPixels)
    //console.log(numArr)

    const num = get1Prediction(model, testPixels)
    //setNumDisplay(num) NEED TO FIX
    //console.log(numDisplay)
  }

  return (
    <div
      style={{
        backgroundColor: '#263238',
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}>
      <div
        style={{
          color: '#cfd8dc',
          fontFamily: 'Montserrat',
          fontSize: '40px',
          fontWeight: 100
        }}>
        MNIST DIGIT PREDICTOR
      </div>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <canvas
            id="canvas1"
            width="224"
            height="224"
            style={{
              border: "2px solid #cfd8dc",
              borderRadius: '5px'
            }}
            onMouseDown={down}
            onMouseUp={up}
            onMouseMove={move}
          />
          <canvas id="canvas2" width="28" height="28" style={{ border: "1px solid black", visibility: 'hidden'}} />
        </div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '224px'}}>
          <Button variant="contained" style={{color: '#263238'}}
          onClick = {clearCanvas}>Clear</Button>
          <Button variant="contained" style={{color: '#263238'}}
          onClick={submitNum}>Submit</Button>
        </div>
      </div>
      <div style={{color: '#cfd8dc', fontFamily: 'Roboto'}}>
        We'll add a description here.
      </div>
    </div>
  );
}

export default App;
