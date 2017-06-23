$(document).ready(function(){
    var graph = new Graph({
        canvasId: "mainCanvas",
        minX: -5,
        maxX: 5,
        minY: -5,
        maxY: 5,
        intersectionX: 0,
        intersectionY: 0,
        unitsPerTick: 1,
        drawGrid: true,
        minParam: 0,
        maxParam: 2*Math.PI,
        minAngle: 0,
        maxAngle: 10*Math.PI
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
    }, 'blue', 3);

    graph.plotParametric(function(t){
        return 5*Math.sin(7*Math.PI*t);
    }, function(t){
        return 5*Math.cos(5*Math.PI*t);
    }, 'orange', 3);

    graph.plotPolar(function(phi){
        return phi/10;
    }, 'blue', 5);
});