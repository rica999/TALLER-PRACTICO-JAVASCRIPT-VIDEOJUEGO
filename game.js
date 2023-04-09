//Variable que almacena la etiqueta canvas
const canvas = document.querySelector("#game");
//Creación del espacio de juego, en este caso en 2d
const game = canvas.getContext("2d");

//Cangar el canvas luego de haberse cargado por completo el HTML
window.addEventListener("load",resizeCanvas);
//Cambiar tamaño de canvas cuando se actualzia el tamaño de pantalla (responsive)
window.addEventListener("resize",resizeCanvas);

let hearths = document.querySelector("#lives");

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

let mapRowCols;
let elementsSize;

let positionJugador = {
    x:undefined,
    y:undefined
}

let posicionGift = {
    x:undefined,
    y:undefined
}

let bombitas = [];

let level = 0;

let vidas = 3;

function starGame(){
    //Dividir el cuadro de canvas en 10
    elementsSize = canvasSize / 10;

    game.font = (elementsSize-12) + "px Verdana"; //siempre el tamaño con el tipo de letra. Resto 12 porque...para que no ocupe más de la cuenta.
    game.textAlign = "end"; //cada bombita acabara en la primera coordenada de fillText
    //Imprimir 10 veces la bombita al lado del otro y en todas las filas
    /* for (let i = 1; i <= 10; i++) {
        for (let j = 1; j <= 10; j++) {
            game.fillText(emojis["X"],elementsSize*i+5,elementsSize*j-15);
        }
    } */
    renderMap(level);
    //Imprimir emojis según según mapa
    for (let i = 1; i <= 10; i++) {
        for (let j = 1; j <= 10; j++) {
            game.fillText(emojis[mapRowCols[j-1][i-1]],elementsSize*i+5,elementsSize*j-15);
            //Buscar la posición de la puerta y almacenar en el objeto de posicionJugador
            if(mapRowCols[i-1][j-1]=="O"){
                positionJugador.y = elementsSize*i, //filas
                positionJugador.x = elementsSize*j  //columnas
            }
            //Buscar la posición del regalo
            else if(mapRowCols[i-1][j-1]=="I"){
                posicionGift.y = elementsSize*i,
                posicionGift.x = elementsSize*j
            }
            //Buscar la posición de las bombas y agregarlas al arreglo bombitas
            else if(mapRowCols[i-1][j-1]=="X"){
                bombitas.push({
                    positionY : elementsSize*i,
                    positionX : elementsSize*j
                })
            }
        }
    }
    //Imprimir vidas
    const totalVidas = Array(vidas).fill(emojis["HEARTH"]); //crear un array a partir de un total de elementos (vidas) y llenarlo con el elemento elegido (emojis["hearth"])
    lives.innerHTML=totalVidas.join(" ");

    movePlayer();
    //Métodos de canvas
    /* game.fillStyle = "rgb(0, 162, 232)";
    game.fillRect(0,0,50,50); */ //dibujuar un rectangulo (x,y,ancho,alto)

}

//Separar cada elemento del array map en un arreglo nuevo, primero en columnas y luego en filas
function renderMap(number){
    if(maps[number]){ //compara si existe el elemento en el mapa, en caso ya se haya llegado al último nivel y se complete.
        const mapCols = maps[number].trim().split("\n");
        mapRowCols = mapCols.map(row => row.trim().split(""));
        //console.log({mapCols,mapRowCols});
    }
    else{
        console.log("Terminaste el juego!!!");
    }
}

//MOVIMIENTO BOTONES

const btnUp = document.querySelector("#btnUp");
const btnLeft = document.querySelector("#btnLeft");
const btnDown = document.querySelector("#btnDown");
const btnRight = document.querySelector("#btnRight");

window.addEventListener("keydown",teclaSpecific);
btnUp.addEventListener("click",teclaUp);
btnLeft.addEventListener("click",teclaDown);
btnDown.addEventListener("click",teclaLeft);
btnRight.addEventListener("click",teclaRight);

function teclaSpecific(e){
    if(e.key=="ArrowUp") teclaUp();
    else if(e.key=="ArrowDown") teclaDown();
    else if(e.key=="ArrowLeft") teclaLeft();
    else if(e.key=="ArrowRight") teclaRight();
}

function teclaUp(){
    console.log("Te movista hacia arriba");
    if(positionJugador.y > elementsSize){ //evitar que se salga del mapa
        positionJugador.y -= elementsSize;
    }
    movePlayer();
}
function teclaDown(){
    console.log("Te movista hacia abajo");
    if(positionJugador.y < canvasSize){
        positionJugador.y += elementsSize;
    }
    movePlayer();
}
function teclaLeft(){
    console.log("Te movista hacia izquierda");
    if(positionJugador.x > elementsSize){
        positionJugador.x -= elementsSize;
    }
    movePlayer();
}
function teclaRight(){
    console.log("Te movista hacia derecha");
    if(positionJugador.x < canvasSize){
        positionJugador.x += elementsSize;
    }
    movePlayer();
}
//Imprimir jugador cada vez que haya un cambio de posición
function movePlayer(){
    //Eliminar posición anterior jugador por cada movimiento.
    game.clearRect(0,0,canvasSize,canvasSize);//borrar todo el contenido del canvas
    for (let i = 1; i <= 10; i++) { //volver a renderizar el mapa con la nueva posición del jugador
        for (let j = 1; j <= 10; j++) {
            game.fillText(emojis[mapRowCols[j-1][i-1]],elementsSize*i+5,elementsSize*j-15);
        }
    }
    game.fillText(emojis["PLAYER"],positionJugador.x+5,positionJugador.y-15);//imprimir al jugador

    //Comparar la colisión entre jugador y el regalo
    if((positionJugador.x).toFixed(2) == posicionGift.x && (positionJugador.y).toFixed(2) == posicionGift.y){
        console.log("Ganaste!!!");
        winLevel();
    }
    //Comparar la colisión con las bombas
    for (let i = 0; i < bombitas.length; i++) {
        if((positionJugador.x).toFixed(2) == (bombitas[i].positionX).toFixed(2) && (positionJugador.y).toFixed(2) == (bombitas[i].positionY).toFixed(2)){
            console.log("Boom!!! REVENTASTE");
            failed();
        }
    }
}

//Pasar al siguiente nivel
function winLevel(){
    level++;
    bombitas = []; //limpiar array al renderizar nuevamente el mapa
    starGame();
}
//Regresar al inicio del nivel actual
function failed(){
    vidas--; //restar una vida por cada fail
    if(vidas==0){
        level = 0;//volver al nivel 1
        vidas = 3;//reiniciar vidas
        bombitas = []; //limpiar array al renderizar nuevamente el mapa
        starGame();
    }
    else{
        bombitas = []; //limpiar array al renderizar nuevamente el mapa
        starGame();
    }
}