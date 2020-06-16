import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import store from './../src/app/redux/store.jsx'
import Modal from './../src/app/modals/index.jsx'

configure({ adapter: new Adapter() })

describe('Modals', () => {
	it('renders correctly', () => {
		expect(shallow(<Modal {...{ store }} />)).toMatchSnapshot()
	})
})
