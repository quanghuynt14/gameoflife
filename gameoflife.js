var monde = [];
var nW = Math.floor(572/30);
var nH = Math.floor(572/30);
var limite = false;

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 572;
        this.canvas.height = 572;
        this.context = this.canvas.getContext("2d");
        document.getElementById("frameGame").insertBefore(this.canvas, document.getElementById("frameGame").childNodes[0]);
        
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
      clearInterval(this.interval);
      document.getElementById("demo").innerHTML = "Game Over"; 
    }
}

function startGame() {
    myGameArea.start();
    for (var i = 0; i < nW; i++) {
        monde[i] = [];
        for (var j = 0; j < nH; j++) {
            monde[i][j] = new Cell(Math.floor((myGameArea.canvas.width-2)/nW), Math.floor((myGameArea.canvas.height-2)/nH), "white", i, j);
            monde[i][j].draw();
        }    
    }
    
    mousePressed();
}

function Cell(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x * height;
    this.y = y * width;  
    this.color = color;  

    ctx = myGameArea.context;
    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 2, this.y + 2, this.width - 2, this.height - 2);
    }

    this.update = function(newColor) {
        this.color = newColor;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);
    } 

    this.contains = function(x, y) {
        return (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height);
    } 
}


function mousePressed() {
    myGameArea.canvas.addEventListener("click", function (evt) {
        var dot = myGameArea.canvas.getBoundingClientRect();
        var mouseX = evt.clientX - dot.left;
        var mouseY = evt.clientY - dot.top;
        var largeur = monde[0].length;
        var hauteur = monde.length;
        for (var i = 0; i < hauteur; i++) {
            for (var j = 0; j < largeur; j++) {
                if (monde[i][j].contains(mouseX, mouseY)) {
                    monde[i][j].update("black");
                }
            }
        }
    });
}

function playGame() {
    myGameArea.varerval = setInterval(updateGameArea, 200);
}

function updateGameArea() {
    if (allDead()) {
        myGameArea.stop();
    } else {
        myGameArea.clear();
        Joueur();
        if (!limite && Checker()) {
            monde = Zoom();
            console.log(monde.length);
            if(monde.length == 95) limite = true;
        }
    }
}

function Joueur() {
    var largeur = monde[0].length;
    var hauteur = monde.length;

    var X = [];
    
    for (var i = 0; i < hauteur; i++) {
        X[i] = [];
        for (var j = 0; j < largeur; j++) {
            var x = 0;
            for (var k = i-1; k <= i+1; k++)
                for (var h = j-1; h <= j+1; h++) 
                    if ((k != i || h != j) && k >= 0 && k < hauteur && h >= 0 && h < largeur && monde[k][h].color == "black") x++;
                
            if (monde[i][j].color == "black") X[i][j] = celluleVivante(x);
            else X[i][j] = celluleMorte(x);
        }
    }
    for (var i = 0; i < hauteur; i++)
        for (var j = 0; j < largeur; j++) {
            monde[i][j].update(X[i][j]);
        }
}

function celluleVivante(n) {
    if (n < 2 || n > 3) return "white";
    else return "black";
}

function celluleMorte(n) {
    if (n == 3) return "black";
    else return "white";
}

function allDead() {
    var largeur = monde[0].length;
    var hauteur = monde.length;
    for (var i = 0; i < hauteur; i++)
        for (var j = 0; j < largeur; j++) {
            if (monde[i][j].color == "black") return false;
        }
    return true;
}

function Checker() {
    var largeur = monde[0].length;
    var hauteur = monde.length;
    var ok = false;
    for (var i = 0; i < hauteur; i++) {
        if (monde[i][0].color == "black" || monde[i][largeur-1].color == "black") {
            ok = true;
        }
    }
    for (var j = 0; j < largeur; j++) {
        if (monde[0][j].color == "black" || monde[hauteur-1][j].color == "black") {
            ok = true;
        }
    }
    return ok;
}

function Zoom() {

    nW = nW + 2;
    nH = nH + 2;
    var N = Math.min(Math.floor((myGameArea.canvas.width-2)/nW), Math.floor((myGameArea.canvas.height-2)/nH));
    var X = [];
    for (var i = 0; i < nW; i++) {
        X[i] = [];
        for (var j = 0; j < nH; j++) {
            X[i][j] = new Cell(N, N, "white", i, j);
        }
    }
    for (var i = 0; i < nW; i++) {
        for (var j = 0; j < nH; j++) {
            if (i > 0 && i < nW-2 && j > 0 && j < nH-2) {
                X[i+1][j+1].color = monde[i][j].color;
            }
            X[i][j].draw();
        }
    }
    

    return X;
}