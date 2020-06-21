import React from 'react'
import _Select from 'react-select'
import _AsyncCreatable from 'react-select/lib/AsyncCreatable'

const CLASS_NAME = 'select'
const CLASS_NAME_PREFIX = 'select'

const Select = ({ type, settings, options }) => {
	return (
		<_Select
			className={`${CLASS_NAME} ${CLASS_NAME}--${type || 'default'}`}
			classNamePrefix={CLASS_NAME_PREFIX}
			options={options}
			{...settings} />
	)
}

export const AsyncCreatable = ({ type, settings, options }) => {
	return (
		<_AsyncCreatable
			className={`${CLASS_NAME} ${CLASS_NAME}--${type || 'default'}`}
			classNamePrefix={CLASS_NAME_PREFIX}
			options={options}
			{...settings} />
	)
}

export default Select
