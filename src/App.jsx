// ajouter to the top
import React from "react";
import { createRoot } from "react-dom/client";
import './app.css';
import Canvas from "./canvas/Canvas.jsx";



const App = () => {
    const [currentOperation, setCurrentOperation] = React.useState("addNode");

    const handleClick = (e, operation) => {        // add class name of active to the button
        setCurrentOperation(operation);
        // log the operation
        console.log('current op => ', operation);
        const buttons = document.querySelectorAll("button");
        buttons.forEach((button) => {
            button.classList.remove("active");
        });
        e.target.classList.add("active");
    }
    return (

        <div className="App">
            <div className="toolbar">
                <button className="active"
                    onClick={(e) => { handleClick(e, "addNode"); }}
                >ajouter Sommet</button>
                <button
                    onClick={(e) => { handleClick(e, "removeNode"); }}
                >supprimer Sommet</button>
                <button
                    onClick={(e) => { handleClick(e, "addArc"); }}
                >Ajouter Arc</button>
                <button
                    onClick={(e) => { handleClick(e, "removeArc"); }}
                >supprimer Arc</button>
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
