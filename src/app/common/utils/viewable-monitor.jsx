import defaults from 'lodash/defaults'
import React, { Component } from 'react'
import { getChromeVersion } from './../../helpers/device-detect.js'

if (process.browser) {
	require('intersection-observer')
}

class ViewableMonitor extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isVisible: false
		}

		this.intersectionObserver
		this.parentEl
	}

	componentDidMount() {
		if (!this.parentEl || typeof window === 'undefined') {
			return
		}

		const chromeVersion = getChromeVersion()
		const config = {
			rootMargin: '25% 0% 25%',
			threshold: 0
		}

		// Let's not risk it on older Android devices
		if (chromeVersion && chromeVersion < 51) {
			return this.setState({ isVisible: true })
		}

		const callback = ([event]) => {
			this.setState({ isVisible: event.isIntersecting })

			if (event.isIntersecting && this.intersectionObserver) {
				this.intersectionObserver.disconnect()
			}
		}

		this.intersectionObserver = new IntersectionObserver(callback, config)
		this.intersectionObserver.observe(this.parentEl)
	}

	componentWillUnmount() {
		if (!this.intersectionObserver) {
			return
		}

		this.intersectionObserver.disconnect()
	}

	render() {
		let { className, minHeight, style = {}, children } = this.props
		let { isVisible } = this.state
		// let visibility = isVisible ? 'visible' : 'hidden'

		minHeight = (typeof minHeight === Number) ? minHeight : 48

		if (isVisible) {
			style = defaults({ minHeight }, style)
			className = className || ''
		}
		else {
			style = { minHeight }
			className = ''
		}

		return (
			<div ref={node => this.parentEl = node} style={style} className={className}>
				{isVisible ? children : (<div className="background-keyline" />)}
			</div>
		)

		// return (
		// 	<div ref={node => this.parentEl = node} style={style} className={className}>
		// 		{children ? children : (<div className="background-keyline" />)}
		// 	</div>
		// )
	}
}

export default ViewableMonitor
