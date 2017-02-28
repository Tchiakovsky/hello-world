
var stickman;
var constructors = [];
var color;
function setup() {
    createCanvas(710, 400);
    // color = color(255, 0, 0);
    
    constructors = [
        //body
        new Constructor({ x: 250, y: 200, id: 4, connectors: [5] }),
        //torso
        new Constructor({ x: 250, y: 260, id: 5, connectors: [6, 8] }),
        //knee-right
        new Constructor({ x: 280, y: 300, id: 6, connectors: [7]}),
        //leg-right
        new Constructor({ x: 300, y: 350, id: 7, connectors: [] }),
        //knee-left
        new Constructor({ x: 215, y: 300, id: 8, connectors: [9]}),
        //leg-left
        new Constructor({ x: 200, y: 350, id: 9, connectors: [8] }),
    ];
    stickman = new Stickman();
}

function draw() {
    background(133);
    /*constructors.forEach(function (constructor) {
        constructor.draw();
        constructor.drag();
    });*/
    stickman.draw();
    console.log(constructors[3].x + constructors[3].y);    
}

function mouseReleased() {
    //console.log('released ' + constructors.length);
    for (var i = 0; i < constructors.length; i++) {
        constructors[i].release();
    }
}

function mouseMoved () {
    //console.log('moved ' + constructors.length);
    for (var i = 0; i < constructors.length; i++) {
        constructors[i].drag();
    }
}



var mouse = {
    get x() { return mouseX; },
    get y() { return mouseY; },
    get isPressed() { return mouseIsPressed; },
    dragging: false,
    get rightButton() { return mouseButton === RIGHT; },
    get leftButton() { return mouseButton === LEFT; },
    get deltaX() { return (mouseX - pmouseX) / 400; },
    get deltaY() { return (mouseY - pmouseY) / 400; }
};

var dist = (function () {
    var s = Math.sqrt;
    return function (x1, y1, x2, y2) {
        var dx = x2 - x1, dy = y2 - y1;
        return s(dx * dx + dy * dy);
    }
})();

function Constructor(config) {
    this.x = config.x;
    this.y = config.y;
    this.connectors = config.connectors || [];
    this.held = false;
    this.id = config.id;
    this.radius = 20;
    this.isHeld = false;
    this.contextMenu = undefined;

    this.over = function () {
        return dist(mouse.x, mouse.y, this.x, this.y) <= this.radius;
    };
};

Constructor.prototype = {
    move: function () {
        this.x = mouse.x;
        this.y = mouse.y;
    },
    drag: function () {
        for (var i = 0; i < constructors.length; i++) {
            var c = constructors[i];
            if (mouse.isPressed && c.over()) {
                c.isHeld = true;
                //console.warn('drag ' + c.id);
            }
            
            if (c.isHeld) {
                console.warn(c.x);
                c.move();
            }
        }
    },
    release: function () {
        for (var i = 0; i < constructors.length; i++) {
            var c = constructors[i];
            if (c.isHeld) {
                c.isHeld = false;
            }        
        }
    },
    draw: function () {
        if (this.isHeld) {
            fill(255);
        }
        ellipse(this.x, this.y, this.radius, this.radius);
        fill(255, 0, 0);
        text(this.id, this.x - 3, this.y + 6);
        fill(20);
    },
};

var Stickman = function () {
    this.constructors = constructors;

    this.draw = function () {
        for (var i  = 0; i < this.constructors.length; i++) {
            for (var j = 0; j < this.constructors[i].connectors.length; j++) {
                // find connector with id === x
                var conn = this.constructors.filter(function(cn) {
                    return cn.id === this.constructors[i].connectors[j];
                })[0];
               
                line(this.constructors[i].x, this.constructors[i].y, conn.x, conn.y);
            }
            this.constructors[i].draw();
            this.constructors[i].drag();
        }
    };
};

