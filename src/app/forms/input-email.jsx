import React, { Component } from 'react'
import { requestPublic } from './../helpers/request.jsx'

const ERR_MESSAGE_FORMAT = 'Valid email please. We never spam.'
const ERR_MESSAGE_DUPLICATE = 'Yikes, that email is already taken.'

class InputEmail extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		className: PropTypes.string,
		userId: PropTypes.string,
		value: PropTypes.string,
		validateDupes: PropTypes.bool,
		onInputChange: PropTypes.func,
		ref: PropTypes.func
	}

	constructor(props) {
		super(props)

		this.regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ig
		this.state = {
			value: ''
		}

		this._onInputChange = this._onInputChange.bind(this)
		this._onInputState = this._onInputState.bind(this)
	}

	componentWillMount() {
		let { value } = this.props

		if (value) {
			this._onInputChange({
				target: {
					name: 'email',
					value
				}
			})
		}
	}

	_onInputState(evt) {
		let { onInputState } = this.props

		if (evt.type && onInputState) {
			return onInputState(evt.type)
		}
	}

	_onInputChange({ target }) {
		let { userId, validateDupes, onInputChange } = this.props
		let { name, value } = target
		let valid = !!(value.match(this.regex))

		value = (typeof value === 'string') ? value.trim() : ''

		if (this.state.value === value) {
			return
		}

		this.setState({ value })
		this.props.onInputChange({
			target: {
				name,
				value,
				valid,
				validType: 'format',
				validClass: valid ? 'form--valid' : 'form--invalid',
				message: ERR_MESSAGE_FORMAT
			}
		})

		// If valid is already
		// false, we don't need to query
		if (valid && validateDupes) {
			if (!userId) {
				return console.warn('`userId` required')
			}

			requestPublic({ path: `/auth/id/${userId}/email/${value}` })
				.end((err, reply) => {
					if (!reply || !reply.text) {
						return
					}

					this.props.onInputChange({
						target: {
							name,
							value,
							valid: false,
							validType: 'duplicate',
							validClass: 'form--invalid',
							message: ERR_MESSAGE_DUPLICATE
						}
					})
				})
		}
	}

	render() {
		let { id, ref, placeholder } = this.props
		let { value } = this.state

		return (
			<input
				id={id}
				className="form-input text-right"
				type="email"
				name="email"
				spellCheck="false"
				autoCorrect="off"
				autoComplete="off"
				autoCapitalize="none"
				value={value}
				placeholder={placeholder || ''}
				ref={typeof ref === 'function' ? ref : () => {}}
				onBlur={this._onInputState}
				onChange={this._onInputChange}
				onFocus={this._onInputState} />
		)
	}
}

export default InputEmail
