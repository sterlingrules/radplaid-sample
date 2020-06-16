import * as TYPES from './../types.jsx'
import * as Actions from './../actions/app.jsx'
import store from './../store.jsx'

import ArtistModel from './../../artists/models/artists.jsx'

const transform = (show) => {
    let { user } = store.getState().app

    show.canEdit = (user.id === show.organizer.id)

    return show
}

//
// Artists
//
const ArtistActions = {
    displayArtistResults(results) {

    },

    apiFetchArtists(query) {
        return (dispatch, getState) => {

        }
    }
}

export default ArtistActions
