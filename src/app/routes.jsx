import Home from './home/index.jsx'
import Shows from './shows/index.jsx'
import Profile from './profile/index.jsx'
import Settings from './profile/settings.jsx'
import AddShow from './add-show/index.jsx'
import EditShow from './edit-show/index.jsx'
import About from './home/about.jsx'
import Press from './home/press.jsx'
import Services from './home/services.jsx'
import PrivacyPolicy from './home/privacy-policy.jsx'

export default [{
	path: '/',
	component: Home,
	exact: true
}, {
	path: '/logout',
	component: Home
},

/* Shows */
{
	path: '/shows/:slug/admin/:view',
	component: Shows,
}, {
	path: '/shows/:slug/admin',
	component: Shows,
}, {
	private: true,
	path: '/shows/:slug/edit/:step',
	component: EditShow,
}, {
	path: '/shows/:slug',
	component: Shows,
}, {
	private: true,
	path: '/add/:step',
	component: AddShow,
}, {
	private: true,
	path: '/add',
	component: AddShow,
	exact: true,
},

/* Profile */
{
	path: '/profile/:id/following',
	component: Profile
}, {
	path: '/profile/:id/managing',
	component: Profile
}, {
	path: '/profile/:id',
	component: Profile
}, {
	path: '/profile',
	component: Profile,
	exact: true
}, {
	private: true,
	path: '/settings',
	component: Settings
},

/* Marketing */
{
	path: '/what-is-rad-plaid',
	component: About
}, {
	path: '/about',
	component: About
}, {
	path: '/press',
	component: Press
}, {
	path: '/services',
	component: Services
}, {
	path: '/privacy-policy',
	component: PrivacyPolicy
}]
