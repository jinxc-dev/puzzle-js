 function el(id){return document.getElementById(id);} // Get elem by ID

			// var canvas  = el("canvas");
			// var context = canvas.getContext("2d");

			// function readImage() {
			//     if ( this.files && this.files[0] ) {
			//         var FR= new FileReader();
			//         FR.onload = function(e) {
			//            var img = new Image();
			//            img.addEventListener("load", function() {
			//              context.drawImage(img, 0, 0, canvas.width, canvas.height);
			//            });
			//            img.src = e.target.result;
			//            img.width = 360;
			//            img.height = 240;
			//         };       
			//         FR.readAsDataURL( this.files[0] );
			//     }
			    
			// }

			// el("fileUpload").addEventListener("change", readImage, false);