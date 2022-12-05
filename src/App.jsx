// add to the top
import React from "react";
import { createRoot } from "react-dom/client";
import './app.css';
import Canvas from "./canvas/Canvas.jsx";



const App = () => {
    const [currentOperation, setCurrentOperation] = React.useState("addNode");

    return (

        <div className="App">
            <div className="toolbar">
                <button onClick={() => { setCurrentOperation("addNode"); }}>add node</button>
                <button onClick={() => { setCurrentOperation("removeNode"); }}>remove node</button>
                <button onClick={() => { setCurrentOperation("addVertix"); }}>add vertix</button>
                <button onClick={() => { setCurrentOperation("removeVertix"); }} >remove vertix</button>
                <button onClick={() => { setCurrentOperation("changeVertixWeight"); }}>change vertix weight</button>

            </div>
            <Canvas currentOperation={currentOperation} />
        </div>
    );

};


createRoot(document.getElementById("root")).render(<App />);
