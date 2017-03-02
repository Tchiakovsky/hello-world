
var stickman;
var constructors = [];
var color;
var frames = [];
var play = !true;
var frame_num = 0;
function setup() {
    createCanvas(710, 400);
    constructors = [
        //head
        new Constructor({ x: 250, y: 130, id: 1, connectors: []}),
        //elbow-left
        new Constructor({ x: 200, y: 170, id: 2, connectors: [3]}),
        //arm-left
        new Constructor({ x: 150, y: 150, id: 3, connectors: []}),
        //elbow-right
        new Constructor({ x: 300, y: 170, id: 4, connectors: [5]}),
        //arm-right
        new Constructor({ x: 350, y: 150, id: 5, connectors: []}),
        //body
        new Constructor({ x: 250, y: 200, id: 6, connectors: [1, 7, 2, 4] }),
        //torso
        new Constructor({ x: 250, y: 260, id: 7, connectors: [8, 10] }),
        //knee-right
        new Constructor({ x: 280, y: 300, id: 8, connectors: [9]}),
        //leg-right
        new Constructor({ x: 300, y: 350, id: 9, connectors: [] }),
        //knee-left
        new Constructor({ x: 215, y: 300, id: 10, connectors: [11]}),
        //leg-left
        new Constructor({ x: 200, y: 350, id: 11, connectors: [] }),
    ];
    stickman = new Stickman();
}

function draw() {
    background(133);
    stickman.draw();
    if (play) {
        image(frames[frame_num]);
        frame_num++;
    }
}

function mouseReleased() {
    for (var i = 0; i < constructors.length; i++) {
        constructors[i].release();
    }
}

function mouseMoved () {
    for (var i = 0; i < constructors.length; i++) {
        constructors[i].drag();
    }
}

function keyPressed () {
    if (keyCode === UP_ARROW) {
        frames.push(get(0, 0, 710, 400));
    }
    if (keyCode === 32) {
        play = true;
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
                
            }
            
            if (c.isHeld) {
                
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
            //this.constructors[i].drag();
        }
    };
};

