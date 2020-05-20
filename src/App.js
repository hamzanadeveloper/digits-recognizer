import React, { useState, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import './App.css'
import Particles from "react-particles-js";

function App() {
  const { host, protocol } = window.location
  const [isPressed, setIsPressed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [MX, setMX] = useState(4)
  const [MY, setMY] = useState(4)

  const [can, setCan] = useState(null)
  const [can2, setCan2] = useState(null)

  const [ctx, setCTX] = useState(null)
  const [ctx2, setCTX2] = useState(null)

  const [model, setModel] = useState(null)
  const [prediction, setPrediction] = useState(null)

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
      ctx.lineWidth = 8
      ctx.strokeStyle = '#cfd8dc'
      ctx.lineCap = 'round'
      ctx2.lineCap = 'round'
      ctx2.lineWidth = 1
    }
  }, [ctx, ctx2])

  useEffect(() => {
    if(model !== null){
      setIsLoading(false)
    }
  }, [model])

  const move = (e) => {
    getMouse(e)
    if (isPressed) {
      ctx.lineTo(MX + 0.5, MY + 0.5)
      ctx2.lineTo(MX/8 + 0.5, MY/8 + 0.5)
      ctx.stroke()
      ctx2.stroke()
    }
  }

  const up = (e) => {
    getMouse(e)
    setIsPressed(false)
  }

  const down = (e) => {
    getMouse(e)
    ctx.beginPath()
    ctx2.beginPath()
    ctx.moveTo(MX + 0.5, MY + 0.5)
    ctx2.moveTo(MX/8 + 0.5, MY/8 + 0.5)
    setIsPressed(true)
  }

  const getMouse = (e) => {
    const rect = can.getBoundingClientRect()
    setMX(e.pageX - rect.left)
    setMY(e.pageY - rect.top)
  }

  const clearCanvas = () => {
    setPrediction(null)
    const rect = can.getBoundingClientRect()
    const rect2 = can2.getBoundingClientRect()
    ctx.clearRect(0, 0, rect.right, rect.bottom)
    ctx2.clearRect(0, 0, rect2.right, rect2.bottom)
  }

  const getPrediction = (model, canvasArr) => {

    const IMAGE_HEIGHT = 28
    const IMAGE_WIDTH = 28

    const testxsflat = tf.tensor2d([canvasArr])
    const testxs = testxsflat.reshape([1, IMAGE_WIDTH, IMAGE_HEIGHT, 1])

    const preds = model.predict(testxs).argMax([-1])
    testxs.dispose()
    preds.print()

    return preds.dataSync()
  }

  const convToArr = (arr) => {
    let numArr = Array(28).fill(0).map(elem => Array(28).fill(0))
    for(let i = 0; i < 28; i++){
        for(let j = 0; j < 28; j++){
            numArr[i][j] = arr[i*28+j]
        }
    }
    return numArr
  }

  const submitNum = () => {
    const pixelData = ctx2.getImageData(0, 0, 28, 28).data
    let testPixels = []
    for (let i = 3; i < pixelData.length; i+=4) {
        if (pixelData[i] > 0) {
            testPixels.push(pixelData[i]/255)
        } else {
          testPixels.push(0)
        }
    }
    const num = getPrediction(model, testPixels)
    setPrediction(num[0])
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: '#263238',
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh"
        }}
      >
        <Particles
          className="particle-canvas"
          params={{
            particles: {
              number: {
                value: 100,
                density: {
                  enable: true,
                  value_area: 1803.4120608655228
                }
              }
            }
          }}/>
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: 'transparent'
        }}>
        <div
          style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: 'transparent'
          }}>
          <div
            style={{
              color: '#cfd8dc',
              fontFamily: 'Montserrat',
              fontSize: '40px',
              fontWeight: 100,
              padding: '10px 25px',
              background: '#263238',
              border: '1px solid #cfd8dc'
            }}>
            MNIST DIGIT PREDICTOR
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              { isLoading ?
                <CircularProgress/>
                :
                null
              }
              <canvas
                id="canvas1"
                width="224"
                height="224"
                style={{
                  border: "2px solid #cfd8dc",
                  background: '#263238',
                  borderRadius: '5px',
                  display: isLoading ? 'none' : 'block'
                }}
                onMouseDown={down}
                onMouseUp={up}
                onMouseMove={move}
              />
              <canvas
                id="canvas2"
                width="28"
                height="28"
                style={{ border: "1px solid black", visibility: 'hidden', display: isLoading ? 'none' : 'block'}}
              />
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '224px'}}>
              <Button variant="contained" style={{color: '#263238'}}
                      onClick={clearCanvas}>Clear</Button>
              <Button variant="contained" style={{color: '#263238'}}
                      onClick={submitNum}>Submit</Button>
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div
              style={{
                color: '#cfd8dc',
                fontFamily: 'Montserrat',
                maxWidth: '600px',
                textAlign: 'center',
                padding: 20,
                fontSize: '24px'
              }}>
              {prediction !== null ? 'PREDICTION: ' : null }
              <span style={{fontWeight: 700, paddingLeft: '10px'}}>{prediction !== null ? prediction : null }</span>
            </div>
            <div style={{color: '#cfd8dc', fontFamily: 'Roboto', maxWidth: '600px', textAlign: 'center'}}>
              The model is a Convolutional Neural Network (CNN) built in TensorFlowJS. The model consists of
              6 layers: 2 convolutional layers, 2 downsampling layers (via max pooling), a flattening layer, and a
              dense layer for digit prediction. The total model consists of 5994 trainable parameters.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
