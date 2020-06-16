import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import clone from 'lodash/clone'
import { Link } from 'react-router-dom'
import { existsWithKey, cleanDescription, formatTitleFromLineup } from './../../helpers'
import ShowItem from './../../shows/components/showitem/index.jsx'
import User from './../../authentication/models/user.jsx'
import ReactHtmlParser from 'react-html-parser'

class StepFive extends PureComponent {
	constructor(props) {
		super(props)

		this._formatShowReview = this._formatShowReview.bind(this)
		this._setColor = this._setColor.bind(this)
	}

	_formatShowReview() {
		let _addShow = clone(this.props.addShow)

		_addShow.organizer = User.get()
		_addShow.reason = null

		if (_addShow.artwork) {
			_addShow.artwork.blob = _addShow.artwork ? _addShow.artwork.preview : ''
		}

		if (!_addShow.title) {
			_addShow.title = formatTitleFromLineup(_addShow.lineup)
		}

		if (existsWithKey(_addShow.venue, 'location')) {
			_addShow.venue.address = _addShow.venue.location.address
			_addShow.venue.city = _addShow.venue.location.city
			_addShow.venue.state = _addShow.venue.location.state
		}

		return _addShow
	}

	_setColor(evt) {
		let { dominant_color } = this.props.addShow

		if (!evt || !evt.target || dominant_color) {
			return
		}

		let colorThief = new ColorThief()

		this.props.onInputChange({
			target: {
				name: 'dominant_color',
				value: colorThief.getColor(evt.target)
			}
		})
	}

	render() {
		let _addShow = this._formatShowReview()
		let buttonValue = 'Looks good, publish!'

		return (
			<div className="row">
				<div className="row">
					<div id="add-step-five" className="addshow-step col col-6-of-12 push-3-of-12 col-medium-5-of-8 medium-un-push col-small-12-of-12">

						<ul className="showlist">
							<ShowItem
								key={0}
								disableTracking={true}
								onImageLoad={this._setColor}
								{..._addShow} />
						</ul>

						{_addShow.description && (
							<div className="bubble">
								<div className="bubble-copy typography--formatted" style={{ padding: '1rem' }}>
									{ReactHtmlParser(cleanDescription(_addShow.description))}
								</div>
							</div>
						)}

					</div>
				</div>
			</div>
		)
	}
}

export default StepFive
