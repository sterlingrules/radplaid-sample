import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import store from './../src/app/redux/store.jsx'
import Player from './../src/app/player/index.jsx'
import { getCurrentDate } from './../src/app/helpers'

configure({ adapter: new Adapter() })

describe('Player', () => {
	xit('renders correctly', () => {
		expect(shallow(<Player {...{ store }} />)).toMatchSnapshot()
	})
})
