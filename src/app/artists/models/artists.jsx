import { request, upload } from './../../helpers/request.jsx'
import User from './../../authentication/models/user.jsx'

const ls = localStorage
const key = 'shows'

const ArtistModel = {
    search(query = '') {
        return request({ path: `/artists/?q=${query}` })
    },

    find(query = '') {
        let settings = {
            path: `/artists/${encodeURIComponent(query)}`
        }

        return request(settings)
    }
}

export default ArtistModel
