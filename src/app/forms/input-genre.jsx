import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import React, { Component } from 'react'
import Async from 'react-select/lib/Async'

import { request } from './../helpers/request.jsx'
import { delay } from './../helpers'

class InputGenre extends Component {
	static propTypes = {
		value: PropTypes.array,
		onInputChange: PropTypes.func
	}

	state = {
		isLoading: false,
		options: [
			{ value: 'punk', label: 'punk' },
			{ value: 'r&b', label: 'r&b' },
			{ value: 'rock', label: 'rock' },
			{ value: 'country', label: 'country' },
			{ value: 'pop', label: 'pop' }
		]
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextProps.value !== this.props.value ||
			!isEqual(nextState.options, this.state.options) ||
			nextState.isLoading !== this.state.isLoading
		)
	}

	_onInputChange = (value = []) => {
		if (value.length > this.props.limit) {
			return
		}

		this.props.onInputChange(value)
	}

	_cleanInput = (value) => {
		return value.replace(/[^a-zA-Z0-9&-|\s]/g, '').toLowerCase()
	}

	fetchOptions = (value = '') => {
		return new Promise((resolve, reject) => {
			if (!value) {
				return resolve(this.state.options)
			}

			return delay(() => {
				this.setState({ isLoading: true })

				request({ path: `/genres/?value=${value}` })
					.end((err, reply) => {
						this.setState({ isLoading: false })

						if (!reply) {
							return resolve(this.state.options)
						}

						let { options } = reply.body
						let _options = options.length ? reply.body : this.state.options

						resolve(_options ? _options.options : [])
					})
			}, 500)
		})
	}

	render() {
		const { isLoading } = this.state
		const { limit, value, placeholder } = this.props

		return (
			<Async
				name="genres"
				className={`input-genres ${(limit && value.length >= limit) ? 'is-limit' : ''}`}
				value={value}
				loadOptions={this.fetchOptions}
				defaultOptions={true}
				cacheOptions={false}
				onChange={this._onInputChange}
				onInputChange={this._cleanInput}
				placeholder={placeholder || 'Add artist genres'}
				isClearable={false}
				isLoading={false}
				isMulti={true} />
		)
	}
}

export default InputGenre
