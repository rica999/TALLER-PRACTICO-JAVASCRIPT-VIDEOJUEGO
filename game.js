//Variable que almacena la etiqueta canvas
const canvas = document.querySelector("#game");
//Creación del espacio de juego, en este caso en 2d
const game = canvas.getContext("2d");

//Cangar el canvas luego de haberse cargado por completo el HTML
window.addEventListener("load",resizeCanvas);
//Cambiar tamaño de canvas cuando se actualzia el tamaño de pantalla (responsive)
window.addEventListener("resize",resizeCanvas);

let canvasSize;

function resizeCanvas(){
    //Para que según la resolución de pantalla agregue el tamaño de width y height al canvas
    if(window.innerHeight>window.innerWidth){
        canvasSize = window.innerWidth * 0.8;
    }
    else{
        canvasSize = window.innerHeight * 0.8;
    }
    canvas.setAttribute("width",canvasSize); //al actualizarse, borra el contenido dentro del mapa
    canvas.setAttribute("height",canvasSize);

    starGame();
}

function starGame(){
    //Dividir el cuadro de canvas en 10
    const elementsSize = canvasSize / 10;

    game.font = (elementsSize-12) + "px Verdana"; //siempre el tamaño con el tipo de letra. Resto 12 porque...para que no ocupe más de la cuenta.
    game.textAlign = "end"; //cada bombita acabara en la primera coordenada de fillText
    //Imprimir 10 veces la bombita al lado del otro
    for (let i = 1; i <= 10; i++) {
        game.fillText(emojis["X"],elementsSize*i,elementsSize);
    }
    //Métodos de canvas
    /* game.fillStyle = "rgb(0, 162, 232)";
    game.fillRect(0,0,50,50); */ //dibujuar un rectangulo (x,y,ancho,alto)
}
