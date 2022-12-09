// ajouter to the top
import React from "react";
import { createRoot } from "react-dom/client";
import './app.css';
import Canvas from "./canvas/Canvas.jsx";



const App = () => {
    const [currentOperation, setCurrentOperation] = React.useState("addNode");

    return (

        <div className="App">
            <div className="toolbar">
                <button onClick={() => { setCurrentOperation("addNode"); }}>ajouter Sommet</button>
                <button onClick={() => { setCurrentOperation("removeNode"); }}>supprimer Sommet</button>
                <button onClick={() => { setCurrentOperation("addArc"); }}>Ajouter Arc</button>
                <button onClick={() => { setCurrentOperation("removeArc"); }} >supprimer Arc</button>
            </div>
            <Canvas currentOperation={currentOperation} />
        </div>
    );

};

let container = null;
if (!container) {
    container = document.getElementById('root');
    const root = createRoot(container);
    root.render(<App />)
}
