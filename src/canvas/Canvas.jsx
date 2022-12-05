import React, { useEffect, useRef, useState } from "react";
import StringIdGenerator from "../StringIdGenerator";
import './canvas.css';
const Canvas = ({ currentOperation }) => {
    const ids = StringIdGenerator.getInstace();
    const canvasRef = useRef(null);
    // track the nodes, and the vertixes
    const [sommets, setSommets] = useState([]);
    const [arcs, setArcs] = useState([]);
    let node1 = null;
    let node2 = null;

    // redraw the canvas every time the nodes or vertixes change
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
            Y: Y
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
        context.strokeStyle = "black";
        context.stroke();


        // draw the node name in black
        context.font = "25px Arial";
        context.fillStyle = "black";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(node.name, node.X, node.Y);
    };

    // add a vertix to the canvas
    const addVertix = (node1, node2, weight) => {

        // if the vertix already exists, don't add it
        if (node1 === node2 || vertixExists(node1, node2))
            return;


        // create a new vertix
        const vertix = {
            node1: node1,
            node2: node2,
            weight: weight
        };
        // add it to the vertixes array
        setArcs([...arcs, vertix]);
        // draw it on the canvas
        drawVertix(vertix);
    };
    const vertixExists = (node1, node2) => {
        // check if the vertix already exists
        for (let i = 0; i < arcs.length; i++) {
            if ((arcs[i].node1 === node1 && arcs[i].node2 === node2) ||
                (arcs[i].node1 === node2 && arcs[i].node2 === node1)) {
                return true;
            }
        }
        return false;
    };

    // draw a vertix on the canvas
    const drawVertix = (vertix) => {
        // get the canvas context
        const context = canvasRef.current.getContext("2d");

        // draw the vertix as a black line between the closest points of the two nodes with a weight in the middle, the stroke width is 3 the end of the line is shaped as a triangle
        // get the coordinates of the closest points of the two nodes
        const point1 = getClosestPoint(vertix.node1, vertix.node2);
        const point2 = getClosestPoint(vertix.node2, vertix.node1);

        context.beginPath();
        context.moveTo(point1.X, point1.Y);
        context.lineTo(point2.X, point2.Y);
        context.lineWidth = 3;

        if (vertix.isInShortestPath) {
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
        // draw the weight in the middle of the line but a little bit higher 
        context.font = "20px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(vertix.weight, (point1.X + point2.X) / 2, (point1.Y + point2.Y) / 2 - 10);


        // draw the triangle at the end of the line with the same orientation as the line
        const angle = Math.atan2(point2.Y - point1.Y, point2.X - point1.X);
        context.beginPath();
        context.moveTo(point2.X, point2.Y);
        context.lineTo(point2.X - 20 * Math.cos(angle - Math.PI / 6), point2.Y - 20 * Math.sin(angle - Math.PI / 6));
        context.lineTo(point2.X - 20 * Math.cos(angle + Math.PI / 6), point2.Y - 20 * Math.sin(angle + Math.PI / 6));
        context.closePath();
        context.fill();

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
        // remove the node from the vertixes array
        arcs.forEach(vertix => {
            if (vertix.node1 === node || vertix.node2 === node) {
                removeVertix(vertix);
            }
        });
    };

    // remove a vertix from the canvas
    const removeVertix = (vertix) => {
        // remove the vertix from the vertixes array
        setArcs(arcs.filter(v => v !== vertix));

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

        // redraw the vertixes
        arcs.forEach(vertix => {
            drawVertix(vertix);
        });
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
        } else if (currentOperation === "addVertix") {

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
                    let weight = prompt("Enter the weight of the vertix");

                    addVertix(node1, node2, weight);
                    console.log("vertix added");
                    node1 = null;
                    node2 = null;
                }
            }

        } else if (currentOperation === "removeVertix") {
            // get the canvas position
            const rect = canvasRef.current.getBoundingClientRect();

            // get the mouse position
            const X = event.clientX - rect.left;
            const Y = event.clientY - rect.top;

            // check if the user clicked on a vertix
            arcs.forEach(vertix => {
                // check if the user clicked on the vertix line
                if (Math.abs((vertix.node2.Y - vertix.node1.Y) * X - (vertix.node2.X - vertix.node1.X) * Y + vertix.node2.X * vertix.node1.Y - vertix.node2.Y * vertix.node1.X) / Math.sqrt(Math.pow(vertix.node2.Y - vertix.node1.Y, 2) + Math.pow(vertix.node2.X - vertix.node1.X, 2)) <= 5) {
                    // remove the vertix from the canvas
                    removeVertix(vertix);
                }


            });
        }
    };

    const findShortestPath = (Node1, Node2) => {
        // application de l'algorithme de bellman ford
        // trouver le chamin le plus court entre deux noeuds
        // marquer les arcs qui sont dans le chemin le plus court avec un attribut "isInShortestPath" à true
        // marquer les noeuds qui sont dans le chemin le plus court avec un attribut "isInShortestPath" à true
        // utilser la fonction setArcs et setSommets pour mettre à jour les noeuds et les arcs

        // réinitialiser les attributs isInShortestPath des noeuds et des arcs
        arcs.forEach(vertix => {
            vertix.isInShortestPath = false;
        });
        sommets.forEach(node => {
            node.isInShortestPath = false;
        });
        // réinitialiser les attributs distance et previous du noeud source
        Node1.distance = 0;
        Node1.previous = null;
        // réinitialiser les attributs distance et previous des autres noeuds
        sommets.forEach(node => {
            if (node !== Node1) {
                node.distance = Infinity;
                node.previous = null;
            }
        });
        // répéter V-1 fois
        for (let i = 1; i < sommets.length; i++) {
            // pour chaque arc
            arcs.forEach(vertix => {
                // si le poids de l'arc + la distance du noeud source est inférieur à la distance du noeud destination
                if (vertix.node1.distance + vertix.weight < vertix.node2.distance) {
                    // mettre à jour la distance du noeud destination
                    vertix.node2.distance = vertix.node1.distance + vertix.weight;
                    // mettre à jour le previous du noeud destination
                    vertix.node2.previous = vertix.node1;
                }
            });
        }
        // pour chaque arc
        arcs.forEach(vertix => {
            // si le poids de l'arc + la distance du noeud source est inférieur à la distance du noeud destination
            if (vertix.node1.distance + vertix.weight < vertix.node2.distance) {
                // afficher un message d'erreur
                alert("Le graphe contient un cycle de poids négatif");
            }
        });
        // marquer les noeuds qui sont dans le chemin le plus court avec un attribut "isInShortestPath" à true
        let node = Node2;
        while (node !== null) {
            node.isInShortestPath = true;
            node = node.previous;
        }
        // marquer les arcs qui sont dans le chemin le plus court avec un attribut "isInShortestPath" à true
        arcs.forEach(vertix => {
            if (vertix.node2.isInShortestPath && vertix.node1.isInShortestPath)
                vertix.isInShortestPath = true;
        });
        // utilser la fonction setArcs et setSommets pour mettre à jour les noeuds et les arcs
        setArcs([...arcs]);
        setSommets([...sommets]);

    };



    const findShortestPathHandler = () => {
        let node1 = prompt("Enter the name of the source node");
        let node2 = prompt("Enter the name of the destination node");
        // check if the source and the destination nodes exist
        if (sommets.find(node => node.name === node1) === undefined || sommets.find(node => node.name === node2) === undefined) {
            console.log("the source or the destination node does not exist");
            return;
        }

        // find the shortest path between the source and the destination
        findShortestPath(sommets.find(node => node.name === node1), sommets.find(node => node.name === node2));
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
            <button onClick={
                () => {
                    findShortestPathHandler();
                }}>Find shortest path</button>
            <button onClick={() => {
                reset();
            }}>Reset</button>
            <canvas ref={canvasRef} width={1000} height={600} onClick={handleClick} /*onDoubleClick={handleDoubleClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}*/ />
        </>
    );
};

export default Canvas;

