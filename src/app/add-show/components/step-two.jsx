import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { EDITOR_SETTINGS, COMPLETED_FIELDS_KEY } from './../../constants.jsx'
import { DEFAULT_SHOWS } from './../../constants.computed.jsx'
import moment from 'moment'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import clone from 'lodash/clone'
import keys from 'lodash/keys'
import Textarea from 'react-textarea-autosize'
import InputDate from './../../forms/input-date.jsx'
import InputTag from './../../forms/input-tag.jsx'

let MediumEditor

if (process.browser) {
	MediumEditor = require('medium-editor')
}

const INPUT_COMPLETE_CLASS = 'form--valid'

class StepTwo extends Component {
	static propTypes = {
		onMount: PropTypes.func
	}

	constructor(props) {
		super(props)

		// let changedState = {
		// 	date: false,
		// 	advance_price: false,
		// 	door_price: false,
		// 	age: false,
		// 	event_url: false,
		// 	ticket_url: false,
		// 	title: false,
		// 	description: false,
		// 	tags: false
		// }

		// let savedChangedState = JSON.parse(localStorage.getItem(COMPLETED_FIELDS_KEY) || '{}')

		// this.state = {
		// 	changed: isEmpty(savedChangedState) ? changedState : savedChangedState
		// }

		this.state = {
			changed: {
				date: false,
				advance_price: false,
				door_price: false,
				age: false,
				event_url: false,
				ticket_url: false,
				livestream_url: false,
				donation_url: false,
				title: false,
				description: false,
				tags: false,
			},
		}
	}

	componentDidMount() {
		if (this.props.onMount) {
			this.props.onMount()
		}

		if (!this.textareaEl) {
			return
		}

		this.mediumEditor = new MediumEditor(this.textareaEl, EDITOR_SETTINGS)

		this.mediumEditor.subscribe('editableInput', (event, editable) => {
			this.props.onInputChange({
				target: {
					name: 'description',
					value: String(editable.innerHTML)
				}
			})
		})
	}

	componentDidUpdate(prevProps, prevState) {
		if (isEqual(prevProps.addShow, this.props.addShow)) {
			return
		}

		this._verifyFields(prevProps)
	}

	componentWillUnmount() {
		if (this.mediumEditor) {
			this.mediumEditor.destroy()
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(nextState.changed, this.state.changed) ||
			nextProps.viewportName !== this.props.viewportName ||
			nextProps.addShow.date !== this.props.addShow.date ||
			nextProps.addShow.description !== this.props.addShow.description ||
			nextProps.addShow.advance_price !== this.props.addShow.advance_price ||
			nextProps.addShow.door_price !== this.props.addShow.door_price ||
			nextProps.addShow.age !== this.props.addShow.age ||
			nextProps.addShow.ticket_url !== this.props.addShow.ticket_url ||
			nextProps.addShow.donation_url !== this.props.addShow.donation_url ||
			nextProps.addShow.livestream_url !== this.props.addShow.livestream_url ||
			nextProps.addShow.event_url !== this.props.addShow.event_url ||
			nextProps.addShow.title !== this.props.addShow.title
		)
	}

	onPriceChange = ({ target }) => {
		const PRICE_TEST = new RegExp(/(\$|)(\$|[0-9]{1,2}((\.|)[0-9]{0,2}))/g)

		let { name, value } = target
		let { onInputChange } = this.props
		let validPrice = PRICE_TEST.test(value)

		if (validPrice || value == '') {
			return onInputChange({
				target: {
					name: name,
					value: value
				},
			})
		}
	}

	_verifyFields = (prevProps = this.props) => {
		let _keys = keys(prevProps.addShow)
		let _state = clone(this.state.changed)

		for (let i = 0; i < _keys.length; i++) {
			let key = _keys[i]

			// Make sure value changed and is not empty
			if (!isEqual(prevProps.addShow[key], this.props.addShow[key]) && !isEmpty(this.props.addShow[key])) {
				_state[key] = true
			}
			else if (isEmpty(this.props.addShow[key])) {
				_state[key] = false
			}

			this.setState({ changed: _state })
		}

		localStorage.setItem(COMPLETED_FIELDS_KEY, JSON.stringify(this.state.changed))
	}

	render() {
		let _year = new Date().getFullYear();
		let _month = new Date().getMonth();
		let _day = new Date().getDay();
		let date = new Date(_year, _month, _day, 19, 0, 0)

		let { addShow, viewportName, onInputChange, onDateChange } = this.props
		let { changed } = this.state

		return (addShow ? (
			<div className="row">
				<div id="add-step-two" className="row">
					<div className="addshow-step col col-5-of-12 push-medium-1-of-8 col-medium-6-of-8 col-small-12-of-12 small-un-push">
						<div className="bubble bubble--visible">
							<ul className="form-table">
								<li className={changed.date ? INPUT_COMPLETE_CLASS : ''}>
									<label className="form-label form-label--center">Date</label>
									<InputDate type="calendar" name="date" className="form-input text-right" value={addShow.date || DEFAULT_SHOWS.addShow.date} format="MMMM D, YYYY" placeholder={moment(date).format('MMMM D, YYYY')} onChange={onInputChange} />
								</li>
								<li className={changed.date ? INPUT_COMPLETE_CLASS : ''}>
									<label className="form-label form-label--center">Doors at</label>
									<InputDate type="time" name="date" className="form-input text-right" value={addShow.date || DEFAULT_SHOWS.addShow.date} format="LT" placeholder={moment(date).format('LT')} onChange={onInputChange} />
								</li>
								<li className={changed.advance_price ? INPUT_COMPLETE_CLASS : ''}>
									<label className="form-label form-label--center form-label--overlay">Advance Price</label>
									<input type="number" name="advance_price" className="form-input text-right" value={addShow.advance_price || ''} placeholder="Free" min={0} step={0.01} onChange={this.onPriceChange} />
								</li>
								<li className={changed.door_price ? INPUT_COMPLETE_CLASS : ''}>
									<label className="form-label form-label--center form-label--overlay">Door Price</label>
									<input type="number" name="door_price" className="form-input text-right" value={addShow.door_price || ''} placeholder="Free" min={0} step={0.01} onChange={this.onPriceChange} />
								</li>
								<li className={changed.age ? INPUT_COMPLETE_CLASS : ''}>
									<label className="form-label">Age Restriction</label>
									<div className="form-radioset">
										<input id="age-limit-all" type="checkbox" name="age" value="all" onChange={onInputChange} checked={addShow.age === 'all' ? 'checked' : false} />
										<label htmlFor="age-limit-all" className="form-radio">
											All ages
										</label>

										{/*<input id="age-limit-16" type="checkbox" name="age" value="16+" onChange={onInputChange} checked={addShow.age === '16+' ? 'checked' : false} />
										<label htmlFor="age-limit-16" className="form-radio">
											16+
										</label>*/}

										<input id="age-limit-18" type="checkbox" name="age" value="18+" onChange={onInputChange} checked={addShow.age === '18+' ? 'checked' : false} />
										<label htmlFor="age-limit-18" className="form-radio">
											18+
										</label>

										<input id="age-limit-21" type="checkbox" name="age" value="21+" onChange={onInputChange} checked={addShow.age === '21+' ? 'checked' : false} />
										<label htmlFor="age-limit-21" className="form-radio">
											21+
										</label>
									</div>
								</li>
							</ul>
						</div>

						<div className="bubble">
							<ul className="form-table">
								<li className={changed.livestream_url ? INPUT_COMPLETE_CLASS : ''}>
									<label className="form-label form-label--center form-label--overlay">Live Stream URL</label>
									<input type="text" name="livestream_url" className="form-input text-right" value={addShow.livestream_url || ''} placeholder="(ex. facebook.com/band)" onChange={onInputChange} />
								</li>
								<li className={changed.ticket_url ? INPUT_COMPLETE_CLASS : ''}>
									<label className="form-label form-label--center form-label--overlay">Ticket URL</label>
									<input type="text" name="ticket_url" className="form-input text-right" value={addShow.ticket_url || ''} placeholder="(ex. ticketfly.com/123)" onChange={onInputChange} />
								</li>
								<li className={changed.donation_url ? INPUT_COMPLETE_CLASS : ''}>
									<label className="form-label form-label--center form-label--overlay">Donation URL</label>
									<input type="text" name="donation_url" className="form-input text-right" value={addShow.donation_url || ''} placeholder="(ex. gofundme.com/f/123)" onChange={onInputChange} />
								</li>
								<li className={changed.event_url ? INPUT_COMPLETE_CLASS : ''}>
									<label className="form-label form-label--center form-label--overlay">Event URL</label>
									<input type="text" name="event_url" className="form-input text-right" value={addShow.event_url || ''} placeholder="(ex. riotfest.org)" onChange={onInputChange} />
								</li>
							</ul>
						</div>
					</div>

					<div id="editor" className="col col-7-of-12 push-medium-1-of-8 col-medium-6-of-8 col-small-12-of-12 small-un-push">
						<div className="bubble bubble--visible">
							<ul className="form-table">
								<li className={changed.title ? INPUT_COMPLETE_CLASS : ''}>
									<label className="form-label">Show Title</label>
									<input type="text" name="title" className="form-input" value={addShow.title || ''} placeholder="Riot Fest (optional)" onChange={onInputChange} />
								</li>
								<li className={changed.description ? INPUT_COMPLETE_CLASS : ''}>
									<label className="form-label">Additional Information</label>
									<textarea
										ref={(node) => this.textareaEl = node}
										name="description"
										className="typography--formatted"
										value={addShow.description || ''}
										placeholder="Any drink specials? Do proceeds support a benefit?"
										onChange={onInputChange} />
								</li>
							</ul>
						</div>

						{/*<div className="bubble bubble--visible">
							<ul className="form-table">
								<li className={`form-autocomplete form-complete--center ${changed.tags ? INPUT_COMPLETE_CLASS : ''}`}>
									<label className="form-label form-label--center form-label--overlay">Tags</label>
									<div className="form-input text-right">
										<InputTag
											value={addShow.tags || []}
											viewportName={viewportName}
											onInputChange={onInputChange} />
									</div>
								</li>
							</ul>
						</div>*/}
					</div>
				</div>
			</div>
		) : (
			<div />
		))
	}
}

export default StepTwo
