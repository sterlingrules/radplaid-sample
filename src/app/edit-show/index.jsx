import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { existsWithKey, verifyOwner } from './../helpers'
import * as AppActions from './../redux/actions/app.jsx'
import ShowActions from './../redux/actions/shows.jsx'
import UserActions from './../redux/actions/user.jsx'
import AddShow from './../add-show/index.jsx'

class EditShow extends Component {
	constructor(props) {
		super(props)

		this._displayEditShow = this._displayEditShow.bind(this)
	}

	componentDidMount() {
		this._displayEditShow(this.props)
	}

	componentWillUnmount() {
		this.props.setEditShow(null)
	}

	componentWillReceiveProps(nextProps) {
		if (!isEqual(nextProps.addShow, this.props.addShow) ||
			!isEqual(nextProps.activeShow, this.props.activeShow) ||
			!isEqual(nextProps.match, this.props.match)) {

			this._displayEditShow(nextProps)
		}
	}

	_displayEditShow(nextProps) {
		const { user, addShow, editShow, activeShow, setEditShow, apiFetchShowById, match } = nextProps
		const { params } = match
		const isDifferentShow = (existsWithKey(activeShow, 'slug') && activeShow.slug !== params.slug)
		const isNewShow = (!existsWithKey(activeShow, 'slug') && params.slug)
		const isAdmin = (user && Array.isArray(user.role) && user.role.indexOf('admin') >= 0)
		const isOwner = verifyOwner(user, activeShow)

		// No show? Let's get it
		if (isDifferentShow || isNewShow) {
			return apiFetchShowById(params.slug)
		}

		// We got the show, let's set it for edit
		if (activeShow.slug === params.slug && !editShow) {
			return setEditShow(clone(activeShow))
		}

		if (!params.step) {
			return this.props.history.push(`/shows/${params.slug}/edit/1`)
		}

		if (!isOwner && !isAdmin && !isEmpty(activeShow) && params.slug) {
			return this.props.history.push(`/shows/${params.slug}`)
		}
	}

	render() {
		const { user, activeShow, match } = this.props
		const { params } = match
		const isOwner = verifyOwner(user, activeShow)
		const isAdmin = (user && Array.isArray(user.role) && user.role.indexOf('admin') >= 0)

		return ((isOwner || isAdmin) ? (
				<div id="editshow" className="edit">
					<AddShow params={params} />
				</div>
			) : (
				<div className="text-center" style={{ paddingTop: '8rem' }}>
					<h3 className="typography-subheadline">You don't have access</h3>
				</div>
			)
		)
	}
}

const mapStateToProps = ({ app, shows, user }) => ({
	viewportName: app.viewportName,

	user: user.user,

	shows: shows.shows,
	addShow: shows.addShow,
	editShow: shows.editShow,
	activeShow: shows.activeShow,
	deletedShowId: shows.deletedShowId
})

const mapDispatchToProps = dispatch => {
	return {
		setEditShow: (show) => {
			dispatch(ShowActions.setEditShow(show))
		},

		apiFetchShowById: (slug) => {
			dispatch(ShowActions.apiFetchShowById(slug))
		},

		deleteShow: (slug) => {
			dispatch(ShowActions.apiDeleteShow(slug))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EditShow)
