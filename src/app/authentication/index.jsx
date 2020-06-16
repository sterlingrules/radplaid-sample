import isEmpty from 'lodash/isEmpty'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import Login from './components/login.jsx'
import User from './models/user.jsx'
import { connect } from 'react-redux';
import * as AppActions from './../redux/actions/app.jsx'
import { loginUser } from './../redux/actions/user.jsx'

class Auth extends Component {
	static contextTypes = {
		store: PropTypes.object.isRequired
	}

	constructor(props) {
		super(props)

		this.state = {
			user: User.get()
		}

		this.onLogin = this.onLogin.bind(this)
	}

	componentWillMount() {
		// We're logged in, let's go home
		if (!isEmpty(this.state.user)) {
			this.props.history.replace('/')
		}
	}

	onLogin(user) {
		let { loginUser, location, loadStart, loadEnd } = this.props

		loginUser(user)
		User.save(user)
	}

	render() {
		return (
			<Login onLogin={this.onLogin} loadStart={loadStart} loadEnd={loadEnd} />
		)
	}
}

const mapStateToProps = ({ app, user }) => ({
	user: user.user
})

const mapDispatchToProps = dispatch => {
	return {
		loadStart: () => {
			dispatch(loadStart())
		},

		loadEnd: () => {
			dispatch(loadEnd())
		},

		loginUser: (user) => {
			dispatch(loginUser(user))
		}
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(Auth)
)
