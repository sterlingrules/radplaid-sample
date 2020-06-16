import React, { Component, Suspense, lazy } from 'react'
import { Loader } from './../../common/loader.jsx'

const MapDeferred = lazy(() => import('./map.jsx'))

const Map = (props) => {
	return (
		<Suspense fallback={<Loader />}>
			<MapDeferred {...props} />
		</Suspense>
	)
}

export default Map
