import React, { useState, useEffect } from 'react';

function App() {
  const [isPressed, setIsPressed] = useState(false)

  useEffect(() => {
    generateCanvas()
  }, [])

  const generateCanvas = () => {
    console.log("Loaded the canvas JS")
    const can = document.getElementById('canvas1');
    const ctx = can.getContext('2d');
    ctx.lineWidth = 8;

    const can2 = document.getElementById('canvas2')
    const ctx2 = can2.getContext('2d');
    ctx2.lineWidth = 1;
  }

  return (
    <div>
      <canvas id="canvas1" width="224" height="224" style={{ border: "1px solid black"}} />
      <canvas id="canvas2" width="28" height="28" style={{ border: "1px solid black"}} />
    </div>
  );
}

export default App;
