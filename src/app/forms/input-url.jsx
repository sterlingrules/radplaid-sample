import React, { Component } from 'react'
import { requestPublic } from './../helpers/request.jsx'

const ERR_MESSAGE_FORMAT = 'Properly format URLs (ie. http or https)'

class InputUrl extends Component {
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

		this.regexStrict = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig
		this.regex = /(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig
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
					name: 'url',
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
		let { userId, validateDupes, onInputChange, strict } = this.props
		let { name, value } = target
		let valid = !!(value.match(strict ? this.regexStrict : this.regex))

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
	}

	render() {
		let { id, ref, placeholder } = this.props
		let { value } = this.state

		return (
			<input
				id={id}
				className="form-input text-right"
				type="text"
				name="url"
				spellCheck="false"
				autoCorrect="off"
				autoComplete="off"
				value={value}
				placeholder={placeholder || ''}
				ref={typeof ref === 'function' ? ref : () => {}}
				onBlur={this._onInputState}
				onChange={this._onInputChange}
				onFocus={this._onInputState} />
		)
	}
}

export default InputUrl
