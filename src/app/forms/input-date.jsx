import 'react-dates/initialize'

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'
// import SingleDatePicker from 'react-dates/lib/components/SingleDatePicker'
import { getOptionByValue } from './../helpers'
import Select from './../forms/select.jsx'
import moment from 'moment'

import DayPickerSingleDateController from 'react-dates/lib/components/DayPickerSingleDateController'
// import ScrollableOrientationShape from 'react-dates/lib/shapes/ScrollableOrientationShape'
// import { START_DATE, END_DATE, HORIZONTAL_ORIENTATION } from 'react-dates/lib/constants'
import isInclusivelyAfterDay from 'react-dates/lib/utils/isInclusivelyAfterDay'

//
// Helpers
//
const _times = () => {
	let times = []
	let minutes = [ 0, 15, 30, 45 ]

	for (let hour = 0; hour < 24; hour++) {
		minutes.map((minute) => {
			let timeObj = { hour: hour, minute: minute, second: 0 }
			let value = moment(timeObj).format('h:mm a')

			times.push({
				label: value,
				value: value
			})
		})
	}

	return times
}

const _hourFormat = (time, ampm) => {
	if (time == 12) {
		time = (ampm == 'am') ? 0 : 12
	}

	if (ampm == 'pm') {
		time = parseInt(time) + 12
	}

	return time
}

const _isBeforeDay = (a, b) => {
	if (!moment.isMoment(a) || !moment.isMoment(b)) {
		return false
	}

	const aYear = a.year()
	const aMonth = a.month()

	const bYear = b.year()
	const bMonth = b.month()

	const isSameYear = aYear === bYear
	const isSameMonth = aMonth === bMonth

	if (isSameYear && isSameMonth) return a.date() < b.date()
	if (isSameYear) return aMonth < bMonth
	return aYear < bYear
}

const _isInclusivelyAfterDay = (a, b) => {
	if (!moment.isMoment(a) || !moment.isMoment(b)) {
		return false
	}

	return !_isBeforeDay(a, b)
}

//
// InputDate Component
//
class InputDate extends PureComponent {
	static propTypes = {
		type: PropTypes.string,
		name: PropTypes.string,
		value: PropTypes.string
	}

	constructor(props) {
		super(props)

		this.state = {
			focused: false,
			times: _times()
		}

		if (typeof window !== 'undefined') {
			window.moment = moment
		}
	}

	componentWillMount() {
		document.addEventListener('mousedown', this.handleBlurModal)
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleBlurModal)
	}

	handleBlurModal = ({ target }) => {
		const findParent = (element = { tagName: null }) => {
			if (!element || !this.element) {
				return
			}

			if (element.tagName == 'HTML') {
				return this.hideDatePicker()
			}

			if (element == this.element ||
				element == this.element.parentElement) {
				return
			}

			findParent(element.parentElement)
		}

		findParent(target)
	}

	hideDatePicker = () => {
		this.showDatePicker(false)
	}

	showDatePicker = (state = true) => {
		this.setState({ focused: state ? true : false })
	}

	onDayChange = (date) => {
		let { value, name, format, type } = this.props

		let _month = date.month()
		let _date = date.date()
		let _year = date.year()

		value = moment(value).utc().set({ year: _year, month: _month, date: _date }).toISOString()

		this.props.onChange({
			target: {
				name: name,
				value,
			}
		})

		this.setState({ focused: false })
	}

	onTimeChange = (evt) => {
		let { type, name, value } = this.props
		let date = moment(value).utc().format('YYYY-MM-DD')
		let time = moment(evt.value, 'h:mm a')
		let timeObj = {
			hour: time.get('hour'),
			minute: time.get('minute'),
			second: 0
		}

		this.props.onChange({
			target: {
				name: name,
				value: moment(value).utc().set(timeObj).toISOString()
			}
		})
	}

	render() {
		let _props = clone(this.props)
		let { type, value, format } = _props

		_props.value = value ? moment(value).utc().format(format) : ''

		return (
			<div className="input-date" ref={node => this.element = node}>
				{type == 'calendar' ? (
					<React.Fragment>
						<input id="calendar" type="text" {..._props} onFocus={this.showDatePicker} readOnly />
						<div className={`form-calendar ${this.state.focused ? 'form-calendar--focused' : ''}`}>
							<DayPickerSingleDateController
								date={moment(value)}
								focused={this.state.focused}
								onDateChange={this.onDayChange}
								onFocusChange={focusedInput => this.setState({ focusedInput })}
								keepOpenOnDateSelect={false}
								hideKeyboardShortcutsPanel={true}
								isOutsideRange={day => !isInclusivelyAfterDay(day, moment().utc().startOf('day'))}
								numberOfMonths={1}
								monthFormat={'MMMM D, YYYY'} />
						</div>
					</React.Fragment>
				) : (
					<span className="form-input widthhalf">
						<Select
							options={this.state.times}
							settings={{
								inputId: 'timedate',
								name: 'time',
								isMulti: false,
								isClearable: false,
								isSearchable: false,
								defaultValue: getOptionByValue(this.state.times, '7:00 pm'),
								value: getOptionByValue(this.state.times, moment(value).utc().format('h:mm a')),
								onChange: this.onTimeChange
							}} />
					</span>
				)}
			</div>
		)
	}
}

export default InputDate
