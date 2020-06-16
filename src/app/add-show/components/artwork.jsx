import isEqual from 'lodash/isEqual'
import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import Cropper from 'react-easy-crop'
import * as AppActions from './../../redux/actions/app.jsx'
import ShowActions from './../../redux/actions/shows.jsx'
import { IconClose, IconImageAdd } from './../../common/icons.jsx'

const DEFAULT_STATE = {
	image: null,
	crop: { x: 0, y: 0 },
	zoom: 1,
	aspect: 10 / 4,
	isInteracting: false,
}

class Artwork extends Component {
	static propTypes = {
		updateAddShow: PropTypes.func,
		setNotification: PropTypes.func
	}

	state = DEFAULT_STATE

	componentWillMount() {
		const { editShow, addShow } = this.props
		const { artwork, artwork_croppedUI } = editShow || addShow || {}

		if (artwork) {
			this.setState({
				image: artwork.preview || artwork.secure_url,
				crop: artwork.crop && artwork.crop.ui ? artwork.crop.ui : artwork_croppedUI ? artwork_croppedUI : this.state.crop,
			})
		}
	}

	componentWillReceiveProps(nextProps) {
		const { editShow, addShow } = nextProps
		const nextShowObject = editShow || addShow
		const prevShowObject = this.props.editShow || this.props.addShow
		const prevArtwork = (prevShowObject && prevShowObject.artwork) ? prevShowObject.artwork : null
		const nextArtwork = (nextShowObject && nextShowObject.artwork) ? nextShowObject.artwork : null

		if (nextArtwork && !isEqual(nextArtwork, prevArtwork)) {
			const { artwork, artwork_croppedUI } = nextShowObject

			this.setState({
				image: artwork.preview || artwork.secure_url,
				crop: artwork.crop && artwork.crop.ui ? artwork.crop.ui : artwork_croppedUI ? artwork_croppedUI : this.state.crop,
			})
		}
	}

	onCropChange = crop => {
		this.setState({ crop })
	}

	onCropComplete = (croppedArea, croppedAreaPixels) => {
		const { editShow, addShow } = this.props
		const showObject = editShow || addShow

		let updateObj = {
			artwork_croppedUI: this.state.crop,
			artwork_croppedArea: croppedArea,
			artwork_croppedAreaPixels: croppedAreaPixels,
		}

		// We only want to modify an uploaded artwork object
		if (showObject && showObject.artwork && showObject.artwork.public_id) {
			updateObj.artwork = {
				...showObject.artwork,
				crop: {
					area: croppedArea,
					areaPixels: croppedAreaPixels,
					ui: this.state.crop,
				},
			}
		}

		this.props[editShow ? 'updateEditShow' : 'updateAddShow'](updateObj)
	}

	onZoomChange = zoom => {
		this.setState({ zoom })
	}

	onDrop = (acceptedFiles, rejectedFiles) => {
		const {
			editShow,
			setNotification,
			clearNotifications
		} = this.props

		let image = null

		if (acceptedFiles[0]) {
			image = acceptedFiles[0].preview || acceptedFiles[0].secure_url
		}

		if (acceptedFiles.length) {
			this.setState({ image })

			this.props[editShow ? 'updateEditShow' : 'updateAddShow']({
				artwork_preview: acceptedFiles[0].preview,
				artwork_name: 'artwork',
				artwork_tags: 'flyer',
				artwork: acceptedFiles[0]
			})
		}
		else if (rejectedFiles.length) {
			clearNotifications()
			setNotification({
				status: 'error',
				title: 'Problem with your artwork',
				message: 'Please, make sure your file is under 3mb and an image type—like JPEG, PNG, GIF, etc. Spanks!'
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
		const { editShow } = this.props

		this.setState(DEFAULT_STATE)
		this.props[editShow ? 'updateEditShow' : 'updateAddShow']({
			artwork_preview: null,
			artwork_name: null,
			artwork_tags: null,
			artwork: null
		})
	}

	render() {
		const { image, crop, zoom, aspect, isInteracting } = this.state
		const { editShow, addShow, viewportName } = this.props
		const style = {
			imageStyle: {
				width: '100%',
				maxWidth: 'none',
				height: 'auto',
				maxHeight: 'none',
			},
		}

		let _addShow = editShow || addShow
		let artwork = _addShow.artwork

		return (
			<figure className={`showartwork ${!artwork ? 'showartwork-empty' : ''}`}>

				{image && (
					<Fragment>
						<ul className={`crop-controls ${isInteracting ? 'hide' : ''}`}>
							<li onClick={this._openDrop}><IconImageAdd className="icon--small" style={{ marginRight: '0.4rem' }} /> Change Artwork</li>
							<li onClick={this._removeImage}><IconClose className="icon--small" /></li>
						</ul>

						<figcaption className={`crop-notice ${isInteracting ? 'hide' : ''}`}>
							Drag to Reposition
						</figcaption>

						<Cropper
							image={image}
							crop={crop}
							zoom={zoom}
							aspect={aspect}
							restrictPosition={true}
							style={style}
							onInteractionStart={this.onInteractionStart}
							onInteractionEnd={this.onInteractionEnd}
							onCropChange={this.onCropChange}
							onCropComplete={this.onCropComplete}
							onZoomChange={this.onZoomChange} />
					</Fragment>
				)}

				<Dropzone
					ref={node => this._dropzone = node}
					className="showartwork-upload"
					accept={'image/*'}
					onDrop={this.onDrop}
					maxSize={5242880}
					multiple={false}>

					<div className="showartwork-hint text-center">
						<div className="showartwork-hint-copy center-vertical">
							<IconImageAdd className="icon--large fill-keyline center" />
							{viewportName === 'small' ? (
								<div className="hide small-show">
									<h2 className="typography-subheadline" style={{ marginTop: '0.4rem' }}>Add Flyer Artwork</h2>
									<p>Tap here to select flyer artwork for upload.</p>
									<p>1000px x 400px Recommended. Maximum 3mb.</p>
								</div>
							) : (
								<div className="small-hide">
									<h2 className="typography-subheadline" style={{ marginTop: '0.4rem' }}>Drop Flyer Artwork</h2>
									<p>Drop your show artwork here, or click to select files to upload.</p>
									<p>1000px x 400px Recommended. Maximum 3mb</p>
								</div>
							)}
						</div>
					</div>

				</Dropzone>
			</figure>
		)
	}
}

const mapStateToProps = ({ app, shows }) => ({
	viewportName: app.viewportName,
	addShow: shows.addShow,
	editShow: shows.editShow
})

const mapDispatchToProps = dispatch => {
	return {
		clearNotifications: () => {
			dispatch(AppActions.clearNotifications())
		},

		setNotification: (type, message, title, sticky) => {
			dispatch(AppActions.setNotification(type, message, title, sticky))
		},

		updateAddShow: (data) => {
			dispatch(ShowActions.updateAddShow(data))
		},

		updateEditShow: (data) => {
			dispatch(ShowActions.updateEditShow(data))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Artwork)
