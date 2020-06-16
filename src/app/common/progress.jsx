import React, { Component } from 'react'
import { connect } from 'react-redux'

class Progress extends Component {
	constructor(props) {
		super(props)

		this.state = {
			progress: false
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.initialized === false && nextProps.initialized === true) {
			this.setState({ progress: true })
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextProps.progress !== this.props.progress ||
			nextState.progress !== this.state.progress ||
			nextProps.progressStatus !== this.props.progressStatus ||
			nextProps.initialized !== this.props.initialized
		)
	}

	render() {
		let { progress, progressStatus } = this.props

		return (
			<div className="progress">
				<div className={`progress-bar ${(progress.indexOf('app') >= 0 || this.state.progress) ? 'progress-start' : 'progress-end'} progress--${progressStatus}`}></div>
			</div>
		)
	}
}

const mapStateToProps = ({ app }) => ({
	initialized: app.initialized,
	progress: app.progress,
	progressStatus: app.progressStatus
})

export default connect(mapStateToProps)(Progress)
