var React = require('react');

var SMCanvas = React.createClass({
	/* c, ctx for display. c,ctxr renders in the background. mWidth, mHeight are the dimensions of mainImage */
	getInitialState: function(){
		return {
			c: {},
			ctx: {},
			cr: {},
			ctxr: {},
			mHeight: 0,
			mWidth: 0,
			isSaving: false,
		}
	},
	componentDidMount: function(){
		this.initializeCanvas();
	},
	componentWillUnmount: function(){
		if(this.state.ctxr){
			this.state.ctxr.clearRect(0,0,this.state.mWidth, this.state.mHeight);
			this.updateCanvas();
		}
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
			this.setState({c:nextC, ctx:nextCtx, cr:nextCr, ctxr:nextCtxr, mHeight: mHeight, mWidth: mWidth});
			this.placeSnoomark();
		}.bind(this);
	},
	placeSnoomark: function(){
		console.log(this.props.options);
		var ctxr, waterImage, defaultScale, opacity, wHeight, wWidth,xPos,yPos,text,fontSize,textWidth,textHeight,textX, textY, mHeight, mWidth;
		mHeight = this.state.mHeight;
		mWidth = this.state.mWidth;
		ctxr = this.state.ctxr;
		defaultScale = 0.1;
		defaultTextScale = 0.25;
		defaultPadding = 20;
		opacity = this.props.options.opacity;
		text = this.props.options.text;
		waterImage = new Image();
		waterImage.crossOrigin = "Anonymous";
		waterImage.src=this.props.options.watermark;

		waterImage.onload = function(){
			console.log("test");
			wHeight = mHeight * defaultScale;
			wWidth = (wHeight*waterImage.width)/waterImage.height;
			
			fontSize = wHeight * defaultTextScale;
			ctxr.fillStyle = "white";
			ctxr.font = fontSize+"px Verdana";
			textWidth = ctxr.measureText(text).width;
			// M's width will give an approx of line height because M is squareish
			textHeight = ctxr.measureText('M').width;
			
			switch(this.props.options.position){
				case 0:
					/* Top right */
					xPos = mWidth - wWidth - defaultPadding;
					yPos = defaultPadding;
					textX = mWidth - textWidth - defaultPadding;
					textY = yPos + wHeight + textHeight + defaultPadding;
					break;
				case 1:
					/* Bottom right */
					xPos = mWidth - wWidth - defaultPadding;
					yPos = mHeight - wHeight - (textHeight+defaultPadding);
					textX = mWidth - textWidth - defaultPadding;
					textY = yPos + wHeight + textHeight;
					break;
				case 2:
					/* Bottom left */
					xPos = defaultPadding;
					yPos = mHeight - wHeight - (textHeight+defaultPadding);
					textX = defaultPadding;
					textY = yPos + wHeight + textHeight;
					break;
				case 3:
					/* Top left */
					xPos = defaultPadding;
					yPos = defaultPadding;
					textX = defaultPadding;
					textY = yPos + wHeight + textHeight + defaultPadding;
					break;
				case 4:
					/* Full cover */
					opacity = 0.2;
					wHeight = mHeight * 0.95;
					wWidth = (wHeight*waterImage.width)/waterImage.height;
					xPos = (mWidth - wWidth)/2;
					yPos = (mHeight - wHeight)/2 - (textHeight+defaultPadding);
					textX = (mWidth - textWidth)/2;
					textY = yPos + wHeight + textHeight;
					break;
			}

			ctxr.fillText(text, textX, textY);

			ctxr.save();
			ctxr.globalAlpha = opacity;
			ctxr.drawImage(waterImage,xPos,yPos,wWidth,wHeight);
			ctxr.restore();
			this.updateCanvas();
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