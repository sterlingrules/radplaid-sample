import React, { Component } from 'react'
import union from 'lodash/union'
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import Select from './select.jsx'
import { request } from './../helpers/request.jsx'
import { delay, getOptionByValue } from './../helpers'

class InputScenes extends Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		value: PropTypes.array,
		className: PropTypes.string,
		onInputChange: PropTypes.func,
		appendOptions: PropTypes.array,
		scenes: PropTypes.array
	}

	constructor(props) {
		super(props)

		this.state = {
			options: []
		}

		this._cleanInput = this._cleanInput.bind(this)
		this._onChange = this._onChange.bind(this)
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(nextProps.scenes, this.props.scenes) ||
			!isEqual(nextProps.value, this.props.value)
		)
	}

	_onChange(value) {
		let { name, onInputChange } = this.props

		onInputChange({
			target: {
				name,
				value
			}
		})
	}

	_cleanInput(value) {
		return value
			.replace(/[^a-zA-Z,\s]/g, '')
			.substring(0, 25)
	}

	render() {
		let { menuIsOpen, appendOptions } = this.props
		let scenes = this.props.scenes || []
		let options = scenes.map((scene) => {
			return {
				value: scene.id,
				label: `${scene.name} (${scene.state})`
			}
		})

		let settings = {
			name: this.props.name,
			value: this.props.value,
			onChange: this._onChange,
			onInputChange: this._cleanInput,
			placeholder: `Select your Music Scenes`,
			closeMenuOnScroll: false,
			isSearchable: true,
			closeMenuOnSelect: (typeof menuIsOpen === 'boolean') ? !menuIsOpen : true,
			isMulti: true
		}

		if (menuIsOpen) {
			settings.menuIsOpen = menuIsOpen
		}

		if (Array.isArray(appendOptions)) {
			options = union(options, appendOptions)
		}

		return (
			<span className={this.props.className || ''}>
				<Select
					type="simple"
					settings={settings}
					options={options} />
			</span>
		)
	}
}

export default InputScenes
