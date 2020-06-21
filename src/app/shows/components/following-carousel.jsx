import isEqual from 'lodash/isEqual'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import Carousel from './../../common/carousel.jsx'
import { Loader } from './../../common/loader.jsx'
import { IconHeart } from './../../common/icons.jsx'
import UserActions from './../../redux/actions/user.jsx'
import ShowItemMini from './../../shows/components/showitem/mini.jsx'
import { getCurrentDate } from './../../helpers'

class FollowingCarousel extends Component {
	componentDidMount() {
		const { user, fetchUserShowList } = this.props

		if (!user) {
			return
		}

		fetchUserShowList({
			user_id: user.id,
			action: 'following',
			from: getCurrentDate()
		})
	}

	componentWillReceiveProps(nextProps) {
		const { user, fetchUserShowList, progress, isSearching } = nextProps

		if (!user) {
			return
		}

		if (user && !isEqual(user, this.props.user) && !isSearching) {
			fetchUserShowList({
				user_id: user.id,
				action: 'following',
				from: getCurrentDate()
			})
		}
	}

	render() {
		const { user, following = [], progress = [] } = this.props

		return (user && (
			<div className="row following-carousel">
				{(progress.indexOf('user:following') >= 0) ? (
					<div style={{ position: 'relative', width: '100%', boxSizing: 'border-box', height: '142px', padding: '0 1rem 2rem' }}>
						<div className="center-center widthfull" style={{ paddingBottom: '2rem' }}>
							<Loader size="small" />
						</div>
					</div>
				) : (following && following.length > 0) ? (
					<Carousel
						title={(following && following.length > 0) ? (
							<div className={`following-headline color-accent-two`}>
								Followed Shows ({following.length})
							</div>
						) : (
							<div className={`following-headline color-accent-two`}>
								Followed Shows
							</div>
						)}>
						{following.map((show, index) => {
							return (
								<ShowItemMini
									key={show.id}
									{...show} />
							)
						})}
					</Carousel>
				) : (
					<div className="block widthfull">
						<ul className="showitem-mini-emptygroup" style={{ paddingBottom: '1rem' }}>
							<li>
								<div className="showitem-mini showitem-mini--empty">
									<div className="showitem-mini-content color-accent-two">
										<IconHeart />
										<h3 className="showitem-mini-title">
											Follow an Event to keep track
										</h3>
									</div>
								</div>
							</li>
							<li><div className="showitem-mini showitem-mini--emptysimple" /></li>
							<li><div className="showitem-mini showitem-mini--emptysimple" /></li>
						</ul>
					</div>
				)}
			</div>
		))
	}
}

const mapStateToProps = ({ app, user, shows }) => ({
	progress: app.progress,
	isSearching: app.isSearching,
	user: user.user,
	following: user.following,
})

const mapDispatchToProps = dispatch => {
	return {
		fetchUserShowList: (query) => {
			dispatch(UserActions.apiFetchShowList(query))
		},
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(FollowingCarousel)
)
