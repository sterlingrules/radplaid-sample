import isEqual from 'lodash/isEqual'
import React, { Component, Fragment } from 'react'
import Carousel from './../../common/carousel.jsx'
import ShowItem from './showitem/index.jsx'

const options = {
	perView: 3,
	keyboard: false,
	peek: {
		before: 0,
		after: 24
	},
	breakpoints: {
		1023: {
			perView: 2,
			peek: {
				before: 0,
				after: 24,
			},
		},
		767: {
			perView: 1,
			peek: {
				before: 0,
				after: 24
			},
		},
	},
}

class ShowSimilar extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(nextProps.shows, this.props.shows)
		)
	}

	render() {
		const {
			user,
			onAction,
			titleClass,
			carouselOptions,
			children,
			shows = [],
			title,
		} = this.props

		return (shows.length > 0) ? (
			<Carousel
				options={carouselOptions || options}
				title={title}
				titleClass={titleClass}>

				{shows.map((show, index) => (
					<ShowItem
						key={show.id}
						user={user}
						action="show_from_similar"
						onAction={onAction}
						{...show} />
				))}

				{children}
			</Carousel>
		) : (
			<Fragment />
		)
	}
}

export default ShowSimilar
