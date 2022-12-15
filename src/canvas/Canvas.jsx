import React, { useEffect, useRef, useState } from "react";
import StringIdGenerator from "../StringIdGenerator";
import bellman from "../bellman";
import './canvas.css';
import Drawer from "../Drawer";
const Canvas = ({ currentOperation }) => {
    const ids = StringIdGenerator.getInstace();
    const canvasRef = useRef(null);
    const [drawer, setDrawer] = useState(null);


    // track the nodes, and the arces
    const [sommets, setSommets] = useState([]);
    const [arcs, setArcs] = useState([]);
    let node1 = null;
    let node2 = null;

    // init the drawer when the canvas is created
    useEffect(() => {
        setDrawer(new Drawer(canvasRef));
    }, []);

    // draw the nodes and arces when the state changes
    useEffect(() => {
        if (drawer !== null) {
            drawer.redraw(sommets, arcs);
        }
    }, [sommets, arcs, drawer]);



    // add a node to the canvas
    const addNode = (name, X, Y) => {
        // create a new node
        const node = {
            name: name,
            X: X,
            Y: Y,
            isInShortestPath: false,
        };
        // add it to the nodes array

        // update the state
        setSommets([...sommets, node]);
        // draw it on the canvas
        drawer.drawNode(node);
    };



    // add a arc to the canvas
    const addArc = (node1, node2, weight) => {

        // if the arc already exists, don't add it
        if (node1 === node2 || arcExists(node1, node2))
            return;


        // create a new arc
        const arc = {
            node1: node1,
            node2: node2,
            weight: weight,
            isInShortestPath: false,
        };
        // add it to the arces array
        setArcs([...arcs, arc]);
        // draw it on the canvas
        //drawer.drawArc(arc);
    };
    const arcExists = (node1, node2) => {
        // check if the arc already exists
        for (let i = 0; i < arcs.length; i++) {
            if ((arcs[i].node1 === node1 && arcs[i].node2 === node2) ||
                (arcs[i].node1 === node2 && arcs[i].node2 === node1)) {
                return true;
            }
        }
        return false;
    };



    // remove a node from the canvas
    const removeNode = (node) => {
        // remove the node from the nodes array
        setSommets(sommets.filter(n => n !== node));
        // remove the node from the arces array
        arcs.forEach(arc => {
            if (arc.node1 === node || arc.node2 === node) {
                removeArc(arc);
            }
        });
    };

    // remove a arc from the canvas
    const removeArc = (arc) => {
        // remove the arc from the arces array
        setArcs(arcs.filter(v => v !== arc));

    };


    // add a node to the canvas when the user clicks on it
    const handleClick = (event) => {
        if (currentOperation === "addNode") {
            // get the canvas position
            const rect = canvasRef.current.getBoundingClientRect();

            // get the mouse position
            const X = event.clientX - rect.left;
            const Y = event.clientY - rect.top;

            // add a node to the canvas
            addNode(ids.next(), X, Y);

        } else if (currentOperation === "removeNode") {
            // get the canvas position
            const rect = canvasRef.current.getBoundingClientRect();


            // get the mouse position
            const X = event.clientX - rect.left;
            const Y = event.clientY - rect.top;


            // check if the user  clicked on a node
            sommets.forEach(node => {
                // check if the user  clicked on the node circle
                if (Math.sqrt(Math.pow(node.X - X, 2) + Math.pow(node.Y - Y, 2)) <= 30) {
                    // remove the node from the canvas
                    removeNode(node);
                }
            });
        } else if (currentOperation === "addArc") {
            // get the canvas position
            const rect = canvasRef.current.getBoundingClientRect();

            // get the mouse position
            const X = event.clientX - rect.left;
            const Y = event.clientY - rect.top;
            if (node1 === null || node1 === undefined) {
                node1 = sommets.find(node => Math.sqrt(Math.pow(node.X - X, 2) + Math.pow(node.Y - Y, 2)) <= 30);
                if (node1 !== undefined)
                    return;


            } else {
                node2 = sommets.find(node => Math.sqrt(Math.pow(node.X - X, 2) + Math.pow(node.Y - Y, 2)) <= 30);
                if (node2 === undefined)
                    return;
                if (node1 !== null && node2 !== null && node1 !== node2) {
                    let weight = prompt("Enter the weight of the arc");

                    addArc(node1, node2, weight);
                    node1 = null;
                    node2 = null;
                }
            }

        } else if (currentOperation === "removeArc") {
            // get the canvas position
            const rect = canvasRef.current.getBoundingClientRect();

            // get the mouse position
            const X = event.clientX - rect.left;
            const Y = event.clientY - rect.top;

            // check if the user clicked on a arc
            arcs.forEach(arc => {
                // check if the user clicked on the arc line
                if (Math.abs((arc.node2.Y - arc.node1.Y) * X - (arc.node2.X - arc.node1.X) * Y + arc.node2.X * arc.node1.Y - arc.node2.Y * arc.node1.X) / Math.sqrt(Math.pow(arc.node2.Y - arc.node1.Y, 2) + Math.pow(arc.node2.X - arc.node1.X, 2)) <= 5) {
                    // remove the arc from the canvas
                    removeArc(arc);
                }


            });
        }
    };

    const findShortestPath = (Node1, Node2) => {
        arcs.forEach(arc => {
            arc.isInShortestPath = false;
        });

        sommets.forEach(node => {
            node.isInShortestPath = false;
        });

        let path = bellman(sommets, arcs, Node1, Node2);

        if (path == null) {
            setArcs([...arcs]);
            setSommets([...sommets]);
            alert("Graph contains negative weight cycle");
            return;
        }
        if (path.length === 0) {
            setArcs([...arcs]);
            setSommets([...sommets]);
            alert("there is no path between the source and the destination nodes");
            return;
        }

        // set isInShortestPath attribute to true for the arcs in the shortest path, and false for the others
        // a node is in the shortest path if it is in the path array
        // we can find two nodes in the shortest path but not the arc between them, so we need to set the isInShortestPath attribute to true only if the two nodes are conse    tive in the path array
        arcs.forEach(arc => {
            for (let i = 0; i < path.length - 1; i++) {
                if ((arc.node1 === path[i] && arc.node2 === path[i + 1]) || (arc.node1 === path[i + 1] && arc.node2 === path[i])) {
                    arc.isInShortestPath = true;
                    break;
                }
            }
        });

        sommets.forEach(node => {
            if (path.includes(node)) {
                node.isInShortestPath = true;
            }
        });



        // utilser la fonction setArcs et setSommets pour mettre à jour les noeuds et les arcs
        setArcs([...arcs]);
        setSommets([...sommets]);

    };



    const findShortestPathHandler = () => {
        let node1_name = prompt("Enter the name of the source node");
        let node2_name = prompt("Enter the name of the destination node");
        let node1 = sommets.find(node => node.name === node1_name);
        let node2 = sommets.find(node => node.name === node2_name);
        // check if the source and the destination nodes exist
        if (node1 === undefined || node2 === undefined) {
            alert("the source or the destination node does not exist");
            return;
        }

        // find the shortest path between the source and the destination
        findShortestPath(node1, node2);
    }

    const reset = () => {
        setSommets([]);
        setArcs([]);
        ids._nextId = [0];

    }

    // return the canvas
    return (
        <>
            <div className="actions" >
                <button onClick={
                    () => {
                        findShortestPathHandler();
                    }}>Find shortest path</button>
                <button onClick={() => {
                    reset();
                }}>Reset</button>
            </div>
            <canvas ref={canvasRef} width={1000} height={600} onClick={handleClick} /*onDoubleClick={handleDoubleClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}*/ />
        </>
    );
};

export default Canvas;

