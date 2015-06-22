/*
  2015 - Ajay Ramesh
  REDDIT and the ALIEN Logo are registered trademarks of reddit inc.
  
  Snoomark overlays a reddit alient "Snoo" watermark on top of an image. This is an attempt to protect original content from being stolen by other websites.
*/

var c,ctx,cr,ctxr,mWidth,mHeight;

/*
  Two canvases are being used to deal with images that are larger than the window. One canvas "c" is scaled for display, the other "cr" is the full size image
*/
c = document.getElementById("canvas");
cr = document.getElementById("canvas-real");
ctx = c.getContext("2d");
ctxr = cr.getContext("2d");
c.height = 0;
c.width = 0;

/*
  mainImage is the background. waterImage is the watermark, foreground
*/
var mainImage = new Image();
var waterImage = new Image();

mainImage.crossOrigin="Anonymous";
mainImage.src="http://i.imgur.com/XbhuC9S.jpg";

mainImage.onload = function(){
  
  mWidth = mainImage.width;
  mHeight = mainImage.height;
  /* The full size image is drawn onto the "cr" but the user doesn't see it */
  cr.width = mWidth;
  cr.height = mHeight;
  ctxr.drawImage(mainImage,0,0,mWidth,mHeight);
  /* The canvas shown to the user, "c" can now resize itself */
  resizeCanvas();
  waterImage.crossOrigin="Anonymous";
  waterImage.src="http://i.imgur.com/kFdCGh5.png";
  waterImage.onload = function(){
    /* The Snoomark can only be placed after the mainImage is loaded */
    placeSnoomark();
  }
}

function placeSnoomark(){
  var defaultScale,opacity,wHeight,wWidth,text,fontSize,xPos,yPos,textWidth,textHeight;
  
  defaultScale = 0.1;
  defaultTextScale = 0.25;
  opacity = 0.65;
  text="/u/carpetfizz";
  /* The height of every Snoomark is 10% the height of the image
     Snoomarks are currently placed at the bottom right corner
  */
  wHeight = mHeight * defaultScale;
  wWidth = (wHeight*waterImage.width)/waterImage.height;
  fontSize = wHeight * defaultTextScale;
  xPos = mWidth - wWidth - 20;
  yPos = mHeight - wHeight - (fontSize + 15);
  
  /* Calculate the text so that it does not bleed off the image*/
  ctxr.fillStyle = "white";
  ctxr.font = fontSize+"px Verdana";
  textWidth = ctxr.measureText(text).width;
  textHeight = ctxr.measureText(text).height;
  ctxr.fillText(text,mWidth-textWidth-20, mHeight-15);
  
  /* Make the watermark translucent */
  ctxr.save();
  ctxr.globalAlpha = opacity;
  ctxr.drawImage(waterImage,xPos,yPos,wWidth,wHeight);
  ctxr.restore();
  updateCanvas();
}

function resizeCanvas(){
  /*
    Calculate dimensions of the display canvas "c" to maintain aspect ratio and fit in the page
  */
  cWidth = mWidth;
  cHeight = mHeight;
  /* If image is taller than window, set the image's height to the height of the window and scale the width proportionally */
  if(mHeight > window.innerHeight){
    cWidth = (window.innerHeight * mWidth)/mHeight;
    cHeight = window.innerHeight;
  }
  /* If image is wider than window, set the image's width to the width of the window and scale the height proportionally */
  else if(mWidth > window.innerWidth){
    cHeight = (window.innerWidth * mHeight)/mWidth;
    cWidth = window.innerWidth;
  }
  c.width = cWidth;
  c.height = cHeight;
}

/*
  Update the display canvas "c" with the contents of the real canvas "cr" but with the scaled dimensions
*/
function updateCanvas(){
  ctx.drawImage(cr,0,0,cWidth,cHeight);
}

/*
  Save the real canvas "cr" to an image to maintain the original image's resolution
*/
function saveImage(){
  var finalImage = new Image();
  finalImage.src = cr.toDataURL("image/png");
  document.body.appendChild(finalImage);
}