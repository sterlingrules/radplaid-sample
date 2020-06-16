import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Shows from './../src/app/shows/index.jsx'

configure({ adapter: new Adapter() })

describe('Shows', () => {
	it('renders correctly', () => {
		expect(shallow(<Shows />)).toMatchSnapshot()
	})
})
