var PUZZLE_DIFFICULTY_HEIGHT ;
var PUZZLE_DIFFICULTY_WIDTH ;
const PUZZLE_HOVER_TINT = '#009900';
 
var _canvas;
var _stage;
 
var _img;
var _pieces;
var _puzzleWidth;
var _puzzleHeight;
var _pieceWidth;
var _pieceHeight;
var _currentPiece;
var _currentDropPiece;

var _mouse;

var _scaleX_dif;
var _scaleY_dif;
var _highlight_piece;
var _selected_piece;
var _selected_img = "";
var _movement;
var _isStarted;

var contador_d =0;
var contador_s =0;
var contador_m =0;


var _numberClicks;

function changeLevel(){
  if (_isStarted) return;  
    
  var level = document.getElementById("nivel").value;
  
  if(level == "1"){
        PUZZLE_DIFFICULTY_HEIGHT    = 4;
        PUZZLE_DIFFICULTY_WIDTH     = 6;
  }else if (level == "2") {
        PUZZLE_DIFFICULTY_HEIGHT    = 6;
        PUZZLE_DIFFICULTY_WIDTH     = 9;
    
  }else{
        PUZZLE_DIFFICULTY_HEIGHT    = 8;
        PUZZLE_DIFFICULTY_WIDTH     = 12;
  }
  _selected_img = _img.src;
  init();
  // document.getElementById("clickCounter").innerHTML=("Clicks: "+_numberClicks + " " + PUZZLE_DIFFICULTY_WIDTH);
}

changeLevel();

function init(){
    _movement = 0;
    _isStarted = false;

    var image_file;
    if(_selected_img != "") image_file = _selected_img;//        img= "img/m01.png";
    else image_file = "puzzle.jpg";  

    _img = new Image();
    _img.addEventListener('load',onImage,false);
    _img.src = image_file;
    
    var img = new Image();
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    canvas.width = 360;
    canvas.height = 240;
    img.addEventListener('load', function() {
       context.drawImage(img, 0, 0, canvas.width, canvas.height); 
    });
    
    img.src = image_file;
}

function onImage(e){
    _pieceWidth = (_img.width / PUZZLE_DIFFICULTY_WIDTH)
    _pieceHeight = (_img.height / PUZZLE_DIFFICULTY_HEIGHT)
    _puzzleWidth = _pieceWidth * PUZZLE_DIFFICULTY_WIDTH;
    _puzzleHeight = _pieceHeight * PUZZLE_DIFFICULTY_HEIGHT;
    setCanvas();
    initPuzzle();
}

function setCanvas(){
    _canvas = document.getElementById('canvaspuzzle');
    _stage = _canvas.getContext('2d');
    _canvas.width = _puzzleWidth;
    _canvas.height = _puzzleHeight;
    _scaleX_dif = _canvas.width/360;
    _scaleY_dif = _canvas.height/240;
    _highlight_piece = null;
    _selected_piece = null;

    _canvas.style.border = "1px solid black";
}

function initPuzzle(){
    _numberClicks = 0;
    //document.getElementById("clickCounter").innerHTML=("Clicks: "+_numberClicks + " " + PUZZLE_DIFFICULTY_WIDTH);
    _pieces = [];
    _mouse = {x:0,y:0};
    _currentPiece = null;
    _currentDropPiece = null;
    // _stage.drawImage(_img, 0, 0, _puzzleWidth, _puzzleHeight, 0, 0, _puzzleWidth, _puzzleHeight);
    createTitle("Empezar");
    buildPieces();
}

function createTitle(msg){
    _stage.fillStyle = "#000000";
    _stage.globalAlpha = .4;
    _stage.fillRect(100,_puzzleHeight - 40,_puzzleWidth - 200,40);
    _stage.fillStyle = "#FFFFFF";
    _stage.globalAlpha = 1;
    _stage.textAlign = "center";
    _stage.textBaseline = "middle";
    _stage.font = "20px Arial";
    _stage.fillText(msg,_puzzleWidth / 2,_puzzleHeight - 20);
}

function buildPieces(){
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(i = 0;i < PUZZLE_DIFFICULTY_WIDTH * PUZZLE_DIFFICULTY_HEIGHT;i++){
        piece = {};
        piece.sx = xPos;
        piece.sy = yPos;
        piece.num = i;

        _stage.strokeStyle = document.getElementById("colorpicker").value;
        _stage.lineWidth   = 1;
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, xPos, yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(xPos, yPos, _pieceWidth,_pieceHeight);

        _pieces.push(piece);
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
    // document.getElementById("canvaspuzzle").onmousedown = shufflePuzzle;
}

function shufflePuzzle(){
    _pieces = shuffleArray(_pieces);
    _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        piece.xPos = xPos;
        piece.yPos = yPos;
        _stage.strokeStyle = document.getElementById("colorpicker").value;
        _stage.lineWidth   = 1;
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, xPos, yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(xPos, yPos, _pieceWidth,_pieceHeight);
        
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
    document.getElementById('shuffle').innerText = get_shuffle_count();
    document.getElementById("canvaspuzzle").onmousemove = onPuzzleMove;
    document.getElementById("canvaspuzzle").onmousedown = onPuzzleClick;
}

function shuffleArray(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);

    return o;
}

function onPuzzleClick(e){
    if(e.layerX){
        _mouse.x = e.layerX;
        _mouse.y = e.layerY;
    }else if(e.offsetX){
        _mouse.x = e.offsetX;
        _mouse.y = e.offsetY;
    }
    _currentPiece = checkPieceClicked();
    if (!_currentPiece) return;
    
    updateCanvas();
    
    if(_selected_piece){
        if (_selected_piece.num != _currentPiece.num){
            var sel_num = 0; 
            var cur_num = 0;
            for (var i = 0; i < _pieces.length; i++) {
                if (_pieces[i]['num'] == _selected_piece.num) sel_num = i;
                if (_pieces[i]['num'] == _currentPiece.num) cur_num = i;
            }
            var tmp_x = _pieces[sel_num].xPos;
            var tmp_y = _pieces[sel_num].yPos;
            _pieces[sel_num].xPos = _pieces[cur_num].xPos;
            _pieces[sel_num].yPos = _pieces[cur_num].yPos;
            _pieces[cur_num].xPos = tmp_x;
            _pieces[cur_num].yPos = tmp_y;

            updateCanvas();

            _movement++;
            document.getElementById('clickCounter').innerText = _movement;

            var shuffled_count = get_shuffle_count();
            document.getElementById('shuffle').innerText = shuffled_count;
            
            if (shuffled_count == 0) {
                alert("Game Sucess");
                gameOver();
            }
            
        }
        _selected_piece = null;
        return;
    } 
   
    _selected_piece = _currentPiece;

    _stage.strokeStyle = "yellow";
    _stage.lineWidth   = 3;
    _stage.strokeRect(_currentPiece.xPos,_currentPiece.yPos, _pieceWidth,_pieceHeight);


    // // document.getElementById("canvaspuzzle").onmousemove = updatePuzzle;
    // document.getElementById("canvaspuzzle").onmouseup = pieceDropped;
}

function checkPieceClicked(){
    var i;
    var piece;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];

        var macth_mouse_x = _mouse.x *_scaleX_dif;
        var macth_mouse_y = _mouse.y *_scaleY_dif;

        if(macth_mouse_x > piece.xPos && macth_mouse_x < (piece.xPos + _pieceWidth) && macth_mouse_y > piece.yPos && macth_mouse_y < (piece.yPos + _pieceHeight)){
            return piece;
        }        
    }
    return null;
}

function onPuzzleMove(e){
    if(e.layerX){
        _mouse.x = e.layerX;
        _mouse.y = e.layerY;
    }else if(e.offsetX){
        _mouse.x = e.offsetX;
        _mouse.y = e.offsetY;
    }
    _currentPiece = checkPieceClicked();

    if(_currentPiece != null){
        if(_highlight_piece){
            updateCanvas();
        }
        _highlight_piece = _currentPiece;

        _stage.strokeStyle = "yellow";
        _stage.lineWidth   = 3;
        _stage.strokeRect(_currentPiece.xPos,_currentPiece.yPos, _pieceWidth,_pieceHeight);
    }

    if (_selected_piece) {
        _stage.strokeStyle = "yellow";
        _stage.lineWidth   = 3;
        _stage.strokeRect(_selected_piece.xPos,_selected_piece.yPos, _pieceWidth,_pieceHeight);
    }
}

function updateCanvas(){
    _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    for(var i = 0; i < _pieces.length;i++){
        var one_piece = _pieces[i];
        _stage.strokeStyle = document.getElementById("colorpicker").value;
        _stage.lineWidth   = 2;
        _stage.drawImage(_img, one_piece.sx, one_piece.sy, _pieceWidth, _pieceHeight, one_piece.xPos, one_piece.yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(one_piece.xPos, one_piece.yPos, _pieceWidth,_pieceHeight);
    }
}

// function updatePuzzle(e){
//     _currentDropPiece = null;
//     if(e.layerX || e.layerX == 0){
//         _mouse.x = e.layerX - _canvas.offsetLeft;
//         _mouse.y = e.layerY - _canvas.offsetTop;
//     }
//     else if(e.offsetX || e.offsetX == 0){
//         _mouse.x = e.offsetX - _canvas.offsetLeft;
//         _mouse.y = e.offsetY - _canvas.offsetTop;
//     }
//     _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
//     var i;
//     var piece;
//     for(i = 0;i < _pieces.length;i++){
//         piece = _pieces[i];
//         if(piece == _currentPiece){
//             continue;
//         }
//         _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
//         _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
//         if(_currentDropPiece == null){
//             if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)){
//                 //NOT OVER
//             }
//             else{
//                 _currentDropPiece = piece;
//                 _stage.save();
//                 _stage.globalAlpha = .4;
//                 _stage.fillStyle = PUZZLE_HOVER_TINT;
//                 _stage.fillRect(_currentDropPiece.xPos,_currentDropPiece.yPos,_pieceWidth, _pieceHeight);
//                 _stage.restore();
//             }
//         }
//     }
//     _stage.save();
//     _stage.globalAlpha = .6;
//     _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
//     _stage.restore();
//     _stage.strokeRect( _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth,_pieceHeight);
// }

// function pieceDropped(e){
//     document.getElementById("canvaspuzzle").onmousemove = null;
//     document.getElementById("canvaspuzzle").onmouseup = null;
//     if(_currentDropPiece != null){
//         var tmp = {xPos:_currentPiece.xPos,yPos:_currentPiece.yPos};
//         _currentPiece.xPos = _currentDropPiece.xPos;
//         _currentPiece.yPos = _currentDropPiece.yPos;
//         _currentDropPiece.xPos = tmp.xPos;
//         _currentDropPiece.yPos = tmp.yPos;
//     }
//     _numberClicks++;
//     document.getElementById("clickCounter").innerHTML=("Clicks: "+_numberClicks);
//     resetPuzzleAndCheckWin();
// }

function get_shuffle_count(){
    var count = 0;
    for (var i = 0; i < _pieces.length ; i++) {
        var one_piece = _pieces[i];
        //alert( one_piece.sx +"//"+one_piece.xPos+"//"+one_piece.sy+"//"+one_piece.yPos);
        if (one_piece.sx != one_piece.xPos || one_piece.sy != one_piece.yPos) count++;
    }
    return count;
}
// function resetPuzzleAndCheckWin(){
//     _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
//     var gameWin = true;
//     var i;
//     var piece;
//     for(i = 0;i < _pieces.length;i++){
//         piece = _pieces[i];
//         _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
//         _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
//         if(piece.xPos != piece.sx || piece.yPos != piece.sy){
//             gameWin = false;
//         }
//     }
//     if(gameWin){
//         setTimeout(gameOver,500);
//     }
// }

function gameOver(){
    _movement = 0;
    _isStarted = false;
    

    document.getElementById("canvaspuzzle").onmousedown = null;
    document.getElementById("canvaspuzzle").onmousemove = null;
    document.getElementById("canvaspuzzle").onmouseup = null;
    initPuzzle();
    pausaCrono();

    document.getElementById('start').style.display = 'inline';
    document.getElementById('continue').style.display = 'none';
    document.getElementById('pause').style.display = 'none';
    
    contador_d =0;
    contador_s =0;
    contador_m =0;
}

function startNewGame(){
    _isStarted = true;

    document.getElementById('start').style.display = 'none';
    document.getElementById('pause').style.display = 'inline';
    shufflePuzzle();
    carga();

    document.getElementById('clickCounter').innerText = _movement;
    document.getElementById('shuffle').innerText = get_shuffle_count();
}

var cronometro;

function pausaCrono(){
    document.getElementById('continue').style.display = 'inline';
    document.getElementById('pause').style.display = 'none';
    clearInterval(cronometro);
}
function continueGame(){
    document.getElementById('continue').style.display = 'none';
    document.getElementById('pause').style.display = 'inline';
    carga();
}

function carga(){

    // d = document.getElementById("decimas");
    // s = document.getElementById("segundos");
    // m = document.getElementById("minutos");

    time = document.getElementById('time');
    cronometro=setInterval(
        function(){
            if(contador_d ==100){
                contador_d=0;
                contador_s++;
                 //s.innerHTML = contador_s;
                if(contador_s==60){
                    contador_s=0;
                    contador_m++;
                 //   m.innerHTML = contador_m;

                    if(contador_m==60){
                        contador_m=0;
                    }
                }    
            }

            var label_m; var label_s; var label_d;
            if (contador_m < 10) label_m = "0" + contador_m; else  label_m = contador_m;
            if (contador_s < 10) label_s = "0" + contador_s; else  label_s = contador_s;
            if (contador_d < 10) label_d = "0" + contador_d; else  label_d = contador_d;
            time.innerHTML = label_m + " :" + label_s +" :" + label_d;
            contador_d++;

        }
        ,10);
}

let i = 0,j
function chrono(){
  if (i>=0){
    now.innerText = i++;
  }
  if(j==-1){
    now.innerText = 0;
  }
}

function hint(){

for (var i = 0; i < _pieces.length ; i++) {
    var one_piece = _pieces[i];
    if (one_piece.sx != one_piece.xPos || one_piece.sy != one_piece.yPos){
        updateCanvas();
        _selected_piece = one_piece;

        _stage.strokeStyle = "yellow";
        _stage.lineWidth   = 3;
        _stage.strokeRect(_selected_piece.xPos,_selected_piece.yPos, _pieceWidth,_pieceHeight);
    } 
}
}

