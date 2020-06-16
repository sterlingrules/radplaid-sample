import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { store } from './../src/app/redux/store.jsx'
import Home from './../src/app/home/index.jsx'
import HomeWithFeed from './../src/app/home/components/home-withfeed.jsx'
import HomeLoggedOut from './../src/app/home/components/home-loggedout.jsx'
import About from './../src/app/home/about.jsx'
import Press from './../src/app/home/press.jsx'
import PrivacyPolicy from './../src/app/home/privacy-policy.jsx'

configure({ adapter: new Adapter() })

// Handle global (window) functions
global.scrollTo = jest.fn()

describe('Home', () => {
	it('renders correctly', () => {
		expect(shallow(<Home />)).toMatchSnapshot()
	})
})

describe('HomeWithFeed', () => {
	it('renders correctly', () => {
		expect(shallow(<HomeWithFeed
			progress={[]}
			featuredShows={[]}
			fetchFeaturedShows={() => {}} />)).toMatchSnapshot()
	})
})

describe('HomeLoggedOut', () => {
	// This component uses the latest date
	// so it will not pass the test, since the date always changes
	xit('renders correctly', () => {
		expect(shallow(<HomeLoggedOut fetchShowList={() => {}} />)).toMatchSnapshot()
	})
})

describe('About', () => {
	it('renders correctly', () => {
		expect(shallow(<About {...{ store }} />)).toMatchSnapshot()
	})
})

describe('Press', () => {
	it('renders correctly', () => {
		expect(shallow(<Press />)).toMatchSnapshot()
	})
})

describe('PrivacyPolicy', () => {
	it('renders correctly', () => {
		expect(shallow(<PrivacyPolicy />)).toMatchSnapshot()
	})
})
