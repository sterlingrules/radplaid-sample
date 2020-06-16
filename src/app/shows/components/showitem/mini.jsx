import every from 'lodash/every'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { getDateName, convertColor } from './../../../helpers'

const getTextColor = (dominant_color) => {
	if (every(dominant_color, (color) => color < 170)) {
		return 'dark'
	}

	return 'light'
}

class ShowItemMini extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		let { artwork, date, title, slug, dominant_color, venue } = this.props
		let styleName = 'default'
		let backgroundColor = '#f6a692'
		let duration = new Date(date).getTime() - new Date().getTime()
		let dateName = getDateName(date).replace('-', ' ')

		if (artwork && Array.isArray(artwork.colors)) {
			backgroundColor = artwork.colors[0][0]
			styleName = getTextColor(convertColor(backgroundColor))
		}
		else if (dominant_color && dominant_color.length >= 3) {
			backgroundColor = `rgb(${dominant_color[0]},${dominant_color[1]},${dominant_color[2]})`
			styleName = getTextColor(dominant_color)
		}

		return (
			<Link to={`/shows/${slug}`} className={`showitem-mini showitem-mini--${styleName}`}>
				<div className="showitem-mini-content">
					<time dateTime={date} className="typography-small-headline text-uppercase">
						{dateName ? dateName : moment.duration(duration / 1000, 'seconds').humanize(true)}
						{dateName === 'today' && ` @ ${moment(date).utc().format('LT')}`}
					</time>
					<h3 className="showitem-mini-title">{`${title}${venue.name ? ` @ ${venue.name}` : ''}`}</h3>
				</div>
				<div style={{ backgroundColor }} className="showitem-mini-bg" />
			</Link>
		)
	}
}

export default ShowItemMini
