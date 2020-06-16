import clone from 'lodash/clone'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { verifyOwner } from './../../helpers'
import { track } from './../../helpers/analytics.jsx'
import { request } from './../../helpers/request.jsx'
import * as AppActions from './../../redux/actions/app.jsx'
import ShowActions from './../../redux/actions/shows.jsx'
import UserActions from './../../redux/actions/user.jsx'

import {
	IconStar,
	IconMenu,
	IconEdit,
	IconTrash,
	IconLightning,
	IconChart,
} from './../../common/icons.jsx'

class ShowAdmin extends Component {
	toggleRecommend = () => {
		const { activeShow, updateActiveShow, setNotification } = this.props

		if (!activeShow) {
			return
		}

		let recommended = !(activeShow.recommended)
		let _activeShow = clone(activeShow)

		_activeShow.recommended = recommended

		updateActiveShow(_activeShow)

		request({
			method: 'put',
			path: `/admin/shows/${activeShow.id}`,
			data: {
				recommended,
			}
		})
		.end((err, reply) => {
			if (reply && reply.body) {
				setNotification({
					status: 'success',
					title: `Show ${reply.body.recommended ? 'recommended' : 'unrecommended'}`,
				})
			}
		})
	}

	setAdminVisible = (name, path) => {
		const { activeShow, isAdminVisible } = this.props

		this.props.setAdminVisible(path)

		if (!isAdminVisible) {
			track('cta', {
				action: name,
				source: 'showadmin',
				label: `promote ${activeShow.slug}`,
				show_id: activeShow.slug,
			})
		}
	}

	deleteShow = () => {
		let { activeShow, deleteShow, resetSearch } = this.props
		let showId = activeShow ? activeShow.slug : null
		let title = activeShow ? activeShow.title : ''

		deleteShow(showId, title, () => {
			track('cta', {
				action: 'delete show',
				source: 'showadmin',
				show_id: showId,
				label: `delete ${showId}`,
			})

			this.props.history.push(`/`)
			resetSearch()
		})
	}

	render() {
		let { user, activeShow, location, routing, isBrowser, isAdminVisible } = this.props
		let pathname = (typeof window !== 'undefined') ? window.location.pathname : ''
		let isOwner = verifyOwner(user, activeShow)
		let isFeatured = !!(activeShow && activeShow.featured)
		let isAdmin = (user && Array.isArray(user.role) && user.role.indexOf('admin') >= 0)
		let isShow = activeShow ? (pathname.indexOf(`/shows/${activeShow.slug}`) >= 0) : false
		let isEditing = (pathname.indexOf(`/edit`) >= 0)
		let isRecommended = activeShow ? !!(activeShow.recommended) : false

		return ((isOwner || isAdmin) && isShow && !isEditing) && (
			<div className="showadmin">
				<div className="grid">
					<div className="row">
						<div className="showadmin-left">
							<div name="admin" className="showadmin-btn" onClick={this.setAdminVisible.bind(this, 'admin', '/admin')}>
								<IconMenu style={{ margin: 0 }} />
							</div>

							{(isAdmin && !isFeatured) && (
								<div className="showadmin-btn" onClick={this.toggleRecommend}>
									<IconStar className={isRecommended ? 'fill-feedback' : 'fill-white'} />
									<span>Recommend</span>
								</div>
							)}

							<div name="admin" className="showadmin-btn" onClick={this.setAdminVisible.bind(this, 'analytics', '/admin')}>
								<IconChart className="icon--small" />
								<span>Analytics</span>
							</div>

							<div name="admin/certified" className="showadmin-btn" onClick={this.setAdminVisible.bind(this, 'promote', '/admin/certified')}>
								<IconLightning className="icon-promote icon--small" />
								<span className="showadmin-btn-small-copy">Promote</span><span> Event</span>
							</div>
						</div>
						<div className="showadmin-right">
							<Link to={`/shows/${activeShow.slug}/edit/1`} className="showadmin-btn">
								<IconEdit className="icon--small" />
								<span>Edit</span>
							</Link>
							<div className="showadmin-btn" onClick={this.deleteShow}>
								<IconTrash className="icon--small" />
								<span>Delete</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = ({ app, shows, user, routing }) => ({
	viewportName: app.viewportName,
	isBrowser: app.isBrowser,

	user: user.user,

	shows: shows.shows,
	activeShow: shows.activeShow,
	deletedShowId: shows.deletedShowId,
	isAdminVisible: shows.isAdminVisible,
	routing: routing
})

const mapDispatchToProps = dispatch => {
	return {
		updateActiveShow: (activeShow) => {
			dispatch(ShowActions.updateActiveShow(activeShow))
		},

		deleteShow: (slug, title, callback) => {
			dispatch(ShowActions.apiDeleteShow(slug, title, callback))
		},

		setAdminVisible: (isVisible) => {
			dispatch(ShowActions.setAdminVisible(isVisible))
		},

		setNotification: (notification) => {
			dispatch(AppActions.setNotification(notification))
		},

		resetSearch: () => {
			dispatch(AppActions.resetSearch())
		},
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(ShowAdmin)
)
