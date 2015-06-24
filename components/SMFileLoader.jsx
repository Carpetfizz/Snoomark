var React = require('react');
var SMDropper = require('../components/SMDropper.jsx');

var SMFileLoader = React.createClass({
	getInitialState: function(){
		return {
			errorMessage: "Unsupported file type. Only jpg, jpeg, and png supported"
		}
	},
	onFileChange: function(e){
		this.handleFiles(e.target.files);
	},
	onTextChange: function(e){
		var inputUrl = e.target.value;
		var nextImage = this.getImageMetaData(inputUrl);
		if(nextImage){
			this.props.setMainImage(nextImage.url,nextImage.name,nextImage.type);
		}else{
			console.error(this.state.errorMessage);
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
				this.props.setMainImage(url,file.name,file.type);
			}else{
				console.error(this.state.errorMessage);
			}
		}else{
			console.warn("Try inserting the URL or Choose File");
		}
	},
	getImageMetaData: function(url){
		var urlPattern, image, name, type;
		urlPattern = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png))/i;
		image = {};
		if(urlPattern.test(url)){
			image.url = url;
			name = url.substring(url.lastIndexOf('/')+1);
			image.name = url.substring(url.lastIndexOf('/')+1);
			type = "image/"+url.substring(url.lastIndexOf('.')+1);
			image.type = type;
			return image;
		}else{
			return null;
		}
	},
	render: function(){
		return (
			<div>
				<form>
					<b><span className="drop-message">Drop your image anywhere on the page</span></b><br></br>
					<input type="file" onChange={this.onFileChange}></input><br></br>
					<input type="text" placeholder="URL" onChange={this.onTextChange}></input>
					<SMDropper handleFiles={this.handleFiles}/>
				</form>
			</div>
		);
	}
});

module.exports = SMFileLoader;