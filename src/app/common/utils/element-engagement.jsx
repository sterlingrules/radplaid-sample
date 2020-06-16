import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ElementEngagement extends Component {
	static propTypes = {
		activeClass: PropTypes.string,
		offset: PropTypes.number // percent of window height (ex. 0.2)
	}

	state = {
		isEngaged: false
	}

	constructor(props) {
		super(props)

		this.engagedEl = null
	}

	componentWillMount() {
		this._unmounted = false
	}

	componentDidMount() {
		if (typeof window === 'undefined') {
			return
		}

		window.addEventListener('scroll', this._setScrollPosition, false, false)
		window.addEventListener('resize', this._updateMetrics, false, false)

		this._updateMetrics()
		this._setScrollPosition()
		this._checkPosition()
	}

	componentWillUnmount() {
		this._unmounted = true

		if (typeof window === 'undefined') {
			return
		}

		window.removeEventListener('scroll', this._setScrollPosition, false, false)
		window.removeEventListener('resize', this._updateMetrics, false, false)
	}

	_setScrollPosition = () => {
		if (typeof window === 'undefined') {
			return
		}

		this.scrollPosition = window.scrollY
	}

	_checkPosition = () => {
		if (this.state.isEngaged || typeof window === 'undefined' || this._unmounted) {
			return
		}

		let offset = this.props.offset || 0
		offset = this.windowHeight * offset

		this._updateMetrics()

		if (this.scrollPosition + this.windowHeight - offset > this.elementPosition) {
			this.setState({ isEngaged: true })
		}

		requestAnimationFrame(this._checkPosition)
	}

	_updateMetrics = () => {
		if (!this.engagedEl || typeof window === 'undefined') return

		this.elementPosition = this.engagedEl.getBoundingClientRect().top + window.scrollY
		this.windowHeight = window.innerHeight
	}

	render() {
		let activeClass = this.props.activeClass || 'engaged'

		return (
			<span ref={(element) => this.engagedEl = element} className={this.state.isEngaged ? activeClass : ''}>
				{this.props.children}
			</span>
		)
	}
}

export default ElementEngagement
