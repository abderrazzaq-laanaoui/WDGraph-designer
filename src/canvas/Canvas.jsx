import React, { useEffect, useRef, useState } from "react";
import StringIdGenerator from "../StringIdGenerator";
import bellman from "../bellman";
import './canvas.css';
const Canvas = ({ currentOperation }) => {
    const ids = StringIdGenerator.getInstace();
    const canvasRef = useRef(null);
    // track the nodes, and the arces
    const [sommets, setSommets] = useState([]);
    const [arcs, setArcs] = useState([]);
    let node1 = null;
    let node2 = null;

    // redraw the canvas every time the nodes or arces change
    useEffect(() => {
        console.table(sommets);
        console.table(arcs);

        redraw();
    }, [sommets, arcs]);


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
        drawNode(node);
    };

    // draw a node on the canvas
    const drawNode = (node) => {
        // get the canvas context
        const context = canvasRef.current.getContext("2d");

        // draw the white node with a black border
        context.beginPath();
        context.arc(node.X, node.Y, 30, 0, 2 * Math.PI);
        context.fillStyle = "white";
        context.fill();
        context.lineWidth = 2;
        if (node.isInShortestPath)
            context.strokeStyle = "red";
        else
            context.strokeStyle = "black";
        context.stroke();


        // draw the node name in black
        context.font = "25px Arial";
        if (node.isInShortestPath)
            context.fillStyle = "red";
        else
            context.fillStyle = "black";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(node.name, node.X, node.Y);
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
        drawArc(arc);
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

    // draw a arc on the canvas
    const drawArc = (arc) => {
        // get the canvas context
        const context = canvasRef.current.getContext("2d");

        // draw the arc as a black line between the closest points of the two nodes with a weight in the middle, the stroke width is 3 the end of the line is shaped as a triangle
        // get the coordinates of the closest points of the two nodes
        const point1 = getClosestPoint(arc.node1, arc.node2);
        const point2 = getClosestPoint(arc.node2, arc.node1);

        context.beginPath();
        context.moveTo(point1.X, point1.Y);
        context.lineTo(point2.X, point2.Y);
        context.lineWidth = 3;

        if (arc.isInShortestPath) {
            context.strokeStyle = "red";
            context.stroke();
            context.fillStyle = "red";
            context.fill();
        }
        else {
            context.strokeStyle = "black";
            context.stroke();
            context.fillStyle = "black";
            context.fill();
        }



        // draw the triangle at the end of the line with the same orientation as the line
        const angle = Math.atan2(point2.Y - point1.Y, point2.X - point1.X);
        context.beginPath();
        context.moveTo(point2.X, point2.Y);
        context.lineTo(point2.X - 20 * Math.cos(angle - Math.PI / 6), point2.Y - 20 * Math.sin(angle - Math.PI / 6));
        context.lineTo(point2.X - 20 * Math.cos(angle + Math.PI / 6), point2.Y - 20 * Math.sin(angle + Math.PI / 6));
        context.closePath();
        context.fill();

        // draw the weight in the middle of the line but a little bit higher 
        context.font = "20px Arial";
        // green color
        context.fillStyle = "green";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(arc.weight, (point1.X + point2.X) / 2, (point1.Y + point2.Y) / 2 - 10);
    };
    const getClosestPoint = (node1, node2) => {
        // get the coordinates of the closest points of the two nodes
        const point1 = {
            X: node1.X,
            Y: node1.Y

        };
        const point2 = {
            X: node2.X,
            Y: node2.Y
        };
        // if the node is above the other node
        if (node1.Y < node2.Y) {
            // if the node is to the left of the other node
            if (node1.X < node2.X) {
                // if the node is closer to the left side of the other node
                if (node2.X - node1.X > node2.Y - node1.Y) {
                    point1.X = node1.X + 30;
                }
                // if the node is closer to the top side of the other node
                else {
                    point1.Y = node1.Y + 30;
                }
            }
            // if the node is to the right of the other node
            else {
                // if the node is closer to the right side of the other node
                if (node1.X - node2.X > node2.Y - node1.Y) {
                    point1.X = node1.X - 30;
                }
                // if the node is closer to the top side of the other node
                else {
                    point1.Y = node1.Y + 30;
                }
            }
        }
        // if the node is below the other node
        else {

            // if the node is to the left of the other node
            if (node1.X < node2.X) {
                // if the node is closer to the left side of the other node
                if (node2.X - node1.X > node1.Y - node2.Y) {
                    point1.X = node1.X + 30;
                }
                // if the node is closer to the bottom side of the other node
                else {
                    point1.Y = node1.Y - 30;
                }
            }
            // if the node is to the right of the other node
            else {
                // if the node is closer to the right side of the other node
                if (node1.X - node2.X > node1.Y - node2.Y) {
                    point1.X = node1.X - 30;
                }

                // if the node is closer to the bottom side of the other node
                else {
                    point1.Y = node1.Y - 30;
                }
            }
        }
        return point1;
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

    // redraw the canvas
    const redraw = () => {
        // get the canvas context
        const context = canvasRef.current.getContext("2d");

        // clear the canvas
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // redraw the nodes
        sommets.forEach(node => {
            drawNode(node);
        });

        // redraw the arces
        arcs.forEach(arc => {
            drawArc(arc);
        });
    };

    // add a node to the canvas when the user clicks on it
    const handleClick = (event) => {
        console.log("click with operation " + currentOperation);
        if (currentOperation === "addNode") {
            // get the canvas position
            const rect = canvasRef.current.getBoundingClientRect();

            // get the mouse position
            const X = event.clientX - rect.left;
            const Y = event.clientY - rect.top;

            // add a node to the canvas
            addNode(ids.next(), X, Y);

        } else if (currentOperation === "removeNode") {
            console.log("remove node");
            // get the canvas position
            const rect = canvasRef.current.getBoundingClientRect();


            // get the mouse position
            const X = event.clientX - rect.left;
            const Y = event.clientY - rect.top;


            // check if the user  clicked on a node
            sommets.forEach(node => {
                // check if the user  clicked on the node circle
                if (Math.sqrt(Math.pow(node.X - X, 2) + Math.pow(node.Y - Y, 2)) <= 30) {
                    console.log("removing node", node);
                    // remove the node from the canvas
                    removeNode(node);
                }
            });
        } else if (currentOperation === "addArc") {
            console.log("add arc");
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
                    console.log("arc added");
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
        let path = bellman(sommets, arcs, Node1, Node2);

        if (path.length === 0) {
            alert("there is no path between the source and the destination nodes");
            return;
        }

        // set isInShortestPath attribute to true for the arcs in the shortest path, and false for the others
        // a node is in the shortest path if it is in the path array
        // we can find two nodes in the shortest path but not the arc between them, so we need to set the isInShortestPath attribute to true only if the two nodes are consecutive in the path array
        arcs.forEach(arc => {
            arc.isInShortestPath = false;
            for (let i = 0; i < path.length - 1; i++) {
                if ((arc.node1 === path[i] && arc.node2 === path[i + 1]) || (arc.node1 === path[i + 1] && arc.node2 === path[i])) {
                    arc.isInShortestPath = true;
                    break;
                }
            }
        });

        sommets.forEach(node => {
            node.isInShortestPath = false;
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
            console.log("the source or the destination node does not exist");
            console.log(node1_name, node2_name);
            return;
        }

        // find the shortest path between the source and the destination
        findShortestPath(node1, node2);
        console.log("shortest path found");
        console.log(arcs);

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

