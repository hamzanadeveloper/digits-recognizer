import React, { useState, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import './App.css'
import Particles from "react-particles-js";

function App() {
  const { host, protocol } = window.location
  const [isLoading, setIsLoading] = useState(true)
  const [mouseDown, setMouseDown] = useState(false)
  const [arr, setArr] = useState(Array(784).fill(0))

  const [model, setModel] = useState(null)
  const [prediction, setPrediction] = useState(null)

  useEffect(async () => {
    window.addEventListener('mousedown', e => setMouseDown(true))
    window.addEventListener('mouseup', e => setMouseDown(false))

    setModel(await tf.loadLayersModel(`${protocol}//${host}/mnist-model/mnist-model.json`))
  }, [])

  useEffect(() => {
    if(model !== null){
      setIsLoading(false)
    }
  }, [model])

  const clearCanvas = () => {
    setArr(Array(784).fill(0))
    setPrediction(null)
  }

  const getPrediction = () => {
    const IMAGE_HEIGHT = 28
    const IMAGE_WIDTH = 28

    const testxsflat = tf.tensor2d([arr])
    const testxs = testxsflat.reshape([1, IMAGE_WIDTH, IMAGE_HEIGHT, 1])

    const preds = model.predict(testxs).argMax([-1])
    testxs.dispose()
    preds.print()

    return preds.dataSync()
  }

  const handleOver = (event) => {
    if(mouseDown) {
      let newArr = [...arr]
      newArr[event.target.id] = 1
      setArr(newArr)
    }
  }

  const submitNum = () => {
    const num = getPrediction()
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
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#263238',
                  border: "2px solid #cfd8dc",
                  borderRadius: '5px',
                }}>
                {[...Array(28)].map((val, i) => {
                  return (
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                      {[...Array(28)].map((nval, j) => {
                        const key = i * 28 + j

                        return <div
                          id={key}
                          onMouseEnter={event => handleOver(event)}
                          style={{
                            width: 10,
                            height: 10,
                            backgroundColor: arr[key] === 1 ? '#fff' : 'inherit'
                          }}
                        />
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '284px', padding: '10px'}}>
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
