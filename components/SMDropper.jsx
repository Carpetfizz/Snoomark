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
		return (
			<div ref="smdropper" className="dropbox"></div>
		)
	}
});

module.exports = SMDropper;