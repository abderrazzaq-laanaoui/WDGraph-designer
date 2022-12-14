const MAX = Number.MAX_SAFE_INTEGER;
const bellman = (nodes, edges, source,distination )=>{
    // nodes as an array of {name, X, Y}
    // edges as an array of {node1, node2, weight}, where node1 and node2 are node objects

    let G = new Array(nodes.length);
    for (let i = 0; i < nodes.length; i++) {
        G[nodes[i].name] = new Array(nodes.length);
        for (let j = 0; j < nodes.length; j++) {
            G[nodes[i].name][nodes[j].name] = 0;
        }
    }

    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        G[edge.node1.name][edge.node2.name] = +edge.weight;
    }
    console.table(G);

    let dist = [];
    let prev = [];
    for(let i = 0; i < nodes.length; i++){
        dist[nodes[i].name] = MAX;
        prev[nodes[i].name] = null;
    }
    dist[source.name] = 0;

    for(let i = 0; i < nodes.length - 1; i++){
        for(let j = 0; j < edges.length; j++){
            let dist1 = dist[edges[j].node1.name];
           for(let k = 0; k < edges.length; k++){
               let dist2 = dist[edges[k].node2.name];
               if(G[edges[j].node1.name][edges[k].node2.name] != 0 && 
                dist1 + G[edges[j].node1.name][edges[j].node2.name] < dist2){
                   dist[edges[k].node2.name] = dist1 + G[edges[j].node1.name][edges[k].node2.name];
                   prev[edges[k].node2.name] = edges[j].node1.name;
               }
                
           }
        }
    }

   // detecting negative circle
    for(let i = 0; i < edges.length; i++){
        let dist1 = dist[edges[i].node1.name];
        let dist2 = dist[edges[i].node2.name];
        if(G[edges[i].node1.name][edges[i].node2.name] != 0 && dist1 + G[edges[i].node1.name][edges[i].node2.name] < dist2){
            console.log("Negative Circle found");
            return null;
        }
    }

    let path = [];
    let distination_name = distination.name;
    while(distination_name != null){
        path.push(nodes.find(node => node.name === distination_name));
        distination_name = prev[distination_name];
    }
    // if only one node is selected, path will be empty
    if(path.length <=1){
        return new Array();
    }

    path.reverse();
    return path;
}
export default bellman;