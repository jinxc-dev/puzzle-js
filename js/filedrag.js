
(function() {


    // getElementById
    function $id(id) {
        return document.getElementById(id);
    }

    // output information
    function Output(msg) {
        var m = $id("messages");
        m.innerHTML = msg + m.innerHTML;
    }
    // file drag hover
    function FileDragHover(e) {
        e.stopPropagation();
        e.preventDefault();
        if (e.target.id == "filedrag") {
            e.target.className = (e.type == "dragover" ? "hover" : "");
        }else{
            e.target.parentElement.className = (e.type == "dragover" ? "hover" : "");
        }
    }

     function el(id){return document.getElementById(id);} // Get elem by ID

    var canvas  = el("canvas");
    var context = canvas.getContext("2d");
    var canvas2  = el("canvaspuzzle");
    var context2 = canvas2.getContext("2d");


    function readImage() {
        if (_isStarted){
          e.preventDefault();
          return;
        }else{
          if ( this.files && this.files[0] ) {
            var FR= new FileReader();
            FR.onload = function(e) {
               var img = new Image();
               img.addEventListener("load", function() {
                 context.drawImage(img, 0, 0, canvas.width, canvas.height); 
               });
               img.src = e.target.result;
               img.width = 360;
               img.height = 240;

               setImgFile(e.target.result);
            };       
            FR.readAsDataURL( this.files[0] );
          }  
        }
    }

    el("fileUpload").addEventListener("change", readImage, false);

    // file selection
    function FileSelectHandler(e) {
        if (_isStarted){
          e.preventDefault();
          return;
        }else{
            // cancel event and hover styling
          FileDragHover(e);
          // fetch FileList object
          var files = e.target.files || e.dataTransfer.files;

          var FR= new FileReader();
          FR.onload = function(e) {
             var img = new Image();
             img.addEventListener("load", function() {
               context.drawImage(img, 0, 0, canvas.width, canvas.height); 
             });
             img.src = e.target.result;

             img.width = 360;
             img.height = 240;

             setImgFile(e.target.result);console.log(e.target);
          };       
          FR.readAsDataURL(files[0] );  
        }

    }
    
    // initialize
    function Init() {

        var fileselect = $id("fileselect"),
            filedrag = $id("filedrag"),
            left_canvas = $id("canvas"),
            submitbutton = $id("submitbutton");

        // file select
        fileselect.addEventListener("change", FileSelectHandler, false);


        // is XHR2 available?
        var xhr = new XMLHttpRequest();
        if (xhr.upload) {

            // file drop
            left_canvas.addEventListener("dragover", FileDragHover, false);
            left_canvas.addEventListener("dragleave", FileDragHover, false);
            filedrag.addEventListener("mouseleave", FileDragHover, false);
            filedrag.addEventListener("dragover", FileDragHover, false);
            filedrag.addEventListener("dragleave", FileDragHover, false);
            filedrag.addEventListener("drop", FileSelectHandler, false);
            fileselect.addEventListener("change", readImage, false);
            filedrag.style.display = "block";

            // remove submit button
            //submitbutton.style.display = "none";
        }

    }

    // call initialization file
    if (window.File && window.FileList && window.FileReader) {
        Init();
    }

})();