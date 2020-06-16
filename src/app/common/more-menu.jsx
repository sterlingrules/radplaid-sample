import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import { track } from './../helpers/analytics.jsx'
import { IconMore } from './icons.jsx'

class MoreMenu extends Component {
	static propTypes = {
		options: PropTypes.array, // label / component, action / path
		className: PropTypes.string,
		source: PropTypes.string,
		moreMenu: PropTypes.func
	}

	constructor(props) {
		super(props)

		this.state = {
			isOpen: false
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.isOpen !== this.state.isOpen) {
			this._listen()
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(nextProps.options, this.props.options) ||
			nextState.isOpen !== this.state.isOpen
		)
	}

	_listen = () => {
		window[`${this.state.isOpen ? 'add' : 'remove'}EventListener`]('touchend', this._handleBlur)
		window[`${this.state.isOpen ? 'add' : 'remove'}EventListener`]('mousedown', this._handleBlur)
	}

	_toggleMenu = () => {
		this.setState({ isOpen: !this.state.isOpen })
	}

	_handleBlur = ({ target }) => {
		const findParent = (element = { tagName: null }) => {
			if (!element || !this.moreMenuEl) {
				return
			}

			let hasClass = (element.classList && element.classList.contains('view'))
			let ieSupport = (isString(element.className) && element.className.indexOf('view') >= 0)

			if ((hasClass || ieSupport) && this.state.isOpen) {
				return this._toggleMenu()
			}

			if (element == this.moreMenuEl ||
				element == this.moreMenuEl.parentElement) {
				return
			}

			findParent(element.parentElement)
		}

		findParent(target)
	}

	render() {
		let { className, moreButton, source, options = [] } = this.props
		let { isOpen } = this.state
		let MoreButton = moreButton

		return (
			<div ref={node => this.moreMenuEl = node} className={`more-menu ${isOpen ? 'active' : ''} ${className || ''}`}>
				<ul
					className="dropdown-menu"
					onMouseLeave={this._toggleMenu}>
					{options.map((option, index) => {
						let Component = option.component

						return (isEmpty(option) ? (
								<li key={index} className="divider"></li>
							) : (
								<li key={index}>
									{typeof Component === 'function' ? (
										<Component />
									) : (
										<Link
											to={option.path || '#'}
											title={typeof option.label === 'string' ? option.label : ''}
											aria-label={typeof option.label === 'string' ? option.label : ''}
											onClick={(evt) => {
												if (option.action) {
													evt.preventDefault()
													option.action(option)
												}

												track('more_menu', {
													action: 'click',
													label: option.label,
													value: 'more_menu',
													source: source || 'show_item'
												})
											}}>
											{option.label}
										</Link>
									)}
								</li>
							)
						)
					})}
				</ul>

				{MoreButton ? (
					<MoreButton {...this.props} onClick={this._toggleMenu} />
				) : (
					<div
						className="btn btn-more-menu btn--accent-two--secondary btn--small"
						onClick={this._toggleMenu}>
						<IconMore />
					</div>
				)}
			</div>
		)
	}
}

export default MoreMenu
