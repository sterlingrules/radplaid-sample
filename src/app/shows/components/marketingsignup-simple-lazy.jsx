import React, { Component, Suspense, lazy } from 'react'
import { Loader } from './../../common/loader.jsx'

const MarketingSignupSimpleDeferred = lazy(() => import('./marketingsignup-simple.jsx'))

const MarketingSignupSimple = (props) => {
	return (
		<Suspense fallback={<Loader />}>
			<MarketingSignupSimpleDeferred {...props} />
		</Suspense>
	)
}

export default MarketingSignupSimple
