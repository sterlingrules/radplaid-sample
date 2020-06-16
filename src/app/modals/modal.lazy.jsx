import React, { Component, Suspense, lazy } from 'react'
import { Loader } from './../common/loader.jsx'

const ModalSignupDeferred = lazy(() => import('./components/modal-signup.jsx'))
const ModalEditProfileDeferred = lazy(() => import('./components/modal-editprofile.jsx'))
const ModalClaimDeferred = lazy(() => import('./components/modal-claim.jsx'))

export const ModalSignup = (props) => {
	return (
		<Suspense fallback={<div />}>
			<ModalSignupDeferred {...props} />
		</Suspense>
	)
}

export const ModalEditProfile = (props) => {
	return (
		<Suspense fallback={<div />}>
			<ModalEditProfileDeferred {...props} />
		</Suspense>
	)
}

export const ModalClaim = (props) => {
	return (
		<Suspense fallback={<div />}>
			<ModalClaimDeferred {...props} />
		</Suspense>
	)
}
