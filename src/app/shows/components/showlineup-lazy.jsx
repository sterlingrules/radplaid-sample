import React, { Component, Suspense, lazy } from 'react'
import { Loader } from './../../common/loader.jsx'

const ShowLineupDeferred = lazy(() => import('./showlineup.jsx'))

const ShowLineup = (props) => {
	return (
		<Suspense
			fallback={
				<div className="loader-view loader--relative">
					<Loader />
				</div>
			}>
			<ShowLineupDeferred {...props} />
		</Suspense>
	)
}

export default ShowLineup
