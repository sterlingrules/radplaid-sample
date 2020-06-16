import React from 'react'

const Stay22 = (props) => {
	const { date, venue, height } = props

	if (!venue) {
		return <div />
	}

	const { name, formattedAddress, lat, lng } = venue
	const params = {
		aid: 'getradplaid',
		lat: lat,
		lng: lng,
		eventstart: new Date(date).getTime() / 1000,
		maincolor: '8b61a9',
		venue: name,
		feedbackemail: 'hello@getradplaid.com',
		freezeviewport: true,
		hidefooter: true,
		hidemapcopy: true,
		hideppn: true,
	}

	if (Array.isArray(formattedAddress)) {
		params.address = formattedAddress.join(', ')
	}

	let path = `https://www.stay22.com/embed/gm?` // ?lat=40.742612&lng=-73.987777&venue=Optional%20Text`

	for (var key in params) {
		path += `${key}=${encodeURIComponent(params[key])}&`
	}

	return (
		<iframe
			id="stay22-widget"
			width="100%"
			height={height}
			frameBorder={0}
			src={path}>
		</iframe>
	)
}

export default Stay22
