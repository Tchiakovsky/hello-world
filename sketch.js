//new p5();
var stickman;
var constructors = [];
var color;
function setup() {
    createCanvas(710, 400);
   // color = color(255, 0, 0);
    constructors = [
        //body
        new Constructor({ x: 250, y: 200, id: 4, connectors: [1, 2, 3, 5] }),
        //torso
        new Constructor({ x: 250, y: 260, id: 5, connectors: [4, 6, 7] }),  
        //leg 
        new Constructor({ x: 300, y: 350, id: 6, connectors: [5] }),
        //leg
        new Constructor({ x: 200, y: 350, id: 7, connectors: [5] }),
    ];
}

function draw() {
    for (var i = 0; i < constructors.length; i++) {
        constructors[i].draw();
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

var selectedDot = undefined;     

function Constructor(config) {
    this.x = config.x;
    this.y = config.y;
    this.connectors = config.connectors || [];
    this.held = false;
    this.id = config.id;
    this.radius = 20;
    this.contextMenu = undefined;

    this.over = function () {
        return dist(mouse.x, mouse.y, this.x, this.y) <= this.radius;
    };
};

Constructor.prototype = {
    move: function () {
        this.x = mouse.x;
        this.y += mouse.y;
        return this;
    },
    drag: function () {
        if (!selectedDot) {
            if (mouse.isPressed && this.over()) {
                selectedDot = this;
                if (selectedDot === this) {
                    this.move();
                }
            }
        }
    },
    release: function () {
        selectedDot = undefined;
    },
    draw: function () {
        if (selectedDot === this) {
            this.held = true;
        }
        if (this.held) {
            fill(30);
        }
        ellipse(this.x, this.y, this.radius, this.radius);
        fill(255, 0, 0);
        text(this.id, this.x - 3, this.y + 6);
        fill(20);
    },
};


