$(document).ready(function(){
    var graph = new Graph({
        canvasId: "mainCanvas",
        minX: 0,
        maxX: 20,
        minY: -5,
        maxY: 5,
        intersectionX: 0,
        intersectionY: 0,
        unitsPerTick: 1,
        drawGrid: true
    });

    graph.plot(function(x){ 
        return x/4;
    });

    graph.plot(function(x){
        return x*x/80;
    }, 'red', 2);

    graph.plot(function(x){
        return Math.sin(x);
    }, 'green');

    graph.plot(function(x){
        return 5*Math.sin(x) * Math.exp(-x/5);
    }, 'blue', 3)
});