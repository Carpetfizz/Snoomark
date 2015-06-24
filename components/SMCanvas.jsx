var React = require('react');

var SMCanvas = React.createClass({
	/* c, ctx for display. c,ctxr renders in the background. mWidth, mHeight are the dimensions of mainImage */
	getInitialState: function(){
		return {
			c: {},
			ctx: {},
			cr: {},
			ctxr: {},
			isSaving: false,
		}
	},
	componentDidMount: function(){
		this.initializeCanvas();
	},
	initializeCanvas: function(){
		var nextC, nextCtx, nextCr, nextCtxr, mainImage, nextImage;
		nextC = React.findDOMNode(this.refs.canvas);
		nextCtx = nextC.getContext("2d");
		nextCr = document.createElement("canvas");
		nextCtxr = nextCr.getContext("2d");
		nextC.height = 0;
		nextC.width = 0;

		mainImage = new Image();
		mainImage.crossOrigin = "Anonymous";
		mainImage.src=this.props.mainImageURL;

		mainImage.onload = function(){
			URL.revokeObjectURL(this.src);
			mWidth = mainImage.width;
			mHeight = mainImage.height;
			nextCr.width = mWidth;
			nextCr.height = mHeight;
			nextCtxr.drawImage(mainImage,0,0,mWidth,mHeight);
			var newDimensions = this.getCanvasDimensions(mWidth, mHeight);
			nextC.width = newDimensions[0];
			nextC.height = newDimensions[1];
			this.setState({c:nextC, ctx:nextCtx, cr:nextCr, ctxr:nextCtxr});
			this.placeSnoomark(mWidth, mHeight);

		}.bind(this);
	},
	placeSnoomark: function(mWidth, mHeight){
		var ctxr, waterImage, defaultScale, opacity, wHeight, wWidth,xPos,yPos,text,fontSize,textWidth,textHeight;

		ctxr = this.state.ctxr;
		defaultScale = 0.1;
		defaultTextScale = 0.25;
		opacity = 0.65;
		text="/u/username";
		waterImage = new Image();
		waterImage.crossOrigin = "Anonymous";
		waterImage.src="http://i.imgur.com/kFdCGh5.png";

		waterImage.onload = function(){
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
			this.updateCanvas();
			this.props.onInit();
		}.bind(this);
	},
	updateCanvas: function(){
		this.state.ctx.drawImage(this.state.cr,0,0,this.state.c.width,this.state.c.height);
	},
	saveImage: function(){
		this.setState({isSaving: true});
		var finalImage = new Image();
		finalImage.src = this.state.cr.toDataURL(this.props.mainImageType);
		this.props.handleSaveImage(finalImage);
		this.setState({isSaving: false});
	},
	getCanvasDimensions: function(mWidth, mHeight){
		var cWidth, cHeight;
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
  		return [cWidth, cHeight];

	},
	render: function(){
		return (
			<div>
				<canvas ref="canvas" id="smcanvas"></canvas>
			</div>
		);
	}
});

module.exports = SMCanvas;