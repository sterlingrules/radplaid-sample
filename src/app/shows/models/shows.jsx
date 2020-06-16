import URI from 'urijs'
import User from './../../authentication/models/user.jsx'
import { SHOWLIST_KEY } from './../../constants.jsx'
import { request, requestOnce, upload } from './../../helpers/request.jsx'
import { getCurrentDate } from './../../helpers'

const ls = typeof localStorage !== 'undefined' ? localStorage : {}

const ShowModel = {
	create() {
		let { id } = User.get()
		let settings = {
			path: '/shows',
			method: 'post',
			forceUpdate: true,
			data: {
				user_id: id
			}
		}

		return requestOnce(settings)
	},

	get(id = null, query = '', forceUpdate) {
		let uri = new URI('/')

		uri.search(query)

		return request({
			path: id ? `/shows/${id}${uri.search()}` : `/shows${uri.search()}`,
			forceUpdate,
		})
	},

	welcome(id = null, query = '') {
		let uri = new URI('/')
		let path

		uri.search(query)

		return request({
				path: `/shows/welcome${uri.search()}`
			})
	},

	getTags(value = '') {
		let settings = {
			path: `/tags?value=${value}`
		}

		return request(settings)
	},

	getSimilar(slug = '') {
		let settings = {
			path: `/shows/${slug}/similar`
		}

		return request(settings)
	},

	clearShowlist() {
		localStorage.removeItem(
			localStorage.getItem(SHOWLIST_KEY)
		)

		localStorage.removeItem('persist:shows')
	},

	getShowlistKey(sort = null) {
		return `${SHOWLIST_KEY}:${sort || User.getSort()}:${getCurrentDate()}`
	},
}

export default ShowModel
