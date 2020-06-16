import URI from 'urijs'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ShowActions from './../../redux/actions/shows.jsx'
import { track } from './../../helpers/analytics.jsx'
import { IconClose } from './../../common/icons.jsx'

class ShowPromo extends Component {
	static propTypes = {
		show: PropTypes.object,
		clearNotifications: PropTypes.func,
		setNotification: PropTypes.func,
	}

	setAdminVisible = (path) => {
		this.props.setAdminVisible(path)
	}

	render() {
		let {
			show,
			headline,
			setNotification,
			clearNotifications
		} = this.props

		let { title, date, slug } = show

		return (
			<div className={`show-promo show-promo--notification bubble bubble--nopadding text-left color-primary`}>
				<div className="bubble-copy">
					<div className="listitem-action text-right">
						<ul className="list list--flex">
							<li>
								<div className="btn btn--accept widthfull" onClick={this.setAdminVisible.bind(this, '/admin/certified')}>
									Promote
								</div>
							</li>
							<li>
								<div className="btn btn--accent-two--secondary widthfull" onClick={this.setAdminVisible.bind(this, '/admin')}>
									Analytics
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => {
	return {
		setAdminVisible: (isVisible) => {
			dispatch(ShowActions.setAdminVisible(isVisible))
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowPromo)
