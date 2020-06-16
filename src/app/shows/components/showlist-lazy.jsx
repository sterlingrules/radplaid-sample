import React, { Component, Suspense, lazy } from 'react'
import { Loader } from './../../common/loader.jsx'

const ShowListDeferred = lazy(() => import('./showlist.jsx'))

const ShowList = (props) => {
	return (
		<Suspense
			fallback={
				<div className="loader-view loader--relative">
					<Loader />
				</div>
			}>
			<ShowListDeferred {...props} />
		</Suspense>
	)
}

export default ShowList
