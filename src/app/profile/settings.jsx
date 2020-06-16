import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Textarea from 'react-textarea-autosize'
import { withRouter, NavLink, Link } from 'react-router-dom'
import { BIO_PLACEHOLDER } from './../constants.jsx'
import { toTitleCase, delay } from './../helpers'
import { track } from './../helpers/analytics.jsx'
import { requestOnce, upload } from './../helpers/request.jsx'
import GenreSelector from './../onboarding/genre-selector.jsx'
import { Loader } from './../common/loader.jsx'
import InputScenes from './../forms/input-scenes.jsx'
import AvatarUpload from './components/avatar-upload.jsx'
import * as AppActions from './../redux/actions/app.jsx'
import UserActions from './../redux/actions/user.jsx'
import InputRange from './../forms/input-range.jsx'

/**
 * Component for a `radioset`
 *
 * @param name {String} - Radioset name
 * @param value {String|Boolean|Number} - Currently active value
 * @param options {Array} - Array of options
 * @param options.label {String}
 * @param options.value {String|Boolean|Number}
 * @param onChange {Function}
 */
const RadioSet = ({ name, value, options, onChange }) => {
	return (
		<div className="form-radioset">
			{options.map((option, index) => (
				<span key={index} className="form-radio">
					<input id="weekly-yes" type="checkbox" name={name} value={option.value} onChange={onChange} checked={(value === option.value)} />
					<label htmlFor="weekly-yes">
						{option.label}
					</label>
				</span>
			))}
		</div>
	)
}

const RadioYesNo = ({ name, value, onChange }) => {
	return (
		<div className="form-radioset">
			<input id={`${name}-yes`} type="radio" value="true" name={name} onChange={onChange} checked={(value === true)} />
			<label htmlFor={`${name}-yes`} className="form-radio">
				Yes
			</label>
			<input id={`${name}-no`} type="radio" value="false" name={name} onChange={onChange} checked={(value === false)} />
			<label htmlFor={`${name}-no`} className="form-radio">
				No
			</label>
		</div>
	)
}

class Settings extends Component {
	constructor(props) {
		super(props)

		// const settings = {
		// 	bio: '',
		// 	scenes: [],
		// 	notification_weekly: false,
		// 	notification_following: false,
		// 	notification_similar: false,
		// 	notification_promoter_digest: false,
		// }

		const user = clone(this.props.user || {})

		this.state = {
			user: user,

			// Photo Props
			photo: (user && user.photo) ? user.photo : null,
			crop: (user && user.photo) ? user.photo.crop : null,
			zoom: (user && user.photo && user.photo.zoom) ? parseFloat(user.photo.zoom) : 1,
		}

		this.bioPlaceholder = BIO_PLACEHOLDER[Math.floor(Math.random() * BIO_PLACEHOLDER.length)]
	}

	componentWillMount() {
		if (!this.props.user) {
			this.props.history.push('/')
		}
	}

	componentDidMount() {
		if (typeof window === 'undefined') {
			return
		}

		const { user, fetchProfile, fetchScenes } = this.props

		window.scrollTo(0, 0)

		if (user) {
			fetchProfile(user.id)
			fetchScenes()

			if (user.photo) {
				this.setUser()
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.user !== this.props.user) {
			this.setState({ user: nextProps.user })

			if (nextProps.user.photo && nextProps.user.photo.zoom) {
				this.setUser(nextProps)
			}
		}
	}

	setUser = (props) => {
		const { user } = props || this.props

		this.setState({
			user: clone(user),

			// Photo Props
			photo: (user && user.photo) ? user.photo : null,
			crop: (user && user.photo) ? user.photo.crop : null,
			zoom: (user && user.photo && user.photo.zoom) ? parseFloat(user.photo.zoom) : 1,
		})
	}

	onBooleanChange = ({ target }) => {
		let { name, value } = target

		this.setState({
			[name]: (value === "true")
		})
	}

	onInputChange = ({ target }) => {
		const { user } = this.state
		const { name, value } = target

		// Limit `bio` to 280 characters
		if (name === 'bio' && value.length >= 280) {
			return
		}

		this.setState({
			user: {
				...user,
				[name]: value,
			}
		})
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

				delay(() => {
					this.props.setNotification({
						status: 'success',
						message: 'Uploaded Artwork Successfully!'
					})
				}, 300)
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

	onSubmit = () => {
		let { user, photo, crop, zoom = 1 } = this.state
		let data = null

		console.log('saving... ', user)
		console.log('saving... ', photo)
		console.log('saving... ', crop)
		console.log('saving... ', zoom)

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
			.then(() => {
				this.props.updateUser(user)

				track('settings', {
					action: 'update',
					source: 'settings'
				})
			})
	}

	isSettingsChange = () => {
		const { user, photo, crop, zoom } = this.state
		const hasUser = (user && this.props.user)
		const hasPhoto = (hasUser && this.props.user.photo)
		const hasCrop = (hasPhoto && this.props.user.photo.crop)
		const hasZoom = (hasPhoto && parseFloat(this.props.user.photo.zoom))
		const userChange = !isEqual(user, this.props.user)
		const photoChange = (
			hasPhoto && !isEqual(photo, this.props.user.photo || null)
		)

		const cropChange = (
			(hasCrop && !isEqual(crop, this.props.user.photo.crop)) ||
			(!hasPhoto && photo && crop)
		)

		const zoomChange = (
			(hasZoom && !isEqual(zoom, parseFloat(this.props.user.photo.zoom))) ||
			(!hasPhoto && photo && zoom !== 1)
		)

		// console.log(this.state, this.props)
		// console.log('user ', user, this.props.user)
		// console.log('photo, this.props.user.photo: ', photo, this.props.user.photo)
		// console.log('photoChange ', photoChange)
		// console.log('cropChange ', cropChange)
		// console.log('zoomChange ', zoomChange, zoom, hasPhoto && parseFloat(this.props.user.photo.zoom))
		// console.log('zoomChange prop 1 ', (hasPhoto && !isEqual(zoom, parseFloat(this.props.user.photo.zoom))))

		return (userChange || photoChange || cropChange || zoomChange)
	}

	render() {
		const { user } = this.state
		const { photo, crop, zoom } = this.state
		const { progress = [], scenes } = this.props
		const settingsChange = this.isSettingsChange()

		const canSave = (settingsChange && progress.indexOf('app') < 0)

		return (
			<div id="settings">
				<div className="grid">
					<div className="row hero-sticky">
						<div className="col col-6-of-12 col-m-6-of-8 col-s-6-of-6 center relative">

							<div className="flex flex--center" style={{ margin: '4rem 0 0.5rem' }}>
								<div className="flex-grow typography-hero-headline">Settings</div>
								<button
									className={`btn inlineblock ${canSave ? 'btn--primary' : 'btn--disabled'}`}
									onClick={this.onSubmit}>
									Save changes
								</button>
							</div>

						</div>
					</div>

					<div className="row">
						<div className="col col-6-of-12 col-small-12-of-12 center relative">

							<div id="profile-settings">
								<div className="bubble">
									<ul className="form-table-v2">
										<li className="flex flex--center" style={{ padding: '1rem 1rem 0 0' }}>
											<div className="flex-grow">
												<label className="form-label form-label--nopadding color-accent-two">{user.photo ? 'Change Profile Photo' : 'Upload Profile Photo'}</label>
												<p className="typography-small" style={{ marginBottom: '1rem' }}>176px x 176px recommended. 3mb maximum.</p>
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

										<h3 className="typography-body-headline text-uppercase">Profile</h3>
										<li>
											<input type="text" name="firstName" className="form-input text-right" value={user.firstName} placeholder="Name" onChange={this.onInputChange} />
											<label className="form-label form-label--center form-label--overlay">Name</label>
										</li>
										<li>
											<input type="text" name="username" className="form-input text-right" value={user.username} placeholder="Username" readOnly={true} />
											<label className="form-label form-label--center form-label--overlay">Username</label>
										</li>
										<li>
											<input type="text" name="email" className="form-input text-right" value={user.email} placeholder="Email address" onChange={this.onInputChange} />
											<label className="form-label form-label--center form-label--overlay">Email</label>
										</li>
										<li>
											<Textarea
												name="bio"
												value={user.bio}
												className="form-textarea typography-body widthfull"
												placeholder={this.bioPlaceholder}
												onChange={this.onInputChange}
												minRows={2}
												maxRows={4} />
											<label className="form-label">Short Bio</label>
										</li>
										<li style={{ marginTop: '2rem' }}>
											<GenreSelector
												label="Genres"
												onChange={this.onInputChange} />
										</li>
										{/*<li className="form-autocomplete form-autocomplete--left">
											<label className="form-label">Music Scenes</label>
											<div className="form-input text-left">
												<InputScenes
													name="scenes"
													scenes={scenes}
													value={user.scenes}
													className="input-scenes"
													onInputChange={this.onInputChange} />
											</div>
										</li>*/}
									</ul>
								</div>

								{/*<div className="text-right" style={{ marginBottom: '2rem' }}>
									<button
										className={`btn inlineblock ${canSave ? 'btn--primary' : 'btn--disabled'}`}
										onClick={this.onSubmit}>
										Save changes
									</button>
								</div>*/}

								<h3 className="typography-body-headline text-uppercase" style={{ marginTop: '4rem' }}>Notifications</h3>
								<div className="bubble">
									<ul className="form-table-v2">
										<li className="option">
											<div className="option-label">
												<label className="form-label form-label--nopadding color-secondary">Weekly Shows Summary</label>
												<p className="typography-small">Get the best upcoming and past shows based on your listening history.</p>
											</div>
											<div className="option-control">
												<RadioYesNo name="notification_weekly" value={user.notification_weekly} onChange={this.onBooleanChange} />
											</div>
										</li>

										<li className="option">
											<div className="option-label">
												<label className="form-label form-label--nopadding color-secondary">Similar Artists</label>
												<p className="typography-small">Get alerts when artists we think you'll love are playing nearby.</p>
											</div>
											<div className="option-control">
												<RadioYesNo name="notification_similar" value={user.notification_similar} onChange={this.onBooleanChange} />
											</div>
										</li>

										<li className="option">
											<div className="option-label">
												<label className="form-label form-label--nopadding color-secondary">Following Artists</label>
												<p className="typography-small">Get alerts when artists you follow are playing nearby.</p>
											</div>
											<div className="option-control">
												<RadioYesNo name="notification_following" value={user.notification_following} onChange={this.onBooleanChange} />
											</div>
										</li>

										{user.type === 'promoter' && (
											<li className="option">
												<div className="option-label">
													<label className="form-label form-label--nopadding color-secondary">Promoter Summary</label>
													<p className="typography-small">Get a weekly summary of your upcoming events to verify accuracy.</p>
												</div>
												<div className="option-control">
													<RadioYesNo name="notification_promoter_digest" value={user.notification_promoter_digest} onChange={this.onBooleanChange} />
												</div>
											</li>
										)}
									</ul>
								</div>
								<div className="text-right" style={{ marginBottom: '2rem' }}>
									<button
										className={`btn inlineblock ${canSave ? 'btn--primary' : 'btn--disabled'}`}
										onClick={this.onSubmit}>
										Save changes
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = ({ user, app }) => ({
	user: user.user,

	messageId: app.messageId,
	viewportName: app.viewportName,
	progress: app.progress,
	scenes: app.scenes
})

const mapDispatchToProps = dispatch => {
	return {
		loadStart: () => {
			dispatch(AppActions.loadStart())
		},

		loadEnd: () => {
			dispatch(AppActions.loadEnd())
		},

		fetchScenes: () => {
			dispatch(AppActions.fetchScenes())
		},

		setNotification: (message) => {
			dispatch(AppActions.setNotification(message))
		},

		clearNotifications: () => {
			dispatch(AppActions.clearNotifications())
		},

		updateUser: (user) => {
			dispatch(UserActions.updateUser(user, true))
		},

		fetchProfile: (user_id) => {
			dispatch(UserActions.apiFetchProfile(user_id))
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
