var React = require('react');

var SMDropper = React.createClass({
	componentDidMount: function(){
		var dropper = React.findDOMNode(this.refs.smdropper);
		dropper.addEventListener("dragenter", this.onDragEnter, false);
		dropper.addEventListener("dragover", this.onDragOver, false);
		dropper.addEventListener("drop", this.onDrop, false);
	},
	onDragEnter: function(e){
		e.stopPropagation();
  		e.preventDefault();
	},
	onDragOver: function(e){
		e.stopPropagation();
  		e.preventDefault();
	},
	onDrop: function(e){
		e.stopPropagation();
  		e.preventDefault();
  		this.props.handleFiles(e.dataTransfer.files);
	},
	render: function(){
		var divStyle = {
		  background: this.props.mainImageURL.length > 0?'url(' + this.props.mainImageURL + ') no-repeat':'#95a5a6',
		  width: '100%',
		  height: '100%'
		};
		return (
			<div ref="smdropper" style={divStyle} className="dropper">
			</div>
		)
	}
});

module.exports = SMDropper;