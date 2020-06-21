import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import isFunction from 'lodash/isFunction'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import URI from 'urijs'
import * as AppActions from './../redux/actions/app.jsx'
import UserActions from './../redux/actions/user.jsx'
import { track, timeEvent } from './../helpers/analytics.jsx'
import ModalSignup from './components/modal-signup.jsx'
import ModalEditProfile from './components/modal-editprofile.jsx'
import ModalClaim from './components/modal-claim.jsx'
import Login from './../authentication/components/login.jsx'
import ModalContent from './components/modal.jsx'

class Modal extends Component {
	static contextTypes = {
		store: PropTypes.object.isRequired,
	}

	static propTypes = {
		location: PropTypes.object,
		isVisible: PropTypes.bool,
		onClose: PropTypes.func,
	}

	scrollPosition = 0

	componentDidMount() {
		this._track()
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.search === this.props.location.search) {
			return
		}

		this._track(nextProps)
	}

	shouldComponentUpdate(nextProps, nextState) {
		let { user, claim, isVisible, children } = nextProps
		let { search } = nextProps.location
		let query = new URI(this.props.location.search).query(true)
		let prevQuery = new URI(search).query(true)

		return (
			(user && this.props.user && user.id !== this.props.user.id) ||
			(claim && this.props.claim && claim.id !== this.props.claim.id) ||
			isVisible !== this.props.isVisible ||
			prevQuery.modal !== query.modal
		)
	}

	closeModal = (evt) => {
		let uri = new URI()
		let isOverlayEl = (
			evt &&
			evt.target &&
			evt.target.className &&
			isFunction(evt.target.className.indexOf) &&
			evt.target.className.indexOf('modal-overlay') >= 0
		)

		// Prevent standard closing if `editprofile`
		if (uri.hasQuery('modal', 'editprofile') && isOverlayEl) {
			return
		}

		uri.removeSearch('modal')
		uri.removeSearch('step')
		uri.removeSearch('next')

		this.props.history.replace(`${uri.pathname()}${uri.search()}`)
		this._setDocument(true)
	}

	_onKeyUp = (evt) => {
		let keyCode = evt.which || evt.keyCode

		if (keyCode == 27) {
			this.closeModal(evt)
		}
	}

	_track = (nextProps) => {
		let { user, location } = nextProps || this.props
		let { search } = location
		let query = new URI(search).query(true)
		let canShowSignup = ((query.modal === 'signup' || query.modal === 'login') && !user)
		let canEditProfile = (query.modal === 'editprofile' && user)

		if (!canShowSignup || !canEditProfile) {
			query.modal == false
		}

		if (canShowSignup) {
			timeEvent('register')
		}

		if (query.modal) {
			return track('modal', {
				action: query.modal
			})
		}

		this.closeModal()
	}

	_setDocument = (clear = false) => {
		if (typeof document === 'undefined') {
			return
		}

		if (!clear) {
			this.scrollPosition = window.scrollY
		}

		window[`${clear ? 'remove' : 'add'}EventListener`]('keyup', this._onKeyUp)

		let mainEl = document.querySelector('main')
		let footerEl = document.querySelector('footer')
		let { isVisible } = this.props

		document.body.style.position = clear ? '' : 'fixed'
		document.body.style.width = clear ? '' : '100%'

		if (mainEl && typeof isVisible === 'undefined') {
			mainEl.style.transform = clear ? '' : `translateY(${this.scrollPosition * -1}px)`
		}

		if (footerEl && typeof isVisible === 'undefined') {
			footerEl.style.transform = clear ? '' : `translateY(${this.scrollPosition * -1}px)`
		}

		if (clear) {
			window.scrollTo(0, this.scrollPosition || 0)
		}
	}

	render() {
		let {
			id,
			user,
			claim,
			location,
			children,
			isVisible = false,
			onClose,
		} = this.props

		let { search } = location
		let query = new URI(search).query(true)

		let canShowSignup = ((query.modal === 'signup' || query.modal === 'login') && !user)
		let canEditProfile = (query.modal === 'editprofile' && user)
		let canSubscribe = (query.modal === 'email')
		let canClaim = (query.modal === 'claim' && !isEmpty(claim))
		let canShowModal = (canShowSignup || canEditProfile || canSubscribe || canClaim || isVisible)

		this._setDocument(!canShowModal)

		if (query.next && typeof localStorage !== 'undefined') {
			localStorage.setItem('next', query.next)
		}

		return (
			<section id="modal" className={`modal ${(query.modal || isVisible) ? 'modal-active' : ''}`}>

				{canShowSignup && (<ModalSignup type={query.modal} close={this.closeModal} {...this.props} />)}
				{canEditProfile && (<ModalEditProfile close={this.closeModal} {...this.props} />)}
				{canClaim && (<ModalClaim close={this.closeModal} {...this.props} />)}

				{(isVisible && children) && (
					<ModalContent id={id} close={onClose}>
						{children}
					</ModalContent>
				)}

				{canShowModal && (
					<div className="modal-overlay" onClick={this.closeModal}></div>
				)}
			</section>
		)
	}
}

const mapStateToProps = ({ app, user }) => ({
	user: user.user,
	viewportName: app.viewportName,
	progress: app.progress,
	claim: app.claim
})

const mapDispatchToProps = dispatch => {
	return {
		loadStart: () => {
			dispatch(AppActions.loadStart())
		},

		loadEnd: () => {
			dispatch(AppActions.loadEnd())
		},

		postClaim: (claim) => {
			dispatch(AppActions.apiPostClaim(claim))
		},

		sendLoginToken: (email) => {
			dispatch(UserActions.sendLoginToken(email))
		}
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(Modal)
)
