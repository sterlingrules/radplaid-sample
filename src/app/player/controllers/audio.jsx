import { Howl } from 'howler'
import { normalize, delay } from './../../helpers'
import { isMobile } from './../../helpers/device-detect'
import Emitter from 'tiny-emitter'
import SoundCloud from 'soundcloud-audio'
import { DEBUG } from './../../constants.jsx'

const RETRY_COUNT = 3
const TIME_TO_GIVEUP = 3000
const FADE_DURATION = 1500

class Audio extends Emitter {
	constructor(uri, ext = 'mp3', source = 'radplaid') {
		super()

		this.duration = 0
		this.uri = uri
		this.extension = ext
		this.source = source
		this.tries = 0
		this.queue = []
		this.queueClear = false

		this._seek = 0
		this._isPlaying = false
		this._isFading = false

		// Bindings
		this.setDuration = this.setDuration.bind(this)
		this.getDuration = this.getDuration.bind(this)
		this.play = this.play.bind(this)
		this.pause = this.pause.bind(this)
		this.stop = this.stop.bind(this)
		this.destroy = this.destroy.bind(this)
		this.getSeek = this.getSeek.bind(this)
		this.getCurrentPosition = this.getCurrentPosition.bind(this)
		this.getState = this.getState.bind(this)
		this.retry = this.retry.bind(this)

		this._getSound = this._getSound.bind(this)
		this._clearQueue = this._clearQueue.bind(this)
		this._listen = this._listen.bind(this)
		this._queue = this._queue.bind(this)

		this.sound = this._getSound()

		this._listen()
	}

	_getSound() {
		return new Howl({
			src: [
				`${this.uri}${this.source === 'soundcloud' ? `?client_id=${process.env.SOUNDCLOUD_CLIENT_ID}` : ''}`
			],
			format: [ this.extension ],
			preload: true,
			autoplay: false,
			mobileAutoEnable: true,
			html5: !isMobile, // Causes breaking on Mobile
			loop: false
		})
	}

	play() {
		if (DEBUG) console.log('play ', this.getState())

		if (!this.sound || this.getState() === 'loading') {
			return this._queue('play')
		}

		this._clearQueue()

		this.sound.stop()
		this.sound.seek(this._seek)
		this.sound.play()

		this.retry()
	}

	retry() {
		console.log('trying... ', this.tries)

		if (this.tries >= RETRY_COUNT) {

			console.log('eh?', this.tries)

			this.tries = 0
			this.destroy()
			this.emit('error')

			return
		}

		delay(() => {
			console.log('this.isPlaying ', this.isPlaying)
			console.log('this.getState() ', this.getState())

			if (this.getState() === 'loaded') {
				this.tries = 0
				return
			}

			if (this.sound) {
				this.destroy()
				this.sound = this._getSound()
				this._listen()
			}

			if (DEBUG) console.log('retrying...')

			this.play()

			this.tries++
		}, TIME_TO_GIVEUP)
	}

	pause() {
		if (!this.sound) {
			return this._queue('pause')
		}

		this.sound.pause()
	}

	stop() {
		if (!this.sound) {
			return this._queue('stop')
		}

		this.sound.stop()
		this._clearQueue()
		this.destroy()
	}

	destroy() {
		if (!this.sound) {
			return
		}

		this._listen('off')

		this.sound.stop()
		this.sound.unload()
		this.sound = null

		this.queueClear = false
	}

	// Setters
	setDuration() {
		if (!this.sound) {
			return
		}

		this.duration = Math.round(this.sound.duration() || 0)
	}

	// Getters
	getDuration() {
		return this.duration
	}

	getState() {
		if (!this.sound) {
			return this._queue('getState')
		}

		return this.sound._state
	}

	getSeek() {
		if (!this.sound) {
			return this._seek
		}

		if (typeof this.sound.seek() === 'number') {
			this._seek = this.sound.seek()
		}

		let isLoaded = (this.getState() === 'loaded')
		let isNotFading = !this._isFading
		let isNearEnd = (
			this._seek > (this.duration - 2) &&
			this.duration > 0 &&
			this._seek > 0
		)

		if (isNearEnd && isLoaded && isNotFading) {
			this._isFading = true
			this.sound.fade(1, 0, FADE_DURATION)
		}

		return this._seek
	}

	getCurrentPosition() {
		let value = this.getSeek()
		let max = Math.round(this.duration)

		return (normalize(value, max, 0) || 0) * 100
	}

	//
	// Getters
	//
	get isPlaying() {
		return this._isPlaying
	}

	//
	// Private
	//
	_queue(item = null) {
		if (item) this.queue.push(item)

		if (!this.queue.length || this.queueClear) {
			this.queueClear = false
			return
		}

		delay(() => {
			// If cleared before ran
			if (this.queueClear) return

			this[this.queue[0]]()
			this.queue.shift()
		}, 300)
	}

	_clearQueue() {
		this.queueClear = true
	}

	_listen(state = 'on') {
		if (!this.sound) {
			return
		}

		this.sound[state]('play', (evt) => {
			this._isPlaying = true
			this.setDuration()
		})

		this.sound[state]('pause', (evt) => {
			this._isPlaying = false
		})

		this.sound[state]('stop', (evt) => {
			this._isPlaying = false
		})

		this.sound[state]('end', (evt) => {
			this._isPlaying = false
			this.emit('end', evt)
		})

		// Error handling
		this.sound[state]('loaderror', (evt) => {
			this.emit('error', evt)
		})

		this.sound[state]('playerror', (evt) => {
			this.emit('error', evt)
		})
	}

	_formatTime(secs) {
		var minutes = Math.floor(secs / 60) || 0;
		var seconds = (secs - minutes * 60) || 0;

		return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
	}
}

export default Audio
