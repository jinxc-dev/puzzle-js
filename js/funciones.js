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
var _difficult_ = 1;
var _grid_rate = 1;

var contador_d =0;
var contador_s =0;
var contador_m =0;


var _numberClicks;

function changeLevel(){
  var level = document.getElementById("nivel").value;
  if (_isStarted){
    document.getElementById("nivel").value = _difficult_;
    return; 
  }  
  
  _difficult_ = level;
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
  // if(_img) _selected_img = _img.src;
  init();
}
changeLevel();

function init(){
    _movement = 0;
    _isStarted = false;

    // var image_file;
    if(_selected_img != ""){
        disablePuzzleBtn(false);
        _img = new Image();
        _img.addEventListener('load',onImage,false);
        _img.src = _selected_img;
    }else{
        disablePuzzleBtn(true);
        setCanvasText();
    }
}

function onImage(e){
    _pieceWidth = (_img.width / PUZZLE_DIFFICULTY_WIDTH)
    _pieceHeight = (_img.height / PUZZLE_DIFFICULTY_HEIGHT)
    _puzzleWidth = _pieceWidth * PUZZLE_DIFFICULTY_WIDTH;
    _puzzleHeight = _pieceHeight * PUZZLE_DIFFICULTY_HEIGHT;
    setCanvas();
    initPuzzle();
}

function setImgFile(fileName){
    _selected_img = fileName;
    init();
    document.getElementById('help').disabled = true;
    document.getElementById('finish').disabled = true;
}
function disablePuzzleBtn(isDisable){
    document.getElementById('start').disabled = isDisable;
    document.getElementById('finish').disabled = isDisable;
    document.getElementById('help').disabled = isDisable;
}
function setCanvas(){
    _canvas = document.getElementById('canvaspuzzle');
    _stage = _canvas.getContext('2d');
    _canvas.width = _puzzleWidth;
    _canvas.height = _puzzleHeight;
    _scaleX_dif = _canvas.width/360;
    _scaleY_dif = _canvas.height/240;
    _grid_rate = Math.max(_scaleX_dif, _scaleY_dif);
    _highlight_piece = null;
    _selected_piece = null;

    _canvas.style.border = "1px solid black";
}
function setCanvasText(){
    var txtCanvas = document.getElementById('canvas');
    var context = txtCanvas.getContext('2d');
    txtCanvas.width = 360; txtCanvas.height = 240;

    context.font="20px Georgia";
    context.textAlign = "center";
    context.fillText("Click here or drag and drop to", 180,100);
    context.fillText("upload an image.", 180,130);
}
function cambiacolor(){
    if (_isStarted) updateCanvas();
    else init();
}
function initPuzzle(){
    _numberClicks = 0;
    _pieces = [];
    _mouse = {x:0,y:0};
    _currentPiece = null;
    _currentDropPiece = null;
    
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
    var min_differ = _puzzleWidth/24;
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
        _stage.lineWidth   = 1*_grid_rate;
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, xPos, yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(xPos, yPos, _pieceWidth,_pieceHeight);

        _pieces.push(piece);
        xPos += _pieceWidth;
        if(xPos >= (_puzzleWidth-min_differ)){
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
}

function shufflePuzzle(){
    var min_differ = _puzzleWidth/24;
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
        _stage.lineWidth   = 1*_grid_rate;
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, xPos, yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(xPos, yPos, _pieceWidth,_pieceHeight);
        
        xPos += _pieceWidth;
        if(xPos >= (_puzzleWidth - min_differ)){
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
                document.getElementById('congrat').style.display = 'inline';
                gameOver();
            }
            
        }
        _selected_piece = null;
        return;
    } 
   
    _selected_piece = _currentPiece;

    _stage.strokeStyle = "yellow";
    _stage.lineWidth   = 2* _grid_rate;
    _stage.strokeRect(_currentPiece.xPos,_currentPiece.yPos, _pieceWidth,_pieceHeight);
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
        _stage.lineWidth   = 2*_grid_rate;
        _stage.strokeRect(_currentPiece.xPos,_currentPiece.yPos, _pieceWidth,_pieceHeight);
    }

    if (_selected_piece) {
        _stage.strokeStyle = "yellow";
        _stage.lineWidth   = 2*_grid_rate;
        _stage.strokeRect(_selected_piece.xPos,_selected_piece.yPos, _pieceWidth,_pieceHeight);
    }
}

function updateCanvas(){
    _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    for(var i = 0; i < _pieces.length;i++){
        var one_piece = _pieces[i];
        _stage.strokeStyle = document.getElementById("colorpicker").value;
        _stage.lineWidth   = 1*_grid_rate;
        _stage.drawImage(_img, one_piece.sx, one_piece.sy, _pieceWidth, _pieceHeight, one_piece.xPos, one_piece.yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(one_piece.xPos, one_piece.yPos, _pieceWidth,_pieceHeight);
    }
}

function get_shuffle_count(){
    var count = 0;
    for (var i = 0; i < _pieces.length ; i++) {
        var one_piece = _pieces[i];
        if (one_piece.sx != one_piece.xPos || one_piece.sy != one_piece.yPos) count++;
    }
    return count;
}

function closeModal(){
    var modal = document.getElementById('myModal').style.display = "none";
    document.location.reload();
}
function gameOver(){
    if (_selected_img == "") return;
    
    _isStarted = false;
    var remain_piece = get_shuffle_count();
    var overTime = contador_m * 60 + contador_s;

    
    var modal = document.getElementById('myModal');
    var game_result = document.getElementById('result').innerText = "you have left "+ remain_piece +" pieces outside their correct place, you have made "+_movement+" movements and used "+overTime+" secs";
    modal.style.display = "block";
    
    document.getElementById("canvaspuzzle").onmousedown = null;
    document.getElementById("canvaspuzzle").onmousemove = null;
    document.getElementById("canvaspuzzle").onmouseup = null;
    initPuzzle();
    pausaCrono();

    document.getElementById('start').style.display = 'inline';
    document.getElementById('continue').style.display = 'none';
    document.getElementById('pause').style.display = 'none';
    document.getElementById('fileUpload').disabled = false;
    document.getElementById('nivel').disabled = false;
    document.getElementById('help').disabled = true;
    document.getElementById('finish').disabled = true;
    document.getElementById('colorpicker').disabled = false;
    
    document.getElementById('time').innerText = "00: 00: 00";
    document.getElementById('shuffle').innerText = "0";
    document.getElementById('clickCounter').innerText = "0";
    contador_d =0;
    contador_s =0;
    contador_m =0;
    _movement = 0;


}

function startNewGame(){
    if (_selected_img == "") return;
    _isStarted = true;

    document.getElementById('start').style.display = 'none';
    document.getElementById('pause').style.display = 'inline';
    shufflePuzzle();
    carga();

    document.getElementById('clickCounter').innerText = _movement;
    document.getElementById('shuffle').innerText = get_shuffle_count();
    document.getElementById('fileUpload').disabled = true;
    document.getElementById('nivel').disabled = true;
    document.getElementById('help').disabled = false;
    document.getElementById('finish').disabled = false;
    document.getElementById('colorpicker').disabled = true;
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
    if (!_isStarted) return;
    updateCanvas();
    for (var i = 0; i < _pieces.length ; i++) {
        var one_piece = _pieces[i];
        if (one_piece.sx != one_piece.xPos || one_piece.sy != one_piece.yPos){
            _selected_piece = one_piece;

            _stage.strokeStyle = "yellow";
            _stage.lineWidth   = 3*_grid_rate;
            _stage.strokeRect(_selected_piece.xPos,_selected_piece.yPos, _pieceWidth,_pieceHeight);
        } 
    }
}

