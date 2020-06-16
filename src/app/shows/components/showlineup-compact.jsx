import React from 'react'
import { IconMore } from './../../common/icons.jsx'
import { formatTitleFromLineup } from './../../helpers'

const ShowLineupCompact = ({ lineup, initIndex }) => {
	let _lineup = lineup.splice(5, lineup.length - 5)

	let wsg = formatTitleFromLineup(_lineup)

	return (
		<li className="playlist-info playlist-info--compact">
			<div className="playlist-track">
				<span>with</span>
				<span className="strong">{wsg}</span>
			</div>
			<div style={{ alignSelf: 'center' }} title={`${lineup.length} more artists`}>
				<IconMore className="fill-keyline" />
			</div>
		</li>
	)
}

export default ShowLineupCompact
