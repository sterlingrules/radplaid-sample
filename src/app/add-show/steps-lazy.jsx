import React, { Component, Suspense, lazy } from 'react'
import { Loader } from './../common/loader.jsx'

const StepOneDeferred = lazy(() => import('./components/step-one.jsx'))
const StepTwoDeferred = lazy(() => import('./components/step-two.jsx'))
const StepThreeDeferred = lazy(() => import('./components/step-three.jsx'))
const StepFourDeferred = lazy(() => import('./components/step-four.jsx'))
const StepFiveDeferred = lazy(() => import('./components/step-five.jsx'))

export const StepOne = (props) => {
	return (
		<Suspense fallback={<Loader />}>
			<StepOneDeferred {...props} />
		</Suspense>
	)
}

export const StepTwo = (props) => {
	return (
		<Suspense fallback={<Loader />}>
			<StepTwoDeferred {...props} />
		</Suspense>
	)
}

export const StepThree = (props) => {
	return (
		<Suspense fallback={<Loader />}>
			<StepThreeDeferred {...props} />
		</Suspense>
	)
}

export const StepFour = (props) => {
	return (
		<Suspense fallback={<Loader />}>
			<StepFourDeferred {...props} />
		</Suspense>
	)
}

export const StepFive = (props) => {
	return (
		<Suspense fallback={<Loader />}>
			<StepFiveDeferred {...props} />
		</Suspense>
	)
}
