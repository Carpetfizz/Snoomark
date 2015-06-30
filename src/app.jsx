/*
  2015 - Ajay Ramesh
  REDDIT and the ALIEN Logo are registered trademarks of reddit inc.
  
  Snoomark overlays a reddit alient "Snoo" watermark on top of an image. This is an attempt to protect original content from being stolen by other websites.
*/

var React, SMCanvas, SMFileLoader, SMOptions, SMDropper, download;
React = require('react');
SMCanvas = require('../components/SMCanvas.jsx');
SMFileLoader = require('../components/SMFileLoader.jsx');
SMOptions = require('../components/SMOptions.jsx');
SMDropper = require('../components/SMDropper.jsx');
download = require('../lib/download.min.js');
//make sure React is global so that react-dev-tools catches it
window.React = React;

var SM = React.createClass({
	getInitialState: function(){
		return {
			mainImage:{
				url: "",
				name: "",
				type: ""
			},
			options: {},
			showCanvas: false
		}
	},
	handleFiles: function(fileList){
		console.log(fileList);
		if(fileList.length > 0){
			var file = fileList[0];
			/* TEST TIFF */
			var filePattern = /(image)\/(jpg|jpeg|png)$/i;
			if(filePattern.test(file.type)){
				/*http://stackoverflow.com/a/6776055/896112*/
				var url = URL.createObjectURL(file);
				this.setMainImage(url,file.name,file.type);
			}else{
				console.error(this.state.errorMessage);
			}
		}else{
			console.warn("Try inserting the URL or Choose File");
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
	handleDownloadClick: function(){
		this.refs.smcanvas.saveImage();
	},
	handleDownloadImage:function(image){
		download(this.dataURItoBlob(image.src),this.state.mainImage.name,this.state.type);
	},
	handleShowCanvas: function(bool){
		this.setState({showCanvas: bool});
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
		var options;
		if(this.state.mainImage.url){
			options = (
				<div className="card-action">
					<SMOptions setOptions={this.setOptions} />
					<button className="waves-effect waves-light btn" onClick={this.handleShowCanvas.bind(this, true)}>Generate Snoomark</button>
				</div>
			)
		}
		var cardImageClass = "hidden";
		var content = (
			<div className="card large">
				<div className="card-content">
					Drag and drop, enter a URL, or select an image to Snoomark.
					<SMFileLoader setMainImage={this.setMainImage} handleFiles={this.handleFiles}/>
				</div>
				<p className="drop-message">Drop image here</p>
				<SMDropper ref="smdropper" mainImageURL={this.state.mainImage.url?this.state.mainImage.url:""} handleFiles={this.handleFiles} />
				{options}
			</div>
		)

		if(this.state.showCanvas && this.state.mainImage.url){
			content = (
				<div>
					<button className="waves-effect waves-light btn" onClick={this.handleDownloadClick}>Download full resolution</button>
					<button className="waves-effect waves-light btn red-btn" onClick={this.handleShowCanvas.bind(this, false)}>Snoomark another image</button>
					<SMCanvas ref="smcanvas" handleSaveImage={this.handleDownloadImage} mainImageURL={this.state.mainImage.url} mainImageType={this.state.mainImage.type} options={this.state.options}/>
				</div>
			)
		} 
		return (
			<div className="container">
				<h1>Snoomark</h1>
				{content}
			</div>
		);
	}
});

React.render(<SM/>, document.getElementById("snoomark"));
