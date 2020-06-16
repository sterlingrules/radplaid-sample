import React from 'react'
import moment from 'moment'

/**
 *
 * Properly formats a date object with users `timezone`
 *
 * @param props.date {Date}
 * @param props.format {String}
 * @param props.className {String}
 *
 * @return date with proper offset
 *
 */
const DateTime = (props) => {
	let datetime = moment(props.date).utc().format(props.format)

	return (
		<time dateTime={datetime} className={props.className}>{datetime}</time>
	)
}

export default DateTime
