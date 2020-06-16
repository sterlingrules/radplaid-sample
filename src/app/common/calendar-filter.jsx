/* eslint-disable react/no-unused-prop-types */

import omit from 'lodash/omit'
import 'react-dates/initialize'
import React from 'react'
import PropTypes from 'prop-types'
import { IconChevron, IconChevronLeft, IconToday } from './icons.jsx'
import { getDeviceInfo } from './../helpers/analytics.jsx'
import moment from 'moment'

import DayPickerSingleDateController from 'react-dates/lib/components/DayPickerSingleDateController'
import ScrollableOrientationShape from 'react-dates/lib/shapes/ScrollableOrientationShape'
import { START_DATE, END_DATE, HORIZONTAL_ORIENTATION } from 'react-dates/lib/constants'
import isInclusivelyAfterDay from 'react-dates/lib/utils/isInclusivelyAfterDay'

// moment.updateLocale('en', { weekdaysMin: 'S_M_T_W_T_F_S'.split('_') })

const defaultProps = {
	// day presentation and interaction related props
	renderCalendarDay: undefined,
	renderDayContents: null,
	isDayBlocked: () => false,
	isOutsideRange: day => !isInclusivelyAfterDay(day, moment()),
	isDayHighlighted: () => false,
	enableOutsideDays: true,

	// calendar presentation and interaction related props
	orientation: HORIZONTAL_ORIENTATION,
	verticalHeight: undefined,
	withPortal: false,
	initialVisibleMonth: null,
	numberOfMonths: 1,
	onOutsideClick() {},
	keepOpenOnDateSelect: false,
	renderCalendarInfo: null,
	isRTL: false,
	renderMonthText: null,
	renderMonthElement: null,
	transitionDuration: 0,

	// navigation related props
	navPrev: null,
	navNext: null,
	onPrevMonthClick() {},
	onNextMonthClick() {},

	// internationalization
	monthFormat: 'MMMM',
	weekDayFormat: 'dd'
}

class CalendarFilter extends React.Component {
	constructor(props) {
		super(props)

		this.state = { focused: true }
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!moment(nextProps.value).isSame(moment(this.props.value))
		)
	}

	renderDayContents = (date) => {
		return date.format('ddd')
	}

	renderMonthElement = ({ month, onMonthSelect, onYearSelect }) => {
		return (
			<React.Fragment>
				<div
					className="CalendarMonth_today"
					title="Today"
					onClick={() => {
						onMonthSelect(month, moment().month())
						this.onDateChange(moment().startOf('day'))
					}}>
					<IconToday className="fill-accent-two" />
				</div>
				<div className="CalendarMonth_title">{month.format('MMMM')}</div>
			</React.Fragment>
		)
	}

	onDateChange = (date) => {
		this.props.onChange(date)
	}

	// onFocusChange = (focused) => {
	// 	this.setState({
	// 		// Force the focused to always be truthy so that dates are always selectable
	// 		focused: !focused ? START_DATE : focused
	// 	})
	// }

	render() {
		const { value } = this.props
		const { focused } = this.state
		const { browser = {} } = getDeviceInfo()

		return (
			<div className="calendar-minimal">
				<DayPickerSingleDateController
					{...omit(this.props, [ 'value', 'onChange' ])}

					renderMonthElement={this.renderMonthElement}

					navPrev={<IconChevronLeft className="fill-accent-two" />}
					navNext={<IconChevron className="fill-accent-two" />}
					daySize={48}
					noBorder={true}

					date={moment(value)}
					firstDayOfWeek={0}
					onDateChange={this.onDateChange}
					focused={focused}
				/>
			</div>
		)
	}
}

CalendarFilter.defaultProps = defaultProps

export default CalendarFilter
