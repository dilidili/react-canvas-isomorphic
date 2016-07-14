import React, {PropTypes} from 'react'
import Tweet from './Tweet'
import classNames from 'classnames'
import _ from 'underscore'
import Surface from 'react-canvas/Surface' 
import ListView from 'react-canvas/ListView' 

// const defaultList = {
// 	list: _.map(_.range(50), () => ({
// 		user: "Artour Babaev",
// 		tweet: _.sample(["is there a way to watch nanyang ingame without lag i remember i used to able to watch china games without any lag now its just always laggy",
// 				"is there a way to watch nanyang ingame without lag i remember i used to able to watch china games without any lag now its just always laggy e to watch china games without any lag now its just always laggy e to watch china games without any lag now its just always laggy e to watch china games without any lag now its just always laggy",
// 				"e to watch china games without any lag now its just always laggy",
// 			]),
// 		timestamp: new Date('Sun Jun 05 14:53:39 +0800 2016'),
// 		avatar: 'http://isomorphic-wb.oss-cn-hangzhou.aliyuncs.com/avatar.jpeg',
// 		retweet: {
// 			count: 40,
// 		},
// 		like: {
// 			count: 332,
// 		},
// 		id: "3996901369751053",
// 	})),
// }

const TweetList = React.createClass({
	// Lifecycle
	propTypes: {
		push: PropTypes.func.isRequired,
		list: PropTypes.array,
	},
	getDefaultProps: function(){
		return {
			list: [],
		}
	},
	getInitialState: function(){
		return this.computeStyleFromProps(this.props)
	},
	componentWillReceiveProps(nextProps){
		this.setState(this.computeStyleFromProps(nextProps))
	},
	componentWillMount(){
		this._canvasFrame = {
			top: 0,
			left: 0,
			width: window.innerWidth,
			height: ~~(window.innerHeight - 8.2 * window.fontSize),
		}
	},

	// Utils
	computeStyleFromProps(props){
		const tweetsStyle = _.map(props.list, tweet => {
			return Tweet.getTweetStyle(tweet)
		})
		return {
			tweetsStyle,
		}
	},

	// Render
	renderTweet: function(index){
	    return (
			<Tweet key={index} tweet={this.props.list[index]} style={this.state.tweetsStyle[index]} push={this.props.push}/>
	    )
	},
	render: function(){
		const {list} = this.props
		if (list.length<=0) return null

		console.log(this.props.leaveMotion)

		return (
			<div>
				<Surface {...this._canvasFrame}>
					<ListView
						style={this._canvasFrame}
						numberOfItems={this.props.list.length}
						itemHeightArray={_.map(this.state.tweetsStyle, v=>v.containerStyle.height)}
						itemGetter={this.renderTweet}
					>
					</ListView>
				</Surface>
			</div>
		)
	},
})

export default TweetList