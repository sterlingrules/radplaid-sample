import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect, withRouter } from 'react-router-dom'
import keys from 'lodash/keys'
import URI from 'urijs'
import User from '../models/user.jsx'

class PrivateRoute extends Component {
	constructor(props) {
		super(props)

		this.state = {
			user: User.get()
		}

		this.verify = this.verify.bind(this)
		this._cleanComponentFromProps = this._cleanComponentFromProps.bind(this)
	}

	verify(props) {
		let PrivateComponent = this.props.component
		let { pathname } = this.props.location

		return (this.state.user ? (
			<PrivateComponent {...props} />
		) : (
			<Redirect to={{
				pathname: '/',
				search: `modal=signup&next=${pathname}`
			}} />
		))
	}

	_cleanComponentFromProps() {
		let props = {}
		let _keys = keys(this.props)

		for (let i = 0; i < _keys.length; i++) {
			if (_keys[i] != 'component') {
				props[_keys[i]] = this.props[_keys[i]]
			}
		}

		return props
	}

	render() {
		let props = this._cleanComponentFromProps()

		return (
			<Route {...props} render={this.verify} />
		)
	}
}

export default withRouter(PrivateRoute)
