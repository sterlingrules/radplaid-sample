import React from 'react'
import { Range, getTrackBackground } from 'react-range'

const InputRange = ({ value, step, min, max, onChange, onFinalChange }) => {
	return (
		<div className="form-range">
			<Range
				step={step}
				min={min}
				max={max}
				values={[ value ]}
				onChange={([ v ]) => onChange(v)}
				onFinalChange={([ v ]) => onFinalChange(v)}
				renderTrack={({ props, children }) => (
					<div
						{...props}
						className="form-range-track"
						style={props.style}>

						{children}

					</div>
				)}
				renderThumb={({ props }) => (
					<div
						{...props}
						className="form-range-thumb"
						style={props.style} />
				)} />
		</div>
	)
}

export default InputRange
