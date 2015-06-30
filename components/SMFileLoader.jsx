var React = require('react');

var SMFileLoader = React.createClass({
	getInitialState: function(){
		return {
			errorMessage: "Unsupported file type. Only jpg, jpeg, and png supported"
		}
	},
	onFileChange: function(e){
		this.props.handleFiles(e.target.files);
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
					<input type="text" placeholder="URL" onChange={this.onTextChange}></input>
					<input type="file" onChange={this.onFileChange}></input><br></br>
				</form>
			</div>
		);
	}
});

module.exports = SMFileLoader;