import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Link, Prompt } from 'react-router-dom'

import union from 'lodash/union'
import reduce from 'lodash/reduce'
import isBoolean from 'lodash/isBoolean'
import isRegExp from 'lodash/isRegExp'
import isObject from 'lodash/isObject'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import clone from 'lodash/clone'
import keys from 'lodash/keys'
import moment from 'moment'

import { COMPLETED_FIELDS_KEY } from './../constants.jsx'
import { DEFAULT_SHOWS } from './../constants.computed.jsx'
import * as AppActions from './../redux/actions/app.jsx'
import ShowActions from './../redux/actions/shows.jsx'

import { track } from './../helpers/analytics.jsx'
import { requestOnce, upload } from './../helpers/request.jsx'
import { delay } from './../helpers'

import ShowModel from './../shows/models/shows.jsx'
import { Loader } from './../common/loader.jsx'
import Footer from './../common/footer.jsx'
import { IconOpenInNew } from './../common/icons.jsx'
import Artwork from './components/artwork.jsx'
import AddShowGenres from './components/add-show-genres.jsx'
import AddShowProgress from './components/add-show-progress.jsx'
import Marketing from './../home/components/marketing.jsx'
import ShowShare from './../shows/components/showshare.jsx'
import ShowPromo from './../shows/components/showpromo.jsx'

import {
	StepOne,
	StepTwo,
	StepThree,
	StepFour,
	StepFive
} from './steps-lazy.jsx'

class AddShow extends Component {
	constructor(props) {
		super(props)

		this.artwork = {}

		this.state = {
			update: new Date().getTime(),
			promptGenres: false,

			// Required Rules
			required: [{
				valid: false,
				artwork: {}
			}, {
				valid: false,
				date: /./g
			}, {
				valid: false,
				lineup: []
			}, {
				valid: false,
				venue: {}
			}, {
				valid: true
			}]
		}
	}

	componentDidMount() {
		if (typeof window !== 'undefined') {
			window.scrollTo(0, 0)
		}

		this.props.clearAddShow()
		this.props.loadClear()
		this.displayShowStep()
	}

	componentWillUnmount() {
		window.onbeforeunload = () => {}
	}

	componentWillReceiveProps(nextProps) {
		const { step } = nextProps.match.params.step

		if (step !== this.props.match.params.step) {
			if (nextProps.editShow) {
				track('edit_show', {
					action: `step ${nextProps.match.params.step}`
				})
			}
			else {
				track('add_show', {
					action: `step ${nextProps.match.params.step}`
				})
			}
		}

		this.displayShowStep(nextProps)
	}

	componentDidUpdate(prevProps, prevState) {
		let hasEdit = !!(this.props.editShow)
		let _prevShow = prevProps.editShow || prevProps.addShow
		let _show = this.props.editShow || this.props.addShow
		let showChange = !isEqual(_prevShow, _show)
		let stepChange = (prevProps.match.params.step !== this.props.match.params.step)

		if (hasEdit && (showChange || stepChange)) {
			this._formValidate()
		}

		if (!showChange) {
			return
		}

		this.displayShowStep(prevProps)
	}

	shouldComponentUpdate(nextProps, nextState) {
		const { userLocation } = nextProps
		const { match } = nextProps.match.params
		const nextStep = (nextProps.match.params.step || 1) - 1
		const step = (this.props.match.params.step || 1) - 1

		return (
			(userLocation && this.props.userLocation && userLocation.name !== this.props.userLocation.name) ||
			!isEqual(nextProps.addShow, this.props.addShow) ||
			!isEqual(nextProps.editShow, this.props.editShow) ||
			!isEqual(nextProps.match.params, this.props.match.params) ||
			nextProps.match.params.step !== this.props.match.params.step ||
			!isEqual(nextProps.progress, this.props.progress) ||
			nextProps.viewportName !== this.props.viewportName ||
			nextProps.messageId !== this.props.messageId ||
			!isEqual(nextState.required, this.state.required) ||
			nextState.required[nextStep].valid !== this.state.required[step].valid ||
			nextState.formHasChanged !== this.state.formHasChanged ||
			nextState.required !== this.state.required ||
			nextState.update !== this.state.update ||
			nextState.promptGenres !== this.state.promptGenres
		)
	}

	displayShowStep = (nextProps) => {
		let { match, addShow, editShow } = nextProps || this.props
		let { params } = match ? match : { params: {} }
		let didNotStartProperly = (!this.state.required[1].valid && parseInt(params.step) > 2)

		// Remove `artwork` so we never evaluate
		let _addShow = clone(editShow || addShow)
		let _addShowProps = clone(this.props.editShow || this.props.addShow)

		_addShow.artwork = _addShowProps.artwork = null

		// Only evaluate artwork on step 1, or if we're editing
		if (!isEqual(_addShow, _addShowProps) || params.step === '1' || this.props.editShow) {
			this._formValidate()
		}

		if (!params.step || didNotStartProperly) {
			this.props.history.push(params.slug ? `/shows/${params.slug}/edit/1` : '/add/1')
		}

		// Prompt for Genres
		if (params.step === '4') {
			if (this.props.match.params.step === '3') {
				if (_addShow.genres < 3) {
					this.props.history.replace(params.slug ? `/shows/${params.slug}/edit/3` : `/add/3`)
					return this.setState({ promptGenres: true })
				}
			}
		}
	}

	onUpload = ({ direction, percent, total, loaded }) => {
		const { messageId } = this.props

		percent = Math.round((typeof percent === 'number') ? percent : 0)

		// Upload Progress
		if (direction === 'upload') {
			if (percent < 100) {
				this.props.setNotification({
					id: messageId || new Date().getTime(),
					status: 'info',
					sticky: true,
					children: (
						<div className="notification-progress">
							<div className="flex">
								<h4 className="typography-small-headline text-uppercase" style={{ flexGrow: 1 }}>
									Uploading Artwork
								</h4>
								<h4 className="typography-small-headline text-uppercase">
									{percent}%
								</h4>
							</div>
							<Loader size="full" progress={percent} />
						</div>
					)
				})
			}
			// Success
			else {
				this.props.clearNotifications()

				delay(() => {
					this.props.setNotification({
						status: 'success',
						message: 'Uploaded Artwork Successfully!'
					})
				}, 300)
			}
		}
	}

	uploadArtwork = () => {
		let {
			addShow,
			editShow,
			setNotification
		} = this.props

		let _addShow = editShow || addShow

		// No artwork? Don't bother
		if (!_addShow.artwork) {
			return
		}

		let artworkPreview = _addShow.artwork.preview || ''
		let data = {
			file: _addShow.artwork,
			name: _addShow.artwork_name,
			tags: _addShow.artwork_tags,
			crop: {
				area: _addShow.artwork_croppedArea,
				areaPixels: _addShow.artwork_croppedAreaPixels,
				ui: _addShow.artwork_croppedUI,
			},
		}

		if (artworkPreview.search(new RegExp(/blob/gi)) < 0) {
			return
		}

		this.props.clearNotifications()

		upload(`/upload/image`, data, this.onUpload)
			.end((err, reply) => {
				if (!reply) {
					return
				}

				let { status, body } = reply

				if (err || !body) {
					return setNotification({
						status: 'error',
						title: 'Problem with your artwork',
						message: status === 413 ?
							'Sorry, the file size was too large. Please upload a smaller flyer image.' :
							'Sorry, there was an error uploading your artwork. Please, return to the upload step and try again.',
						action: {
							label: 'Try again',
							icon: 'refresh',
							callback: () => {
								this.props[editShow ? 'updateEditShow' : 'updateAddShow']({
									artwork: null
								})

								return this.props.history.push('/add/1')
							}
						}
					})
				}

				if (_addShow.artwork) {
					if (typeof window !== 'undefined') {
						window.URL.revokeObjectURL(_addShow.artwork.preview)
					}
				}

				this.artwork = body.artwork

				this.props[editShow ? 'updateEditShow' : 'updateAddShow']({
					artwork: body.artwork
				})

				track('upload', {
					action: 'success',
				})
			})
	}

	onInputChange = ({ target }) => {
		let { addShow, editShow } = this.props
		let { name, value } = target
		let _addShow = editShow || addShow
		let query = {}

		// If user clicks a checkbox again, let's deselect
		if (target.type === 'checkbox' && value === _addShow[name]) {
			value = null
		}

		this.props[editShow ? 'updateEditShow' : 'updateAddShow']({
			[name]: value
		})
	}

	onLineupSelect = (lineup) => {
		let { editShow, addShow, match } = this.props
		let { params } = match
		let _addShow = editShow || addShow
		let _lineup = clone(_addShow.lineup) || []
		let step = params.step || 1

		_lineup.push(lineup)

		this.props[editShow ? 'updateEditShow' : 'updateAddShow']({
			lineup: _lineup
		})
	}

	onShowSubmit = () => {
		let {
			user,
			addShow,
			loadStart,
			clearAddShow,
			resetSearch,
			setEditShow,
			setActiveShow,
			setNotification,
			clearNotifications,
			editShow,
		} = this.props

		loadStart()

		setNotification({
			status: 'info',
			message: 'Publishing your show.'
		})

		this._createShow((show) => {

			clearNotifications()
			clearAddShow()

			resetSearch()
			setActiveShow(null)
			setEditShow(null)

			localStorage.removeItem(COMPLETED_FIELDS_KEY)
			localStorage.removeItem(ShowModel.getShowlistKey())
			localStorage.removeItem('persist:shows')

			localStorage.setItem(`recache:${show.slug}`, 'recache')
			this.props.history.push(`/shows/${show.slug}`)

			// Prompt to share
			setNotification({
				status: 'info',
				children: (
					<ShowShare
						type="notification"
						headline="Spread the word"
						show={show}
						user={user}
						setNotification={setNotification}
						clearNotifications={clearNotifications} />
				),
				sticky: true
			})

			// Prompt to promote
			setNotification({
				status: 'info',
				children: (
					<ShowPromo
						show={show}
						clearNotifications={clearNotifications}
						setNotification={setNotification} />
				),
				sticky: true
			})
		})
	}

	genreClose = () => {
		this.setState({ promptGenres: false })
	}

	genreChange = (value) => {
		this.onInputChange({
			target: {
				name: 'genres',
				value,
			},
		})
	}

	_listen = () => {
		this.props.history.listen((location) => {
			if (typeof window !== 'undefined') {
				window.scrollTo(0, 0)
			}
		})
	}

	_cleanUpShow = (show) => {
		if (show.title) {
			show.title = show.title.trim()
		}

		if (show.tags && Array.isArray(show.tags)) {
			show.tags.forEach((tag) => {
				tag.value = tag.value.trim()
				tag.label = tag.label.trim()
			})
		}

		return show
	}

	_createShow = (callback) => {
		let {
			addShow,
			editShow,
			setNotification,
			clearNotifications,
			loadEnd
		} = this.props

		let { hasCreatedShow } = this.state
		let settings = {
			path: '/shows',
			method: 'post',
			data: this._cleanUpShow(addShow)
		}

		if (editShow) {
			settings = {
				path: `/shows/${editShow.slug}/edit`,
				method: 'put',
				data: this._cleanUpShow(editShow)
			}
		}

		if (hasCreatedShow) {
			return callback(hasCreatedShow)
		}

		requestOnce(settings)
			.end((err, reply) => {
				loadEnd(err) // ends loader

				if (err || !reply) {
					return
				}

				let { body } = reply

				// Handle if there is a duplicate show
				if (reply.body.type === 'warning') {
					track('warning', {
						action: 'duplicate show',
						show_id: body.slug
					})

					clearNotifications()

					return setNotification({
						status: body.type,
						title: 'A Similar Event Exists',
						message: body.message,
						sticky: 30,
						action: body.action ? {
							label: body.action.label,
							callback: () => {
								if (typeof window !== 'undefined') {
									return window.open(`${process.env.BASE_CLIENT_URL}${body.action.path}`, '_blank')
								}
							}
						} : null
					})
				}

				// Show published successfully; keep going!
				track('show', {
					action: 'create',
					show_id: body.slug
				})

				this.setState({
					hasCreatedShow: body
				})

				callback(body)
			})
	}

	_formValidate = (nextProps) => {
		let { editShow, addShow, match } = nextProps || this.props
		let { params } = match ? match : { params: {} }
		let step = params.step || 1
		let _keys = keys(this.state.required[step - 1])
		let _addShow = editShow || addShow
		let _required = clone(this.state.required)
		let _isValid = true

		for (let i = 0; i < _keys.length; i++) {
			if (_keys[i] == 'valid') {
				continue
			}

			if (!this._inputValidate(_keys[i], _addShow[_keys[i]])) {
				_isValid = false
				break
			}
		}

		_required[step - 1].valid = _isValid

		this.setState({

			// Force update rerender
			update: new Date().getTime(),

			required: _required,
		})
	}

	_inputValidate = (name, value = '') => {
		let { match } = this.props
		let { params } = match ? match : { params: {} }
		let step = params.step || 1
		let _required = this.state.required[step - 1]

		if (isRegExp(_required[name])) {
			return (value.search(_required[name]) > -1)
		}
		else if (isObject(_required[name])) {
			return isObject(value) && !isEmpty(value)
		}
		else if (Array.isArray(_required[name])) {
			return Array.isArray(value)
		}
		else if (isBoolean(_required[name])) {
			return (!!(value) === _required[name])
		}

		return (value.search(_required[name]) > -1)
	}

	_promptHandler = (location) => {
		let { addShow } = this.props
		let showInfoHasntChanged = isEqual(DEFAULT_SHOWS.addShow, addShow)
		let inAddShowFlow = location.pathname.startsWith('/add')
		let promptMessage = 'Leaving? Any show information you\'ve made may be lost.'

		return (showInfoHasntChanged || inAddShowFlow) || promptMessage
	}

	render() {
		let date = new Date().getTime()
		let {
			addShow,
			editShow,
			match,
			progress = [],
			userLocation,
			setNotification,
			viewportName,
			loadStart,
			loadEnd
		} = this.props

		let { params } = match ? match : { params: null }
		let { required, promptGenres } = this.state
		let _addShow = editShow || addShow

		return (params ? (
			<Fragment>
				<AddShowGenres
					slug={_addShow.slug}
					value={_addShow.genres}
					isVisible={promptGenres}
					viewportName={viewportName}
					onInputChange={this.genreChange}
					onClose={this.genreClose} />

				<div id="addshow" className="wrapper grid">
					<Prompt
						when={!isEqual(DEFAULT_SHOWS.addShow, addShow)}
						message={this._promptHandler} />

					<AddShowProgress
						slug={_addShow.slug}
						step={params.step}
						required={required}
						viewportName={viewportName}
						submit={this.onShowSubmit}
						progress={progress} />

					{params.step == 1 && (
						<StepOne
							addShow={_addShow}
							isValid={required[0].valid} />
					)}
					{params.step == 2 && (
						<StepTwo
							addShow={_addShow}
							isValid={required[1].valid}
							viewportName={viewportName}
							onInputChange={this.onInputChange}
							onMount={this.uploadArtwork} />
					)}
					{params.step == 3 && (
						<StepThree
							addShow={_addShow}
							isValid={required[2].valid}
							onLineupSelect={this.onLineupSelect}
							onInputChange={this.onInputChange}
							setNotification={setNotification}
							viewportName={viewportName}
							loadStart={loadStart}
							loadEnd={loadEnd}
							progress={progress} />
					)}
					{params.step == 4 && (
						<StepFour
							addShow={_addShow}
							isValid={required[3].valid}
							userLocation={userLocation}
							onInputChange={this.onInputChange}
							loadStart={loadStart}
							loadEnd={loadEnd}
							progress={progress} />
					)}
					{params.step == 5 && (
						<StepFive
							addShow={_addShow}
							isValid={required[4].valid}
							onInputChange={this.onInputChange}
							onShowSubmit={this.onShowSubmit}
							progress={progress} />
					)}
				</div>
			</Fragment>
		) : (
			<div />
		))
	}
}

const mapStateToProps = ({ app, shows, user }) => ({
	user: user.user,
	userLocation: app.userLocation,
	progress: app.progress,
	messageId: app.messageId,
	viewportName: app.viewportName,
	addShow: shows.addShow,
	editShow: shows.editShow
})

const mapDispatchToProps = dispatch => {
	return {
		loadStart: () => {
			dispatch(AppActions.loadStart())
		},

		loadEnd: (err) => {
			dispatch(AppActions.loadEnd(err))
		},

		loadClear: (err) => {
			dispatch(AppActions.loadClear(err))
		},

		setActiveShow: (show) => {
			dispatch(ShowActions.setActiveShow(show))
		},

		setEditShow: (show) => {
			dispatch(ShowActions.setEditShow(show))
		},

		setNotification: (message) => {
			dispatch(AppActions.setNotification(message))
		},

		clearNotifications: () => {
			dispatch(AppActions.clearNotifications())
		},

		resetSearch: () => {
			dispatch(AppActions.resetSearch())
		},

		clearAddShow: () => {
			dispatch(ShowActions.clearAddShow())
		},

		updateAddShow: (data) => {
			dispatch(ShowActions.updateAddShow(data))
		},

		updateEditShow: (data) => {
			dispatch(ShowActions.updateEditShow(data))
		}
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(AddShow)
)
