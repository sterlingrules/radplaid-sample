import React, { Component } from 'react'
import { IconChat } from './icons.jsx'

const onClick = () => {
	if (typeof drift === 'undefined') {
		return
	}

	if (drift.api) {
		console.log('drift ', drift.api)
		console.log('drift ', drift.api.sidebar)

		drift.api.sidebar.open()
	}
}

const HelpButton = (props) => {
	return (
		<button
			className="btn btn--round btn--help"
			onClick={onClick}>
			<IconChat className="icon--small" /> Need Help?
		</button>
	)
}

export default HelpButton
