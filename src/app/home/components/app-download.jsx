import React from 'react'
import { track } from './../../helpers/analytics.jsx'

const AppDownload = ({ theme = 'light', size = '', className = '' }) => {
	const onClick = ({ target }) => {
		console.log('target.name ', target.name)
		track('cta', {
			action: 'app download',
			label: target.name,
		})
	}

	return (
		<div className={`app-download app-download--${theme} app-download--${size} ${className}`}>
			<a href="https://apps.apple.com/us/app/rad-plaid-live-music-calendar/id1476084506?ls=1" onClick={onClick} name="Apple" target="_blank" title="Download on the App Store" className="apple"></a>
			<a href="https://play.google.com/store/apps/details?id=com.radplaid" onClick={onClick} name="Google" target="_blank" title="Get it on Google Play" className="google"></a>
		</div>
	)
}

export default AppDownload
