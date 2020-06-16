require('dotenv').config()

import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import store from './../src/app/redux/store.jsx'
import InputScenes from './../src/app/forms/input-scenes.jsx'
import InputEmail from './../src/app/forms/input-email.jsx'
import Search from './../src/app/common/header/search.jsx'

configure({ adapter: new Adapter() })

jest.useFakeTimers()

describe('InputEmail', () => {
	const InputEmailName = 'input-email'

	it('renders correctly', () => {
		const InputEmailComponent = shallow(<InputEmail name={InputEmailName} />)
		expect(InputEmailComponent).toMatchSnapshot()
	})

	it('returns valid email', () => {
		const onInputChangeMock = jest.fn()
		const InputEmailComponent = shallow(
			<InputEmail
				userId="newuser"
				name={InputEmailName}
				onInputChange={onInputChangeMock} />
		)

		let event = {
			target: {
				name: InputEmailName,
				value: 'yo@sterlingrul.es'
			}
		}

		InputEmailComponent.simulate('change', event)

		expect(onInputChangeMock).toHaveBeenCalledTimes(1)
		expect(onInputChangeMock).toHaveBeenCalledWith({
			target: {
				name: InputEmailName,
				value: 'yo@sterlingrul.es',
				valid: true,
				validType: 'format',
				validClass: 'form--valid',
				message: 'Valid email please. We never spam.'
			}
		})
	})

	it('handles malformed email', () => {
		const onInputChangeMock = jest.fn()
		const InputEmailComponent = shallow(
			<InputEmail
				userId="newuser"
				name={InputEmailName}
				onInputChange={onInputChangeMock} />
		)

		let event = {
			target: {
				name: InputEmailName,
				value: 'yo@sterlingrul'
			}
		}

		InputEmailComponent.simulate('change', event)

		expect(onInputChangeMock).toHaveBeenCalledTimes(1)
		expect(onInputChangeMock).toHaveBeenCalledWith({
			target: {
				name: InputEmailName,
				value: 'yo@sterlingrul',
				valid: false,
				validType: 'format',
				validClass: 'form--invalid',
				message: 'Valid email please. We never spam.'
			}
		})
	})

	it('handles duplicate email', () => {
		const onInputChangeMock = jest.fn()
		const InputEmailComponent = shallow(
			<InputEmail
				userId="newuser"
				name={InputEmailName}
				validateDupes={true}
				onInputChange={onInputChangeMock} />
		)

		let event = {
			target: {
				name: InputEmailName,
				value: 'hello@getradplaid.com'
			}
		}

		InputEmailComponent.simulate('change', event)

		setTimeout(() => {
			expect(onInputChangeMock).toHaveBeenCalledTimes(2)
			expect(onInputChangeMock).toHaveBeenLastCalledWith({
				target: {
					name: InputEmailName,
					value: 'hello@getradplaid.com',
					valid: false,
					validType: 'duplicate',
					validClass: 'form--invalid',
					message: 'Yikes, that email is already taken.'
				}
			})
		}, 1000)
	})
})

describe('HeaderSearch', () => {
	describe('large viewport', () => {
		it('renders correctly', () => {
			const SearchComponent = shallow(<Search viewportName="large" />)
			expect(SearchComponent).toMatchSnapshot()
		})
	})

	describe('small viewport', () => {
		it('renders correctly', () => {
			const SearchComponent = shallow(<Search viewportName="small" />)
			expect(SearchComponent).toMatchSnapshot()
		})
	})
})

describe('InputScenes', () => {
	it('renders correctly', () => {
		expect(shallow(<InputScenes name="input-scenes" />)).toMatchSnapshot()
	})
})
