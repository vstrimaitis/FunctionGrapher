function Graph(options){
    this.canvas = document.getElementById(options.canvasId);
    this.minX = (options.minX !== undefined) ? options.minX : -1;
    this.maxX = (options.maxX !== undefined) ? options.maxX : 1;
    this.minY = (options.minY !== undefined) ? options.minY : -1;
    this.maxY = (options.maxY !== undefined) ? options.maxY : 1;
    this.intersectionX = (options.intersectionX !== undefined) ? options.intersectionX : 0;
    this.intersectionY = (options.intersectionY !== undefined) ? options.intersectionY : 0;
    this.unitsPerTick = (options.unitsPerTick !== undefined) ? options.unitsPerTick : 1;
    this.minParam = (options.minParam !== undefined) ? options.minParam : 0;
    this.maxParam = (options.minParam !== undefined) ? options.maxParam : 2*Math.PI;
    this.minAngle = (options.minAngle !== undefined) ? options.minAngle : 0;
    this.maxAngle = (options.maxAngle !== undefined) ? options.maxAngle : 2*Math.PI;
    this.axisColor = options.axisColor || 'black';
    this.gridColor = options.gridColor || 'grey';

    this.arrowHeadSize = 10;
    this.font = '12pt ComputerModern';
    this.tickSize = 10;
    this.xTickSpacing = this.canvas.width / (Math.round((this.maxX - this.minX) / this.unitsPerTick) + 2);
    this.yTickSpacing = this.canvas.height / (Math.round((this.maxY - this.minY) / this.unitsPerTick) + 2);

    this.dx = (this.maxX - this.minX) / 1000;
    this.dParam = (this.maxParam - this.minParam) / 1000;
    this.dAngle = (this.maxAngle - this.minAngle) / 1000;

    if(options.drawGrid){
        this.drawGrid();
    }
    this.drawXAxis();
    this.drawYAxis();
}

Graph.prototype.drawGrid = function(){
    var ctx = this.canvas.getContext('2d');
    ctx.save();
    ctx.beginPath();
    for(var x = this.minX; x <= this.maxX; x += this.unitsPerTick){
        if(x == this.intersectionX){
            continue;
        }
        ctx.moveTo(this.xToPixels(x), 0);
        ctx.lineTo(this.xToPixels(x), this.canvas.height);
    }
    for(var y = this.minY; y <= this.maxY; y += this.unitsPerTick){
        if(y == this.intersectionY){
            continue;
        }
        ctx.moveTo(0, this.yToPixels(y));
        ctx.lineTo(this.canvas.width, this.yToPixels(y));
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.gridColor;
    ctx.setLineDash([5, 3]);
    ctx.stroke();
    ctx.restore();
}

Graph.prototype.drawXAxis = function(){
    var ctx = this.canvas.getContext('2d');
    ctx.save();
    ctx.beginPath();
    var y = this.yToPixels(this.intersectionY);
    this.drawArrow(0, y, this.canvas.width, y);
    ctx.strokeStyle = this.axisColor;
    ctx.lineWidth = 1;

    var tickLen = this.xTickSpacing;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = this.font;
    for(var x = tickLen, label = this.minX; label <= this.maxX; x += tickLen, label += this.unitsPerTick){
        ctx.moveTo(x, y - this.tickSize/2);
        ctx.lineTo(x, y + this.tickSize/2);
        if(label != this.intersectionX){
            ctx.fillText(label, x, y+this.tickSize/2+parseInt(ctx.font));
        }
    }
    ctx.fillText('x', this.canvas.width-ctx.measureText('x').width, y+this.tickSize/2+parseInt(ctx.font));
    ctx.stroke();

    ctx.restore();
};

Graph.prototype.drawYAxis = function(){
    var ctx = this.canvas.getContext('2d');
    ctx.save();
    ctx.beginPath();
    var x = this.xToPixels(this.intersectionX);
    this.drawArrow(x, this.canvas.height, x, 0);
    ctx.strokeStyle = this.axisColor;
    ctx.lineWidth = 1;

    var tickLen = this.yTickSpacing;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = this.font;
    for(var y = tickLen, label = this.maxY; label >= this.minY; y += tickLen, label -= this.unitsPerTick){
        ctx.moveTo(x - this.tickSize/2, y);
        ctx.lineTo(x + this.tickSize/2, y);
        if(label != this.intersectionY){
            ctx.fillText(label, x - this.tickSize/2-ctx.measureText(label).width, y);
        }
    }
    ctx.textBaseline = 'top';
    ctx.fillText('y', x-ctx.measureText('y').width-this.tickSize/2, 0);
    ctx.stroke();

    ctx.restore();
};

Graph.prototype.drawArrow = function canvas_arrow(startX, startY, endX, endY){
    var headlen = this.arrowHeadSize;   // length of head in pixels
    var angle = Math.atan2(endY-startY,endX-startX);
    var ctx = this.canvas.getContext('2d');
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineTo(endX-headlen*Math.cos(angle-Math.PI/6),endY-headlen*Math.sin(angle-Math.PI/6));
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX-headlen*Math.cos(angle+Math.PI/6),endY-headlen*Math.sin(angle+Math.PI/6));
}

Graph.prototype.yToPixels = function(y){
    var k = (this.canvas.height - 2*this.yTickSpacing) / (this.minY - this.maxY);
    var b = this.yTickSpacing - k*this.maxY;
    return k*y+b;
}

Graph.prototype.xToPixels = function(x){
    var k = (this.xTickSpacing*2 - this.canvas.width) / (this.minX - this.maxX);
    var b = this.xTickSpacing - k*this.minX;
    return k*x+b;
}

Graph.prototype.plot = function(func, color, thickness){
    color = color || 'black';
    thickness = thickness || 1;
    var ctx = this.canvas.getContext('2d');
    ctx.save();
    
    ctx.save();
    
    // move to center and scale plot
    ctx.beginPath();
    ctx.translate(this.xToPixels(this.intersectionX), this.yToPixels(this.intersectionY));
    ctx.scale((this.canvas.width-2*this.xTickSpacing) / (this.maxX-this.minX),
                -(this.canvas.height-2*this.yTickSpacing)/(this.maxY-this.minY));
    ctx.moveTo(this.minX, func(this.minX));
    for(var x = this.minX; x <= this.maxX; x += this.dx){
        ctx.lineTo(x, func(x));
    }
    ctx.restore();
    
    ctx.lineJoin = 'round';
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.restore();
};

Graph.prototype.plotParametric = function(fx, fy, color, thickness){
    color = color || 'black';
    thickness = thickness || 1;
    var ctx = this.canvas.getContext('2d');
    ctx.save();
    
    ctx.save();
    
    // move to center and scale plot
    ctx.beginPath();
    ctx.translate(this.xToPixels(this.intersectionX), this.yToPixels(this.intersectionY));
    ctx.scale((this.canvas.width-2*this.xTickSpacing) / (this.maxX-this.minX),
                -(this.canvas.height-2*this.yTickSpacing)/(this.maxY-this.minY));
    ctx.moveTo(fx(this.minParam), fy(this.maxParam));
    for(var t = this.minParam; t <= this.maxParam; t += this.dParam){
        ctx.lineTo(fx(t), fy(t));
    }
    ctx.restore();
    
    ctx.lineJoin = 'round';
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.restore();
}

Graph.prototype.plotPolar = function(fr, color, thickness){
    color = color || 'black';
    thickness = thickness || 1;
    var ctx = this.canvas.getContext('2d');
    var x = function(phi){
        return fr(phi)*Math.cos(phi);
    };
    var y = function(phi){
        return fr(phi)*Math.sin(phi);
    }
    ctx.save();
    
    ctx.save();
    
    // move to center and scale plot
    ctx.beginPath();
    ctx.translate(this.xToPixels(this.intersectionX), this.yToPixels(this.intersectionY));
    ctx.scale((this.canvas.width-2*this.xTickSpacing) / (this.maxX-this.minX),
                -(this.canvas.height-2*this.yTickSpacing)/(this.maxY-this.minY));
    ctx.moveTo(x(this.minAngle), y(this.maxAngle));
    for(var a = this.minAngle; a <= this.maxAngle; a += this.dAngle){
        ctx.lineTo(x(a), y(a));
    }
    ctx.restore();
    
    ctx.lineJoin = 'round';
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.restore();
}