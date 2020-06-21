import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'
import isFunction from 'lodash/isFunction'
import defaults from 'lodash/defaults'
import clone from 'lodash/clone'
import keys from 'lodash/keys'
import find from 'lodash/find'
import URI from 'urijs'
import moment from 'moment'
import UsernameGenerator from './../../helpers/username-generator.jsx'
import ShowModel from './../../shows/models/shows.jsx'
import { IS_APP, DEBUG, SURVEY_ID_RECOMMENDATIONS, PARENT_GENRES } from './../../constants.jsx'
import InputScenes from './../../forms/input-scenes.jsx'
import InputEmail from './../../forms/input-email.jsx'
import InputRange from './../../forms/input-range.jsx'
import * as AppActions from './../../redux/actions/app.jsx'
import UserActions from './../../redux/actions/user.jsx'
import ShowActions from './../../redux/actions/shows.jsx'
import { track, register } from './../../helpers/analytics.jsx'
import { requestPublic, upload } from './../../helpers/request.jsx'
import { delay, cleanUser, getCurrentDate } from './../../helpers'
import AvatarUpload from './../../profile/components/avatar-upload.jsx'
import GenreSelector from './../../onboarding/genre-selector.jsx'
import { IconChevron } from './../../common/icons.jsx'
import Progress from './../../common/progress.jsx'
import { Loader } from './../../common/loader.jsx'

const uri = new URI()

const DEFAULT_USER = {
	username: '',
	firstName: '',
	email: '',
	zip: '',
	genres: []
}

const ERROR_MESSAGES = {
	firstName: [
		'What should we call you?'
	],
	username: [
		'Get gnarly, make up a username.',
		'Great minds think alike. This name is unfortunately, taken.'
	],
	zip: [],
	scenes: [
		'Select all communities that apply.'
	]
}

const ModalEditControl = (props) => {
	const {
		step,
		user,
		firstName,
		username,
		email,
		scenes,
		zip,
		genres,
		nextStep,

		updateUser,
		updateUserPassive,
		progress = [],
		closeModal
	} = props

	const zipValid = (zip.valid && user.zip.length === 5)
	const hasGenres = (
		isObject(genres) && Array.isArray(genres.value) && genres.value.length > 0 ||
		user && Array.isArray(user.genres) && user.genres.length > 0
	)

	const hasTopArtists = (Array.isArray(user.top_artists) && user.top_artists.length > 0)
	const hasLocation = (
		IS_APP ||
		(progress.indexOf('userLocation') >= 0) ||
		(zip.valid || scenes.valid)
	)

	console.log('zip.valid || scenes.valid ', zip.valid, scenes.valid)

	const firstStepValid = (
		firstName.valid &&
		username.valid &&
		email.valid
	)

	return (
		<div className="modal-controls">
			{/*Step 1*/}
			{(step === 1) && (
				firstStepValid ? (
					<button id="editprofile-next" type="submit" className="btn btn--round btn--success" onClick={(evt) => {
						evt.preventDefault()

						if (user.spotify_connect && hasTopArtists) {
							updateUser(evt)

							track('editprofile', {
								action: 'complete',
								source: 'modal editprofile'
							})

							return
						}

						updateUserPassive(evt)
						nextStep(2)

						track('editprofile', {
							action: 'next',
							source: 'modal editprofile'
						})
					}}>
						{(user.spotify_connect && hasTopArtists) ? (
							<Fragment>
								Final Step <span style={{ marginRight: '-12px' }}><IconChevron /></span>
							</Fragment>
						) : (
							<Fragment>
								Next, the music <span style={{ marginRight: '-12px' }}><IconChevron /></span>
							</Fragment>
						)}
					</button>
				) : (
					<button className="btn btn--round btn--disabled">
						Please complete all fields
					</button>
				)
			)}

			{/*Step 2*/}
			{(step === 2) && (
				<Fragment>
					<button
						id="editprofile-finish"
						type="submit"
						className="btn btn--primary btn--noborder"
						style={{ width: 'auto' }}
						onClick={(evt) => {
							evt.preventDefault()

							updateUser(evt)

							track('editprofile', {
								action: 'incomplete',
								source: 'modal editprofile'
							})
						}}>
						Later
					</button>

					{(hasGenres && progress.indexOf('app') < 0) ? (
						<button
							id="editprofile-finish"
							type="submit"
							className="btn btn--round btn--success"
							onClick={(evt) => {
								evt.preventDefault()

								updateUser(evt)

								track('editprofile', {
									action: 'complete',
									source: 'modal editprofile'
								})
							}}>
							Finish
						</button>
					) : (
						<button
							id="editprofile-finish"
							type="submit"
							className="btn btn--round btn--disabled"
							style={{ pointerEvents: 'auto' }}
							onClick={(evt) => {
								evt.preventDefault()

								updateUser(evt)

								track('editprofile', {
									action: 'incomplete',
									source: 'modal editprofile'
								})
							}}>
							Select a Genre
						</button>
					)}
				</Fragment>
			)}
		</div>
	)
}

class ModalEditProfile extends Component {
	constructor(props) {
		super(props)

		let _user = clone(props.user)

		// No username, no problem!
		_user.username = this._generateUsername(_user)

		this.validationRules = {
			firstName: {
				regex: /.+/g
			},
			username: {
				regex: /.+/g,
				request: (id, value) => requestPublic({ path: `/auth/id/${id}/username/${value}` })
			},
			zip: {
				regex: /[0-9]{5}/g
			},
			scenes: {
				regex: [],
				exclude: {
					value: 'Other',
					label: 'Other'
				}
			}
		}

		this.state = {

			step: 1,

			// user clone
			user: defaults(_user, DEFAULT_USER),

			// Inputs
			firstName: {
				valid: null,
				message: ''
			},
			username: {
				valid: null,
				message: ''
			},
			email: {
				valid: null,
				message: ''
			},
			zip: {
				valid: null
			},
			lineup: {
				valid: null,
				message: ''
			},
			scenes: {
				valid: null
			},

			// Photo
			photo: (_user && _user.photo) ? _user.photo : null,
			crop: (_user && _user.photo) ? _user.photo.crop : null,
			zoom: (_user && _user.photo && _user.photo.zoom) ? _user.photo.zoom : 1,
		}

		this._validate = this._validate.bind(this)
		this._validClass = this._validClass.bind(this)
		this._generateUsername = this._generateUsername.bind(this)
	}

	componentDidMount() {
		let { user, location, userLocation, close } = this.props
		let query = new URI(location.search).query(true)
		let _keys = keys(DEFAULT_USER)

		for (let i = 0; i < _keys.length; i++) {
			this._validate({
				name: _keys[i],
				value: this.state.user[_keys[i]]
			})
		}

		if (user && user.photo) {
			this.setUser()
		}

		if (user && !user.spotiy_connect && query.step === '2') {
			this.nextStep(2)
		}

		if (user && userLocation) {
			this.onInputChange({
				target: {
					name: 'scenes',
					value: [{
						value: userLocation.id,
						label: userLocation.name
					}]
				}
			})
		}

		this.focusFirstField()
		this.props.fetchScenes()
	}

	componentDidUpdate(prevProps, prevState) {
		let { userLocation } = prevProps

		if (prevState.step !== this.state.step) {
			this.focusFirstField()
		}

		if (userLocation && !prevState.user.scenes) {
			this.onInputChange({
				target: {
					name: 'scenes',
					value: [{
						value: userLocation.id,
						label: userLocation.name
					}]
				}
			})
		}
	}

	// Set users location if we get it
	componentWillReceiveProps(nextProps) {
		let { match, scenes, userLocation } = nextProps
		let target = {
			name: 'zip',
			value: ''
		}

		if (!isEqual(scenes, this.props.scenes) ||
			!isEqual(userLocation, this.props.userLocation)) {
			let scene = find(scenes, scene => scene.name === userLocation.name)

			if (scene) {
				target = {
					name: 'scenes',
					value: [{
						value: scene.id,
						label: scene.name
					}]
				}
			}
			else if (userLocation.zip) {
				target = {
					name: 'zip',
					value: `${userLocation.zip || ''}`
				}
			}

			this.onInputChange({ target })
		}
	}

	setUser = (props) => {
		const { user: _user } = props || this.props

		let user = clone(_user)

		user.username = this._generateUsername(user)

		this.setState({
			user,

			// Photo Props
			photo: (user && user.photo) ? user.photo : null,
			crop: (user && user.photo) ? user.photo.crop : null,
			zoom: (user && user.photo && user.photo.zoom) ? user.photo.zoom : 1,
		})
	}

	focusFirstField = () => {
		let inputFields = this.formEl ? this.formEl.querySelectorAll('input') : []

		// Autofocus the first blank field
		for (let i = 0; i < inputFields.length; i++) {
			if (!inputFields[i].value) {
				inputFields[i].focus()
				break
			}
		}
	}

	onBlur = ({ target }) => {
		this._validate(target)
	}

	onInputChange = ({ target }) => {
		let { name, value, valid, message } = target
		let _user = defaults({ [name]: value }, clone(this.state.user))

		this.setState({
			user: _user,
			[name]: target,
		})

		this._validate(target)
	}

	onPhotoChange = (photo) => {
		if (!photo) {
			return this.setState({ photo, crop: null, zoom: 1 })
		}

		this.setState({ photo })
	}

	onPhotoCropChange = (crop) => {
		this.setState({ crop })
	}

	onPhotoZoomChange = (zoom) => {
		this.setState({ zoom })
	}

	onImageLoaded = (imageSize) => {
		let zoomWidth = Math.ceil(88 / imageSize.width)
		let zoomHeight = Math.ceil(88 / imageSize.height)

		if (zoomWidth > 1 || zoomHeight > 1) {
			this.onPhotoZoomChange(Math.max(zoomWidth, zoomHeight))
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
			}
		}
	}

	uploadPhoto = (data, user) => {
		return new Promise(resolve => {
			if (!data || (data && !data.file)) {
				return resolve(user)
			}

			this.props.loadStart()

			upload(`/upload/image`, data, this.onUpload)
				.end((err, reply) => {
					this.props.loadEnd()

					if (!reply) {
						return resolve(user)
					}

					let { status, body } = reply

					if (err || !body) {
						this.props.setNotification({
							status: 'error',
							title: 'Problem with your photo',
							message: status === 413 ?
								'Sorry, the file size was too large. Please upload a smaller flyer image.' :
								'Sorry, there was an error uploading your artwork. Please, return to the upload step and try again.',
						})

						return resolve(user)
					}

					track('upload:success', {})

					if (user.photo) {
						if (typeof window !== 'undefined') {
							window.URL.revokeObjectURL(user.photo.preview)
						}
					}

					user.photo = body.artwork

					return resolve(user)
				})
		})
	}

	updateUser = (evt) => {
		let { user, close, updateUser, setHomeTutorial, history } = this.props
		let redirectAfterLogin = localStorage.getItem('next')
		let userReduced = cleanUser(this.state.user)

		if (IS_APP && isFunction(window.ReactNativeWebView.postMessage)) {
			window.ReactNativeWebView.postMessage('editprofile-finish')
		}
		else {
			close(evt)
		}

		if (Array.isArray(userReduced.genres)) {
			userReduced.genres = userReduced.genres.splice(0, 20)
		}

		// Clear any cached `showlist`
		ShowModel.clearShowlist()

		register(userReduced)
		updateUser(this.state.user, true)

		// Handles any redirects after signup
		if (user && redirectAfterLogin) {
			localStorage.removeItem('next')
			history.push(redirectAfterLogin)
		}

		track('register', {
			action: 'register',
		})

		// Ask user about their recommendations
		if (typeof _sva !== 'undefined' &&
			typeof _sva.showSurvey !== 'undefined') {
			_sva.showSurvey(SURVEY_ID_RECOMMENDATIONS, {
				forceDisplay: true,
				displayMethod: 'onScroll',
				displayOptions: {
					scrolledPercentage: 30
				}
			})
		}
	}

	updateUserPassive = (evt, type) => {
		ShowModel.clearShowlist()

		this.props.updateUserPassive(this.state.user)

		if (type === 'later') {
			this.props.fetchShowList({
				sort: 'best',
				from: getCurrentDate()
			})
		}

		track('register', {
			action: 'incomplete',
		})
	}

	nextStep = (step) => {
		this.setState({ step })

		let { user, photo, crop, zoom = 1 } = this.state
		let data = null

		// Let's upload an avatar
		if (photo && photo.file) {
			data = {
				...photo,
				zoom,
				crop: {
					...crop,
				},
			}
		}
		// Removed photo
		else if (!photo) {
			user.photo = null
		}
		// We already have an uploaded avatar
		else if (user.photo && crop) {
			user.photo = {
				...user.photo,
				zoom,
				crop: {
					...crop,
				}
			}
		}

		this.uploadPhoto(data, user)
			.then(user => {
				this.props.updateUserPassive(user)
			})
	}

	_validate({ name, value }) {
		// Email handles itself
		if (name === 'email' || name === 'genres') {
			return
		}

		let { user } = this.state
		let { loadStart, loadEnd } = this.props
		let _request = this.validationRules[name].request
		let isValid = false
		let isExcluded

		if (Array.isArray(this.validationRules[name].regex)) {
			isExcluded = (value.length === 1 && JSON.stringify(value).indexOf(JSON.stringify(this.validationRules[name].exclude)) >= 0)
			isValid = (value.length > 0 && !isExcluded)
		}
		else if (typeof value === 'string') {
			isValid = !!(value.match(this.validationRules[name].regex))
		}

		this.setState({
			[name]: {
				valid: isValid,
				message: isValid ? '' : ERROR_MESSAGES[name][0]
			}
		})

		if (_request) {
			delay(() => {
				_request(user.id, value)
					.end((err, reply) => {
						if (!reply || !reply.text || reply.text === user[name]) {
							return
						}

						this.setState({
							[name]: {
								valid: false,
								message: ERROR_MESSAGES[name][1]
							}
						})
					})
			}, 500)
		}
	}

	_validClass(valid) {
		if (valid === null) {
			return ''
		}
		else if (valid) {
			return 'form--valid'
		}

		return 'form--invalid'
	}

	_generateUsername(user) {
		let num = Math.round(Math.random() * 10000)
		let username = UsernameGenerator()

		if (user.firstName) {
			username = user.firstName.replace(/\s|-|_/g, '').toLowerCase()
		}

		return `${username}${num}`
	}

	render() {
		let {
			user,
			firstName,
			username,
			email,
			zip,
			scenes,

			photo,
			crop,
			zoom,
		} = this.state

		let { progress, progressName, close } = this.props

		const hasTopArtists = (Array.isArray(user.top_artists) && user.top_artists.length > 0)
		const hasScenes = (Array.isArray(this.props.scenes) && this.props.scenes.length > 0)
		const zipRequired = (!IS_APP && (!user.scenes || user.scenes.length === 0))

		return (
			<form
				id="modal-editprofile"
				className="modal-content"
				ref={node => this.formEl = node}
				onSubmit={evt => evt.preventDefault()}
				action="#">

				{([ 'profile', 'search:spotify' ].indexOf(progressName) >= 0) && (
					<Progress />
				)}

				<div className="modal-header">
					<ModalEditControl
						{...this.state}
						closeModal={close}
						progress={progress}
						updateUser={this.updateUser}
						updateUserPassive={this.updateUserPassive}
						nextStep={this.nextStep} />
				</div>

				{this.state.step === 1 && (
					<div className="modal-step modal-scroll">
						<div className="row">
							<div className="modal-copy col col-12-of-12 center">
								<h2 className="typography-headline">Welcome!</h2>
								<h3 className="typography-subheadline">Please, confirm your profile</h3>

								<ul className="form-table-v2">
									<li className="flex flex--center">
										<div className="flex-grow">
											<label className="form-label form-label--nopadding">{(user.photo || user.avatar) ? 'Change Profile Photo' : 'Upload Profile Photo'}</label>
											<p className="typography-small" style={{ marginBottom: '1rem' }}>176px x 176px recommended.<br />3mb maximum.</p>
										</div>
										<div>
											<AvatarUpload
												zoom={zoom}
												cropSize={{ width: 88, height: 88 }}
												onImageLoaded={this.onImageLoaded}
												onPhotoChange={this.onPhotoChange}
												onCropChange={this.onPhotoCropChange} />

											{photo && (
												<InputRange
													value={zoom}
													onChange={this.onPhotoZoomChange}
													step={0.25}
													min={1}
													max={3} />
											)}
										</div>
									</li>
									<li className={this._validClass(firstName.valid)}>
										<input
											type="text"
											id="editprofile-name"
											name="firstName"
											spellCheck="false"
											autoCorrect="off"
											className="form-input text-right"
											value={user.firstName}
											onBlur={this.onBlur}
											onChange={this.onInputChange} />
										<label htmlFor="editprofile-name" className="form-label form-label--center form-label--overlay">Name</label>
									</li>

									<li className={`${this._validClass(username.valid)} form-message`}>{username.message}</li>
									<li className={this._validClass(username.valid)}>
										<input
											type="text"
											id="editprofile-username"
											name="username"
											spellCheck="false"
											autoCorrect="off"
											autoComplete="off"
											className="form-input text-right"
											pattern="[a-zA-Z0-9-_]"
											value={user.username}
											onBlur={this.onBlur}
											onChange={(evt) => {
												if (evt.target && evt.target.value) {
													evt.target.value = evt.target.value.replace(/[^A-Za-z0-9-_]/g, '')
												}

												return this.onInputChange(evt)
											}}
											readOnly={!!(this.props.user.username)} />
										<label htmlFor="editprofile-username" className="form-label form-label--center form-label--overlay">Username</label>
									</li>

									{(hasScenes && zipRequired) && (
										<li className={this._validClass(zip.valid)}>
											<input type="text" id="editprofile-zip" name="zip" spellCheck="false" autoCorrect="off" autoComplete="off" className="form-input text-right" value={user.zip} onChange={this.onInputChange} />
											<label htmlFor="editprofile-zip" className="form-label form-label--center form-label--overlay">Zip Code</label>
										</li>
									)}

									<li className={`${email.validClass} form-message`}>{email.message}</li>
									<li className={email.validClass}>
										<InputEmail
											id="editprofile-email"
											className="form-input text-right"
											userId={user.id}
											validateDupes={true}
											value={user.email}
											onInputChange={this.onInputChange} />
										<label htmlFor="editprofile-email" className="form-label form-label--center form-label--overlay">Email</label>
									</li>
								</ul>
							</div>
						</div>
					</div>
				)}

				{this.state.step === 2 && (
					<div className="modal-step modal-scroll">
						<div className="row overflowhidden">
							<div className="modal-copy col col-12-of-12 center">
								<h2 className={`typography-${this.props.viewportName === 'small' ? 'subheadline' : 'headline'}`}>What are your favorite genres?</h2>
								<h3 className="typography-subheadline">You can always change these in settings.</h3>
								<GenreSelector
									onChange={this.onInputChange} />
							</div>
						</div>
					</div>
				)}

				<div className="modal-footer">
					<ModalEditControl
						{...this.state}
						closeModal={close}
						progress={progress}
						updateUser={this.updateUser}
						updateUserPassive={this.updateUserPassive}
						nextStep={this.nextStep} />
				</div>
			</form>
		)
	}
}

const mapStateToProps = ({ app, user }) => ({
	user: user.user,

	messageId: app.messageId,
	progress: app.progress,
	progressName: app.progressName,
	viewportName: app.viewportName,
	scenes: app.scenes,
	userLocation: app.userLocation
})

const mapDispatchToProps = dispatch => {
	return {
		verifyUserLogin: (query) => {
			dispatch(UserActions.verifyUserLogin(query))
		},

		updateUser: (user, recache) => {
			dispatch(UserActions.updateUser(user, recache))
		},

		updateUserPassive: (user) => {
			dispatch(UserActions.updateUserPassive(user))
		},

		fetchShowList: (query) => {
			dispatch(ShowActions.apiFetchShowList(query))
		},

		setHomeTutorial: (run) => {
			dispatch(AppActions.setHomeTutorial(run))
		},

		loadStart: (name) => {
			dispatch(AppActions.loadStart(name))
		},

		loadEnd: (err, name) => {
			dispatch(AppActions.loadEnd(err, name))
		},

		fetchScenes: () => {
			dispatch(AppActions.fetchScenes())
		},

		setNotification: (notification) => {
			dispatch(AppActions.setNotification(notification))
		},

		clearNotifications: () => {
			dispatch(AppActions.clearNotifications())
		}
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(ModalEditProfile)
)
