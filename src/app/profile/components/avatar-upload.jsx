import isEqual from 'lodash/isEqual'
import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import Cropper from 'react-easy-crop'
import * as AppActions from './../../redux/actions/app.jsx'
import UserActions from './../../redux/actions/user.jsx'
import { IconClose, IconImageAdd, IconMove } from './../../common/icons.jsx'
import { Range } from 'react-range'

const DEFAULT_STATE = {
	image: null,
	crop: { x: 0, y: 0 },
	zoom: 1,
	minZoom: 1,
	aspect: 1,
	cropShape: 'round',
	isInteracting: false,
}

class AvatarUpload extends Component {
	static propTypes = {
		zoom: PropTypes.number,
		cropSize: PropTypes.object,
		onPhotoChange: PropTypes.func.isRequired,
		onCropChange: PropTypes.func.isRequired,
		setNotification: PropTypes.func,
	}

	state = {
		...DEFAULT_STATE,
		image:
			(this.props.user && this.props.user.photo) ?
			this.props.user.photo.secure_url : null,
	}

	componentWillMount() {
		if (!this.props.user) {
			return
		}

		const { user } = this.props
		const { photo, photo_croppedUI } = user

		if (photo) {
			this.setState({
				image: photo.preview || photo.secure_url,
				crop: photo.crop && photo.crop.ui ? photo.crop.ui : photo_croppedUI ? photo_croppedUI : this.state.crop,
				zoom: photo.zoom ? photo.zoom : 1,
			})
		}
	}

	componentWillReceiveProps(nextProps) {
		const { user, zoom } = nextProps
		const nextPhoto = user ? user.photo : null
		const prevPhoto = this.props.user ? this.props.user.photo : null

		if (!isEqual(nextPhoto, prevPhoto)) {
			if (nextPhoto) {
				const { preview, secure_url, crop, photo_croppedUI } = nextPhoto

				this.setState({
					image: preview || secure_url,
					crop: crop && crop.ui ? crop.ui : photo_croppedUI ? photo_croppedUI : this.state.crop,
				})
			}
			else {
				this.setState(DEFAULT_STATE)
			}
		}

		if (zoom !== this.props.zoom) {
			this.setState({ zoom })
		}
	}

	onCropChange = crop => {
		this.setState({ crop })
	}

	onCropComplete = (croppedArea, croppedAreaPixels) => {
		const { user, onCropChange } = this.props
		const photo = user ? user.photo : null

		let updateObj = {
			photo_croppedUI: this.state.crop,
			photo_croppedArea: croppedArea,
			photo_croppedAreaPixels: croppedAreaPixels,
		}

		onCropChange({
			area: croppedArea,
			areaPixels: croppedAreaPixels,
			ui: this.state.crop,
		})
	}

	onZoomChange = zoom => {
		this.setState({ zoom })
	}

	onDrop = (acceptedFiles, rejectedFiles) => {
		const {
			onPhotoChange,
			setNotification,
			clearNotifications
		} = this.props

		let image = null

		if (acceptedFiles[0]) {
			image = acceptedFiles[0].preview || acceptedFiles[0].secure_url
		}

		if (acceptedFiles.length) {
			this.setState({ image })

			onPhotoChange({
				preview: acceptedFiles[0].preview,
				file: acceptedFiles[0],
				name: 'photo',
				tags: 'avatar',
			})
		}
		else if (rejectedFiles.length) {
			clearNotifications()
			setNotification({
				status: 'error',
				title: 'Problem with your photo',
				message: 'Please, make sure your photo is under 3mb and an image type—like JPEG, PNG, GIF, etc. Spanks!'
			})
		}
	}

	onInteractionStart = () => {
		this.setState({ isInteracting: true })
	}

	onInteractionEnd = () => {
		this.setState({ isInteracting: false })
	}

	_openDrop = () => {
		if (!this._dropzone) {
			return
		}

		this._dropzone.open()
	}

	_removeImage = () => {
		const { onPhotoChange } = this.props

		this.setState(DEFAULT_STATE)
		this.props.onPhotoChange(null)
	}

	render() {
		const { image, crop, zoom, aspect, isInteracting } = this.state
		const { cropSize, viewportName, onImageLoaded = () => {} } = this.props
		const style = {
			imageStyle: {
				width: '100%',
				maxWidth: 'none',
				height: 'auto',
				maxHeight: 'none',
			},
		}

		return (
			<figure className={`profile-photo ${!image ? 'avatar-empty' : ''}`}>

				{image && (
					<Fragment>
						<ul className={`corner-actions ${isInteracting ? 'hide' : ''}`}>
							<li className="corner-action" onClick={this._removeImage}>
								<IconClose className="icon--small" />
							</li>
						</ul>

						<figcaption className={`crop-notice ${isInteracting ? 'hide' : ''}`}>
							<IconMove />
						</figcaption>

						<Cropper
							image={image}
							crop={crop}
							cropSize={cropSize}
							zoom={zoom || 1}
							aspect={aspect}
							style={style}
							classes={{
								containerClassName: 'crop-container',
							}}
							restrictPosition={true}
							showGrid={false}
							onInteractionStart={this.onInteractionStart}
							onInteractionEnd={this.onInteractionEnd}
							onCropChange={this.onCropChange}
							onCropComplete={this.onCropComplete}
							onZoomChange={this.onZoomChange}
							onImageLoaded={onImageLoaded} />
					</Fragment>
				)}

				<Dropzone
					ref={node => this._dropzone = node}
					className="avatar-upload"
					accept={'image/*'}
					onDrop={this.onDrop}
					maxSize={5242880}
					multiple={false}>

					<div className="avatar-hint text-center">
						<div className="avatar-hint-copy center-vertical">
							<IconImageAdd className="center" />
							<div className="typography-small-headline" style={{ marginTop: '0.2rem' }}>
								Profile<br />Photo
							</div>
						</div>
					</div>

				</Dropzone>

			</figure>
		)
	}
}

const mapStateToProps = ({ app, user }) => ({
	viewportName: app.viewportName,
	user: user.user,
})

const mapDispatchToProps = dispatch => {
	return {
		clearNotifications: () => {
			dispatch(AppActions.clearNotifications())
		},

		setNotification: (message) => {
			dispatch(AppActions.setNotification(message))
		},

		updateUser: (user) => {
			dispatch(UserActions.updateUser(user, true))
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AvatarUpload)
