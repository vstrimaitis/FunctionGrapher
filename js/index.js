$(document).ready(function(){
    var graph = new Graph({
        canvasId: "mainCanvas",
        minX: -2,
        maxX: 2,
        minY: 0,
        maxY: 4,
        intersectionX: 0,
        intersectionY: 0,
        unitsPerTick: 0.5,
        drawGrid: true,
        minParam: 0,
        maxParam: 2*Math.PI,
        minAngle: 0,
        maxAngle: 10*Math.PI,
        numberOfIterations: 10000
    });
    /*
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
    */
    graph.plotPolar(function(t){
        return (1+0.9*Math.cos(8*t))*(1+0.1*Math.cos(24*t))*(0.9+0.05*Math.cos(200*t))*(1+Math.sin(t));
    }, 'green', 2);

    /*graph.plotX(function(y){
        return 3*y*Math.log10(y)-1/36*Math.exp(-Math.pow(36*y-36/Math.E, 4));
    }, 'pink', 5);*/
});