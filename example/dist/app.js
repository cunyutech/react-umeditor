require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Editor = require('react-umeditor');

// other form control
var FormPanel = React.createClass({
	displayName: 'FormPanel',

	getInitialState: function getInitialState() {
		return {
			value: this.props.value
		};
	},
	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		if (this.props.value != nextProps.value) {
			this.setState({
				value: nextProps.value
			});
		}
	},
	getValue: function getValue() {
		return this.state.value;
	},
	handleChange: function handleChange(e) {
		e = e || event;
		var target = e.target || e.srcElement;
		this.setState({
			value: target.value
		});
	},
	render: function render() {
		var value = this.state.value;
		return React.createElement('input', { type: 'text', value: value, onChange: this.handleChange, style: { "marginBottom": "10px" } });
	}
});

var App = React.createClass({
	displayName: 'App',

	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement(FormPanel, { value: '123' }),
			React.createElement(Editor, null)
		);
	}
});

ReactDOM.render(React.createElement(App, null), document.getElementById('react-container'));


},{"react":undefined,"react-dom":undefined,"react-umeditor":undefined}]},{},[1]);
