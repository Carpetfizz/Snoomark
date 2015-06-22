/*
  ctx: canvas shown to the user, scaled down
  ctxr: canvas real, the full size
*/

var c,ctx,cr,ctxr,mWidth,mHeight;

c = document.getElementById("canvas");
cr = document.getElementById("canvas-real");
ctx = c.getContext("2d");
ctxr = cr.getContext("2d");
c.height = 0;
c.width = 0;

var mainImage = new Image();
var waterImage = new Image();

mainImage.crossOrigin="Anonymous";
mainImage.src="http://i.imgur.com/Ett5UYN.jpg";

mainImage.onload = function(){
  mWidth = mainImage.width;
  mHeight = mainImage.height;
  cr.width = mWidth;
  cr.height = mHeight;
  ctxr.drawImage(mainImage,0,0,mWidth,mHeight);
  resizeCanvas();
  waterImage.crossOrigin="Anonymous";
  waterImage.src="http://i.imgur.com/kFdCGh5.png";
  waterImage.onload = function(){
    placeSnoomark();
  }
}

function placeSnoomark(){
  var defaultScale,opacity,wHeight,wWidth,text,fontSize,xPos,yPos,textWidth,textHeight;
  
  defaultScale = 0.1;
  defaultTextScale = 0.25;
  opacity = 0.65;
  text="/u/carpetfizz";
  
  wHeight = mHeight * defaultScale;
  wWidth = (wHeight*waterImage.width)/waterImage.height;
  fontSize = wHeight * defaultTextScale;
  xPos = mWidth - wWidth - 20;
  yPos = mHeight - wHeight - (fontSize + 15);
  
  ctxr.fillStyle = "white";
  ctxr.font = fontSize+"px Verdana";
  textWidth = ctxr.measureText(text).width;
  textHeight = ctxr.measureText(text).height;
  ctxr.fillText(text,mWidth-textWidth-20, mHeight-15);
  
  ctxr.save();
  ctxr.globalAlpha = opacity;
  ctxr.drawImage(waterImage,xPos,yPos,wWidth,wHeight);
  ctxr.restore();
  updateCanvas();
}

function resizeCanvas(){
  cWidth = mWidth;
  cHeight = mHeight;
  if(mHeight > window.innerHeight){
    cWidth = (window.innerHeight * mWidth)/mHeight;
    cHeight = window.innerHeight;
  }
  else if(mWidth > window.innerWidth){
    cHeight = (window.innerWidth * mHeight)/mWidth;
    cWidth = window.innerWidth;
  }
  c.width = cWidth;
  c.height = cHeight;
}

function updateCanvas(){
  ctx.drawImage(cr,0,0,cWidth,cHeight);
}

function saveImage(){
  var finalImage = new Image();
  finalImage.src = cr.toDataURL("image/png");
  document.body.appendChild(finalImage);
}