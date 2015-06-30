/*
  2015 - Ajay Ramesh
  REDDIT and the ALIEN Logo are registered trademarks of reddit inc.
  
  Snoomark overlays a reddit alient "Snoo" watermark on top of an image. This is an attempt to protect original content from being stolen by other websites.
*/

var React, SMCanvas, SMFileLoader, SMOptions, download;
React = require('react');
SMCanvas = require('../components/SMCanvas.jsx');
SMFileLoader = require('../components/SMFileLoader.jsx');
SMOptions = require('../components/SMOptions.jsx');
download = require('../lib/download.min.js');
//make sure React is global so that react-dev-tools catches it
window.React = React;

var SM = React.createClass({
	getInitialState: function(){
		return {
			canvasReady: false,
			mainImage:{
				url: "",
				name: "",
				type: ""
			},
			options: {
				watermark: "http://i.imgur.com/yN5BhF0.png",
				text: "/u/carpetfizz",
				opacity: 0.65,
				/* 0: top right, 1: bottom right, 2: bottom left, 3: top left, 4: full */ 
				position: 1
			}
		}
	},
	setMainImage: function(url,name,type){
		var nextMainImage = this.state.mainImage;
		nextMainImage.url = url;
		nextMainImage.name = name;
		nextMainImage.type = type;
		this.setState({mainImage:nextMainImage});
		console.log(this.state.mainImage);
	},
	setOptions: function(nextOptions){
		this.setState({options: nextOptions});
	},
	canvasOnInit: function(){
		this.setState({canvasReady: true});
	},
	handleDownloadClick: function(){
		if(this.state.canvasReady){
			this.refs.smcanvas.saveImage();
		}
	},
	handleDownloadImage:function(image){
		download(this.dataURItoBlob(image.src),this.state.mainImage.name,this.state.type);
	},
	handleClear: function(){
		this.setState({mainImage: {}});
	},
	dataURItoBlob: function(uri){
		/*http://stackoverflow.com/a/15754051/896112*/
		var byteString, ab, ia;
		byteString = atob(uri.split(',')[1]);
    	ab = new ArrayBuffer(byteString.length);
    	ia = new Uint8Array(ab);
	    for (var i = 0; i < byteString.length; i++) {
	        ia[i] = byteString.charCodeAt(i);
	    }
    	return new Blob([ab], { type: this.state.type });
	},
	render: function(){
		var content = <SMFileLoader setMainImage={this.setMainImage}/>
		if(this.state.mainImage.url){
			content = (
				<div>
					<button onClick={this.handleDownloadClick}>Click to download full resolution</button>
					<button onClick={this.handleClear}>Snoomark another image</button>
					<SMOptions setOptions={this.setOptions} />
					<SMCanvas ref="smcanvas" onInit={this.canvasOnInit} handleSaveImage={this.handleDownloadImage} mainImageURL={this.state.mainImage.url} mainImageType={this.state.mainImage.type} options={this.state.options}/>
				</div>
			)
		} 
		return (
			<div>
				<h1>Snoomark</h1>
				<p>Drag and drop, enter a URL, or choose your image file to Snoomark. Click Download Full Resolution to download your image in its original size</p>
				{content}
			</div>
		);
	}
});

React.render(<SM/>, document.getElementById("snoomark"));
