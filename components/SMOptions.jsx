var React = require('react');

var SMOptions = React.createClass({
	getInitialState: function(){
		return {
			options: {
				watermark: "http://i.imgur.com/yN5BhF0.png",
				text: "",
				opacity: 0.65,
				/* 0: top right, 1: bottom right, 2: bottom left, 3: top left, 4: full */ 
				position: 0
			}
		}
	},
	setOption: function(value, option){
		var nextOptions = this.state.options;
		nextOptions[option] = value;
		this.setState({options: nextOptions});
		this.props.setOptions(this.state.options);
	},
	render: function(){
		return (
			<div>
				<SMWText setOption={this.setOption}/>
				<SMWDropdown setOption={this.setOption}/>
			</div>
		)
	}
});

var SMWText = React.createClass({
	handleChange: function(e){
		this.props.setOption(e.target.value, "text");
	},
	render: function(){
		return (
			<input type="text" onChange={this.handleChange}></input>
		)
	}
});

var SMWDropdown = React.createClass({
	handleChange: function(e){
		this.props.setOption(parseInt(e.target.value), "position");
	},
	render: function(){
		return (
			<select onChange={this.handleChange}>
				<option value={0}>Top Right</option>
				<option value={1}>Bottom Right</option>
				<option value={2}>Bottom Left</option>
				<option value={3}>Top Left</option>
				<option value={4}>Fill</option>
			</select>
		)
	}
});

module.exports = SMOptions;