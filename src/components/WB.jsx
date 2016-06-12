import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import ReactCanvas from 'react-canvas'
import _ from 'underscore'
import {FONT0} from 'styles'
const Group = ReactCanvas.Group
const Image = ReactCanvas.Image
const Text = ReactCanvas.Text
const FontFace = ReactCanvas.FontFace
const measureText = ReactCanvas.measureText

const CONTENT_INSET = 14
const TEXT_SCROLL_SPEED_MULTIPLIER = 0.6
const TEXT_ALPHA_SPEED_OUT_MULTIPLIER = 1.25
const TEXT_ALPHA_SPEED_IN_MULTIPLIER = 2.6
const IMAGE_LAYER_INDEX = 2
const TEXT_LAYER_INDEX = 1
const SOURCE_REGEX = /<.*>(.*)<\/.*>/
const TITLE_REGEX = /[\u4e00-\u9fa5_@a-zA-Z0-9]+/g

const WB = React.createClass({
	propTypes: {
		width: React.PropTypes.number.isRequired,
		height: React.PropTypes.number.isRequired,
		wb: React.PropTypes.object.isRequired,
		scrollTop: React.PropTypes.number.isRequired
	},
	getInitialState: function() {
		return {
			layout: {},
		}
	},
	componentWillMount: function() {
		// Pre-compute style
		this.containerStyle = {
			top: 0,	
			left: 0,
			width: this.props.width,
			height: this.props.height,
		}
		this.imageStyle = {
			top: 0,	
			left: 0,
			width: this.props.width,
			height: this.props.height*0.46,
			backgroundColor: '#eee',
			zIndex: IMAGE_LAYER_INDEX,
		}
		this.textGroupStyle = {
			top: this.imageStyle.height,	
			left: 0,
			width: this.props.width,
			height: this.props.height - this.imageStyle.height,
			zIndex: TEXT_LAYER_INDEX,
		}
		this.sourceStyle = _.extend({
			top: this.textGroupStyle.top + CONTENT_INSET,
			left: CONTENT_INSET, 
			width: this.props.width - 2*CONTENT_INSET,
		}, FONT0)
		this.profileGroupStyle = {
			top: this.sourceStyle.top + this.sourceStyle.height + 7,	
			left: CONTENT_INSET,
			width: this.props.width - 2*CONTENT_INSET,
			height: this.props.height * 0.067,
			backgroundColor: "#eee",
		}

		// Pre-compute headline/excerpt text dimensions.
		const wb = this.props.wb
		const maxWidth = this.props.width - 2 * CONTENT_INSET
		const titleStyle = this.getTitleStyle()
		const excerptStyle = this.getExcerptStyle()
		this.titleMetrics = measureText(this.getTitle(), maxWidth, titleStyle.fontFace, titleStyle.fontSize, titleStyle.lineHeight)
		this.excerptMetrics = measureText(wb.text, maxWidth, excerptStyle.fontFace, excerptStyle.fontSize, excerptStyle.lineHeight)
	},

	// render
	render: function() {
		let titleStyle = this.getTitleStyle()
		let excerptStyle = this.getExcerptStyle()

		// Layout title and excerpt below image.
		titleStyle.height = this.titleMetrics.height
		excerptStyle.top = titleStyle.top + titleStyle.height + CONTENT_INSET
		excerptStyle.height = this.props.height - excerptStyle.top - CONTENT_INSET

		return (
			<Group style={this.containerStyle}>
				<Image style={this.imageStyle} src={this.props.wb.bmiddle_pic || ""} fadeIn={true} useBackingStore={true} />
				<Group style={this.getTextGroupStyle()} useBackingStore={true}>
					<Text style={this.sourceStyle}>{`来自 ${this.getSource()}`}</Text>
					{this.renderProfile()}
					{/*<Text style={titleStyle}>{this.getTitle()}</Text>
					<Text style={excerptStyle}>{this.props.wb.text}</Text>*/}
				</Group>
			</Group>
		)
	},
	renderProfile: function(){
		return (
			<Group style={this.profileGroupStyle}>
				
			</Group>
		)
	},
	getTitle(){
		const title = this.props.wb.text.match(TITLE_REGEX)
		return title ? title[0] : null
	},
	getSource(){
		const source = SOURCE_REGEX.exec(this.props.wb.source)
		return source? source[1]:""
	},
	getImageHeight: function() {
		return Math.round(this.props.height * 0.5)
	},
	getImageStyle: function() {
		return _.extend({
		}, this.state.layout.children[0].layout)
	},
	getTitleStyle: function() {
		return {
			top: this.getImageHeight() + CONTENT_INSET,
			left: CONTENT_INSET,
			width: this.props.width - 2 * CONTENT_INSET,
			fontSize: 22,
			lineHeight: 30,
			fontFace: FontFace('Avenir Next Condensed, Helvetica, sans-serif', null, {
				weight: 500
			})
		}
	},
	getExcerptStyle: function() {
		return {
			left: CONTENT_INSET,
			width: this.props.width - 2 * CONTENT_INSET,
			fontFace: FontFace('Georgia, serif'),
			fontSize: 15,
			lineHeight: 23
		}
	},
	getTextGroupStyle: function() {
		// change alpha and translateY with alteration of scrollTop
		const alphaMultiplier = (this.props.scrollTop <= 0) ? -TEXT_ALPHA_SPEED_OUT_MULTIPLIER : TEXT_ALPHA_SPEED_IN_MULTIPLIER
		let alpha = 1 - (this.props.scrollTop / this.props.height) * alphaMultiplier
		alpha = Math.min(Math.max(alpha, 0), 1)
		const translateY = -this.props.scrollTop * TEXT_SCROLL_SPEED_MULTIPLIER

		return _.extend({
			alpha: alpha,
			translateY: translateY,
		}, this.textGroupStyle)
	}

})

export default WB