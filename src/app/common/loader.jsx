import React from 'react'

export const Loader = ({ size, progress, center }) => {
	return (typeof progress === 'number' ? (
		<div className={`loader loader--noanimate loader--${size || 'large'}`}>
			<div className="loader-inset">
				<div className="loader-pill" style={{ transform: `translateX(${progress - 100}%)` }} />
			</div>
		</div>
	) : (
		<div className={`loader loader--${size || 'large'} ${center ? 'loader--center' : ''}`}>
			<div className="loader-pill" />
		</div>
	))
}

export const LoadingCopyComponent = ({ showsLength }) => {
	return (showsLength > 0 ? (
			<li className="showlist-endcap">
				<Loader />
			</li>
		) : (
			<li className="showitem-empty text-center">
				<figure className="state searching"></figure>
				<h2 className="typography-subheadline">Finding you the raddest shows,<br />hang tight!</h2>
			</li>
		)
	)
}
