//Variable que almacena la etiqueta canvas
const canvas = document.querySelector("#game");
//Creación del espacio de juego, en este caso en 3d
const game = canvas.getContext("2d");

//Cangar el canvas luego de haberse cargado por completo el HTML
window.addEventListener("load",resizeCanvas);
//Cambiar tamaño de canvas cuando se actualzia el tamaño de pantalla (responsive)
window.addEventListener("resize",resizeCanvas);

let hearths = document.querySelector("#lives");
let timePlay = document.querySelector("#timePlay");
let timeRecord = document.querySelector("#timeRecord");

let btnDirections = document.querySelector("#btnDirections");
let btnNewGame = document.querySelector("#btnNewGame");

let btnSelection = document.querySelector("#btnSelection");
let btnYes = document.querySelector("#btnYes");
let btnNo = document.querySelector("#btnNo");

let canvasSize;

let timeStart;
let timeInterval;

let totalVidas;

let recordFinal = document.querySelector("#recordFinal");

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

let timePlayer;
let timeFinal;
let secondFinal;
let minuteFinal;

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
    //Para que cuando cambia el tamaño de pantalla se quede en el lugar de inicio
    positionJugador.x = undefined;
    positionJugador.y = undefined;

    starGame();
}

function starGame(){
    //Dividir el cuadro de canvas en 10
    elementsSize = canvasSize / 10;

    game.font = (elementsSize-13) + "px Verdana"; //siempre el tamaño con el tipo de letra. Resto 13 porque...para que no ocupe más de la cuenta.
    game.textAlign = "end"; //cada bombita acabara en la primera coordenada de fillText

    if(level<maps.length){ //Verificar si aún no se termina el último nivel del juego
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
        totalVidas = Array(vidas).fill(emojis["HEARTH"]); //crear un array a partir de un total de elementos (vidas) y llenarlo con el elemento elegido (emojis["hearth"])
        lives.innerHTML=totalVidas.join(" ");

        //Imprimir tiempo de inicio de jugador
        if (!timeStart) { //valida si el tiempo de juego ya inicio
            timeStart = Date.now();  //guarda el tiempo trancurrido desde 01/01/70 en milisegundos
            timeInterval = setInterval(showTime, 100);
        }
        //Comparar si localStorage tiene alguna variable para imprimir o no contenido en el record
        if(localStorage.length==0){
            timeRecord.innerHTML="";
        }
        else{
            timeRecord.innerHTML=new Date(Number(localStorage.getItem("record"))).getMinutes()+" min "+new Date(Number(localStorage.getItem("record"))).getSeconds()+" segundos";
        }
        movePlayer();
    }
    else{//Si ya terminó el juego
        game.clearRect(0,0,canvasSize,canvasSize); //borrar el contenido del mapa
        letterSizeEndGame();
        clearInterval(timeInterval);//parar el intervalo del tiempo de jugador
        recordValue();
        btnDirections.classList.add("hidden");
        btnNewGame.classList.remove("hidden");
    }
}
//Tamaño de vista de JUEGO TERMINADO
function letterSizeEndGame(){
    if(window.innerWidth<600){
        game.font="20px Verdana";
        game.textAlign = "center";
        game.fillText("Terminaste el juego!!!",canvasSize/2,canvasSize/9);
        game.font="35px Verdana";
        game.fillText("🏆",canvasSize/2,canvasSize/3);
    }
    else{
        game.font="45px Verdana";
        game.textAlign = "center";
        game.fillText("Terminaste el juego!!!",canvasSize/2,canvasSize/9);
        game.font="85px Verdana";
        game.fillText("🏆",canvasSize/2,canvasSize/3);
    }
}
//Separar cada elemento del array map en un arreglo nuevo, primero en columnas y luego en filas
function renderMap(number){
    if(maps[number]){ //compara si existe el elemento en el mapa, en caso ya se haya llegado al último nivel y se complete.
        const mapCols = maps[number].trim().split("\n");
        mapRowCols = mapCols.map(row => row.trim().split(""));
    }
}

function recordValue(){
    timeFinal = timePlayer; //almacenar el tiempo cuando finaliza el último nivel
    if(!localStorage.getItem("record")){//compara si localstorage tiene alguna variable almacenada con el nombre record
        localStorage.setItem("record",timeFinal);//guardar el record
        secondFinal = new Date(Number(localStorage.getItem("record"))).getSeconds();//obtener segundos del valor del localstorage
        minuteFinal = new Date(Number(localStorage.getItem("record"))).getMinutes();//obtener minutos del valor del localstorage
        timeRecord.innerHTML = minuteFinal+" min "+secondFinal+" segundos";
    }
    else{ //sustituir el record del jugador
        if(timeFinal < localStorage.getItem("record")){
            localStorage.removeItem("record");
            localStorage.setItem("record",timeFinal);//guardar el record
            secondFinal = new Date(Number(localStorage.getItem("record"))).getSeconds();
            minuteFinal = new Date(Number(localStorage.getItem("record"))).getMinutes();
            timeRecord.innerHTML = minuteFinal+" min "+secondFinal+" segundos";
            if(window.innerWidth<600){
                game.font="10px Verdana";
                game.fillText("Superaste tu récord!!!: " + minuteFinal + " min "+ secondFinal + " segundos",canvasSize/2,canvasSize-canvasSize/9);
            }
            else{
                game.font="25px Verdana";
                game.fillText("Superaste tu récord!!!: " + minuteFinal + " min "+ secondFinal + " segundos",canvasSize/2,canvasSize-canvasSize/9);
            }
        }
        else{
            localStorage.getItem("record");
            secondFinal = new Date(Number(localStorage.getItem("record"))).getSeconds();
            minuteFinal = new Date(Number(localStorage.getItem("record"))).getMinutes();
            if(window.innerWidth<1000){
                game.font="10px Verdana";
                game.fillText("No superaste tu récord de: " + minuteFinal + " min "+ secondFinal + " segundos",canvasSize/2,canvasSize-canvasSize/9);
            }
            else{
                game.font="25px Verdana";
                game.fillText("No superaste tu récord de: " + minuteFinal + " min "+ secondFinal + " segundos",canvasSize/2,canvasSize-canvasSize/9);
            }
        }
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
    if(positionJugador.y > elementsSize){ //evitar que se salga del mapa
        positionJugador.y -= elementsSize;
    }
    movePlayer();
}
function teclaDown(){
    if(positionJugador.y < canvasSize){
        positionJugador.y += elementsSize;
    }
    movePlayer();
}
function teclaLeft(){
    if(positionJugador.x > elementsSize){
        positionJugador.x -= elementsSize;
    }
    movePlayer();
}
function teclaRight(){
    if(positionJugador.x < canvasSize){
        positionJugador.x += elementsSize;
    }
    movePlayer();
}
//Imprimir jugador cada vez que haya un cambio de posición
function movePlayer(){
    if(level<maps.length){
        //Eliminar posición anterior jugador por cada movimiento.
        game.clearRect(0,0,canvasSize,canvasSize);//borrar todo el contenido del canvas
        for (let i = 1; i <= 10; i++) { //volver a renderizar el mapa con la nueva posición del jugador
            for (let j = 1; j <= 10; j++) {
                game.fillText(emojis[mapRowCols[j-1][i-1]],elementsSize*i+5,elementsSize*j-15);
            }
        }
        game.fillText(emojis["PLAYER"],positionJugador.x+5,positionJugador.y-15);//imprimir al jugador

        //Comparar la colisión entre jugador y el regalo
        if((positionJugador.x).toFixed(3) == (posicionGift.x).toFixed(3) && (positionJugador.y).toFixed(3) == (posicionGift.y).toFixed(3)){
            console.log("Ganaste!!!");
            winLevel();
        }
        //Comparar la colisión con las bombas
        for (let i = 0; i < bombitas.length; i++) {
            if((positionJugador.x).toFixed(3) == (bombitas[i].positionX).toFixed(3) && (positionJugador.y).toFixed(3) == (bombitas[i].positionY).toFixed(3)){
                console.log("Boom!!! REVENTASTE");
                game.clearRect(bombitas[i].positionX-elementsSize,bombitas[i].positionY-elementsSize,elementsSize,elementsSize);//borrar en donde hubo colision
                game.fillText(emojis["BOMB_COLLISION"],bombitas[i].positionX,bombitas[i].positionY);//insertar emoji colision
                setTimeout(failed,1000);
            }
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
    lives.innerHTML="";
    if(vidas==0){
        game.clearRect(0,0,canvasSize,canvasSize); //borrar el contenido del mapa
        letterSizeContinue();
        btnDirections.classList.add("hidden");
        btnSelection.classList.remove("hidden");
        btnYes.addEventListener("click",()=>{
            vidas = 3;//reiniciar vidas
            bombitas = []; //limpiar array al renderizar nuevamente el mapa
            starGame();
            btnSelection.classList.add("hidden");
            btnDirections.classList.remove("hidden");
        })
        btnNo.addEventListener("click",()=>{
            level = 0;//volver al nivel 1
            vidas = 3;//reiniciar vidas
            bombitas = []; //limpiar array al renderizar nuevamente el mapa
            timeStart = undefined; //reinicia el tiempo almacenado a 0
            //starGame();
            window.location.href="index.html";
        })
    }
    else{
        bombitas = []; //limpiar array al renderizar nuevamente el mapa
        starGame();
    }
}
//Tamaño de vista de QUIERES CONTINUAR
function letterSizeContinue(){
    if(window.innerWidth<600){
        game.font="25px Verdana";
        game.textAlign = "center";
        game.fillText("Perdiste tus vidas",canvasSize/2,canvasSize/9);
        game.font="45px Verdana";
        game.fillText("😪",canvasSize/2,canvasSize/3);
        game.font="25px Verdana";
        game.fillText("¿Deseas continuar?",canvasSize/2,canvasSize-canvasSize/3);
    }
    else{
        game.font="45px Verdana";
        game.textAlign = "center";
        game.fillText("Perdiste tus vidas",canvasSize/2,canvasSize/9);
        game.font="85px Verdana";
        game.fillText("😪",canvasSize/2,canvasSize/3);
        game.font="45px Verdana";
        game.fillText("¿Deseas continuar?",canvasSize/2,canvasSize-canvasSize/3);
    }
}

//Imprimir el tiempo transcurrido
function showTime(){
    timePlayer =  Date.now() - timeStart; //resta el tiempo que avanza sin parar menos el almacenado cuando se inicio el juego
    let formatDate = new Date(timePlayer);
    let seconds = formatDate.getSeconds();
    let minutes = formatDate.getMinutes();
    timePlay.innerHTML = minutes + " min " + seconds + " segundos";
}

