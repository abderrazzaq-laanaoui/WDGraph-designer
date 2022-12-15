class Drawer {

    constructor(canvasRef) {

        this.canvasRef = canvasRef.current;
        this.context = canvasRef.current.getContext("2d");
    }

    // set the this.context when the canvasRef is not null
    setCanvas(canvasRef) {
        this.canvasRef = canvasRef.current;
        this.context =  this.canvasRef.getContext("2d");
    }
     // draw a node on the canvas
    drawNode(node) {
        // draw the white node with a black border
        this.context.beginPath();
        this.context.arc(node.X, node.Y, 30, 0, 2 * Math.PI);
        this.context.fillStyle = "white";
        this.context.fill();
        this.context.lineWidth = 2;
        if (node.isInShortestPath)
            this.context.strokeStyle = "red";
        else
            this.context.strokeStyle = "black";
        this.context.stroke();


        // draw the node name in black
        this.context.font = "25px Arial";
        if (node.isInShortestPath)
            this.context.fillStyle = "red";
        else
            this.context.fillStyle = "black";
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillText(node.name, node.X, node.Y);
    };

    // draw a arc on the canvas
    drawArc(arc)  {
        // get the canvas this.context

        // draw the arc as a black line between the closest points of the two nodes with a weight in the middle, the stroke width is 3 the end of the line is shaped as a triangle
        // get the coordinates of the closest points of the two nodes
        const point1 = this.getClosestPoint(arc.node1, arc.node2);
        const point2 = this.getClosestPoint(arc.node2, arc.node1);

        this.context.beginPath();
        this.context.moveTo(point1.X, point1.Y);
        this.context.lineTo(point2.X, point2.Y);
        this.context.lineWidth = 3;

        if (arc.isInShortestPath) {
            this.context.strokeStyle = "red";
            this.context.stroke();
            this.context.fillStyle = "red";
            this.context.fill();
        }
        else {
            this.context.strokeStyle = "black";
            this.context.stroke();
            this.context.fillStyle = "black";
            this.context.fill();
        }



        // draw the triangle at the end of the line with the same orientation as the line
        const angle = Math.atan2(point2.Y - point1.Y, point2.X - point1.X);
        this.context.beginPath();
        this.context.moveTo(point2.X, point2.Y);
        this.context.lineTo(point2.X - 20 * Math.cos(angle - Math.PI / 6), point2.Y - 20 * Math.sin(angle - Math.PI / 6));
        this.context.lineTo(point2.X - 20 * Math.cos(angle + Math.PI / 6), point2.Y - 20 * Math.sin(angle + Math.PI / 6));
        this.context.closePath();
        this.context.fill();

        // draw the weight in the middle of the line but a little bit higher 
        this.context.font = "20px Arial";
        // green color
        this.context.fillStyle = "green";
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillText(arc.weight, (point1.X + point2.X) / 2, (point1.Y + point2.Y) / 2 - 10);
    };

    getClosestPoint(node1, node2) {
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

    redraw(sommets, arcs) {
        // get the canvas this.context
        this.context.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);

        // redraw the nodes
        sommets.forEach(node => {
            this.drawNode(node);
        });

        // redraw the arces
        arcs.forEach(arc => {
            this.drawArc(arc);
        });
    };
}

export default Drawer ;