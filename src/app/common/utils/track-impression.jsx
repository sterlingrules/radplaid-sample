import isObject from 'lodash/isObject'
import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import { track } from './../../helpers/analytics.jsx'
import { events, delay } from './../../helpers'
import { DEBUG } from './../../constants.jsx'

class TrackImpression extends Component {
	static propTypes = {
		name: PropTypes.string,
		data: PropTypes.object // object, or array for multiple data tracking
	}

	constructor(props) {
		super(props)

		this.canUpdate = false
		this.scrollEvent
		this.resizeEvent

		this._setMetrics = this._setMetrics.bind(this)
		this._trackImpression = this._trackImpression.bind(this)
	}

	componentDidMount() {
		if (typeof window === 'undefined') {
			return
		}

		this.canUpdate = true
		this._setMetrics()
		this._trackImpression({ top: window.scrollY })

		this.scrollEvent = events.subscribe('scroll', this._trackImpression)
		this.resizeEvent = events.subscribe('resize', this._setMetrics)
	}

	componentWillUnmount() {
		if (typeof window === 'undefined') {
			return
		}

		this.canUpdate = false

		if (this.scrollEvent) {
			this.scrollEvent.remove()
		}

		if (this.resizeEvent) {
			this.resizeEvent.remove()
		}
	}

	componentDidUpdate() {
		this._setMetrics()
	}

	_trackImpression(evt) {
		let { name, data, disabled } = this.props

		if (evt.top + this.viewportHeight > this.showItemBottom) {
			if (this.scrollEvent) {
				this.scrollEvent.remove()
			}

			if (name && !disabled) {
				if (Array.isArray(data)) {
					data.forEach((_data, index) => {
						_data.depth = evt.top
						_data.action = 'impression'

						if (DEBUG) {
							console.debug(name, _data)
						}

						track(name, _data)
					})
				}
				else if (isObject(data)) {
					data.depth = evt.top
					data.action = 'impression'

					if (DEBUG) {
						console.debug(name, data)
					}

					requestAnimationFrame(() => track(name, data))
				}
			}
		}
	}

	_setMetrics() {
		if (!this.canUpdate || typeof window === 'undefined') {
			return
		}

		this.viewportHeight = window.innerHeight
		this.scrollPosition = window.scrollY
		this.showItemBottom = 0

		if (this.showItemElement) {
			this.showItemBottom = this.scrollPosition + Math.round(this.showItemElement.getBoundingClientRect().bottom)
		}
	}

	render() {
		return (
			<span ref={node => this.showItemElement = node}>
				{this.props.children}
			</span>
		)
	}
}

export default TrackImpression
