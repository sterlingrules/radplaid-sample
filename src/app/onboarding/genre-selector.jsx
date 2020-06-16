import isEqual from 'lodash/isEqual'
import intersection from 'lodash/intersection'
import difference from 'lodash/difference'
import without from 'lodash/without'
import union from 'lodash/union'
import uniq from 'lodash/uniq'
import clone from 'lodash/clone'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { DEBUG, SURVEY_ID_RECOMMENDATIONS, PARENT_GENRES } from './../constants.jsx'
import { IconDone, IconPlus, IconClose, IconCircleSelect } from './../common/icons.jsx'
import UserActions from './../redux/actions/user.jsx'

class GenreSelector extends Component {
	constructor(props) {
		super(props)

		this.state = {
			genres: []
		}
	}

	componentWillMount() {
		const { genres = [] } = this.props.user || {}

		if (genres.length > 0) {
			const similar = intersection(genres, PARENT_GENRES)

			this.props.fetchSimilarGenres(similar)
			this.setState({ genres: clone(genres || []) })
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(nextState.genres, this.state.genres) ||
			!isEqual(nextProps.genres, this.props.genres) ||
			!isEqual(nextProps.user, this.props.user)
		)
	}

	onClick = ({ target }) => {
		let { genre, parent, active } = target.dataset
		let _genres = this.props._genres || {}
		let genres = clone(this.state.genres || [])
		let isActive = (active === 'true')

		if (isActive) {
			genres = without(genres, genre)
			genres = difference(genres, _genres[genre] || [])
		}
		else {
			genres.push(genre)
		}

		if (parent) {
			this.props.fetchSimilarGenres(
				intersection(genres, PARENT_GENRES),
				(similarGenres) => {
					// if (isActive) {
					// 	return
					// }

					// let __genres = clone(this.state.genres || [])

					// genres = uniq(union(__genres, difference(similarGenres[genre] || [], PARENT_GENRES)))

					// this.setState({ genres })
					// this.props.onChange({
					// 	target: {
					// 		name: 'genres',
					// 		value: genres
					// 	}
					// })
				}
			)
		}

		this.setState({ genres })
		this.props.onChange({
			target: {
				name: 'genres',
				value: genres
			}
		})
	}

	render() {
		const { user, label, genres: similarGenres } = this.props
		const { genres } = this.state
		const subgenres = uniq(union(similarGenres, genres))

		return (
			<Fragment>
				{label ? (
					<div className="genre-headline">
						<label className="form-label">{label}</label>
						<div className="typography-small text-right">{genres.length} genres selected</div>
					</div>
				) : (
					<p className="typography-small text-center">{genres.length} genres selected</p>
				)}

				<ul className="genre-selector">
					{PARENT_GENRES.map(genre => {
						let isSelected = (genres.indexOf(genre) >= 0)

						return (
							<li
								key={genre}
								data-genre={genre}
								data-parent="true"
								data-active={isSelected}
								className={`cursor-pointer violator violator--${isSelected ? 'active' : 'inactive'} violator--pill`}
								style={{ marginBottom: '0.5rem' }}
								onClick={this.onClick}>
								{isSelected ? <IconClose /> : <IconPlus />} {genre}
							</li>
						)
					})}

					{subgenres.length > 0 && (
						<Fragment>
							<div className="break" name="subgenres" />

							{subgenres
								.filter(g => PARENT_GENRES.indexOf(g) < 0 && !!(g))
								.map(genre => {
									let isSelected = (genres.indexOf(genre) >= 0)

									return (
										<li
											key={genre}
											data-genre={genre}
											data-parent="false"
											data-active={isSelected}
											className={`cursor-pointer violator violator--${isSelected ? 'active' : 'inactive'} violator--pill`}
											style={{ marginBottom: '0.5rem' }}
											onClick={this.onClick}>
											{isSelected ? <IconClose /> : <IconPlus />} {genre}
										</li>
									)
								})
							}
						</Fragment>
					)}
				</ul>
			</Fragment>
		)
	}
}

const mapStateToProps = ({ app, user }) => ({
	user: user.user,
	genres: user.genres,
	_genres: user._genres
})

const mapDispatchToProps = dispatch => {
	return {
		fetchSimilarGenres: (genres, callback) => {
			dispatch(UserActions.apiFetchSimilarGenres(genres, callback))
		}
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(GenreSelector)
)
