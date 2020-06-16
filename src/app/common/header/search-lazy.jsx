import React, { Component, Suspense, lazy } from 'react'
import { Loader } from './../loader.jsx'

const SearchDeferred = lazy(() => import('./search.jsx'))

const Search = (props) => {
	return (
		<Suspense
			fallback={
				<div className="loader-view loader--absolute">
					<Loader />
				</div>
			}>
			<SearchDeferred {...props} />
		</Suspense>
	)
}

export default Search
