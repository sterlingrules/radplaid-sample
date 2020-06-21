import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AsyncCreatable } from './select.jsx'
import ShowModel from './../shows/models/shows.jsx'

class InputTag extends Component {
	static propTypes = {
		onInputChange: PropTypes.func,
		viewportName: PropTypes.string,
		value: PropTypes.array
	}

	constructor(props) {
		super(props)

		this.state = {
			options: [
				{ value: 'punk', label: 'punk' },
				{ value: 'indie', label: 'indie' },
				{ value: 'food', label: 'food' },
				{ value: 'beer', label: 'beer' }
			]
		}

		this.fetchOptions = this.fetchOptions.bind(this)
		this._cleanInput = this._cleanInput.bind(this)
		this._onInputKeyDown = this._onInputKeyDown.bind(this)
		this._onInputChange = this._onInputChange.bind(this)
	}

	_onInputKeyDown(evt) {
		let { value } = this.props

		if (value.length >= 5) {
			return evt.preventDefault()
		}
	}

	_onInputChange(value = [{}]) {
		let { onInputChange } = this.props

		value = value.map((tag, index) => {
			return {
				value: this._cleanInput(tag.value),
				label: this._cleanInput(tag.label)
			}
		})

		onInputChange({
			target: {
				name: 'tags',
				value: value
			}
		})
	}

	_cleanInput(value = '') {
		return value
			.replace(/[^a-zA-Z0-9&\-\s]|create tag /g, '')
			.toLowerCase()
			.substring(0, 25)
	}

	fetchOptions(value) {
		return new Promise((resolve, reject) => {
			ShowModel
				.getTags(this._cleanInput(value))
				.end((err, reply) => {
					if (err || !reply) {
						return resolve(this.state.options || [])
					}

					let { options } = reply.body.results
					let _options = options.length ? reply.body.results : this.state

					resolve(_options ? _options.options : [])
				})
		})
	}

	render() {
		let { viewportName } = this.props

		return (
			<AsyncCreatable
				className="input-tags"
				settings={{
					inputId: 'input-tags',
					name: 'form-field-name',
					value: this.props.value,
					loadOptions: this.fetchOptions,
					defaultOptions: true,
					cacheOptions: true,
					onChange: this._onInputChange,
					onInputChange: this._cleanInput,
					onInputKeyDown: this._onInputKeyDown,
					placeholder: (viewportName === 'small') ? `add tags (5 max)` : `add tags (ie. indie, local, beer. 5 max)`,
					promptTextCreator: label => `create tag '${label}'`,
					autoCorrect: 'off',
					isMulti: true
				}} />
		)
	}
}

export default InputTag
