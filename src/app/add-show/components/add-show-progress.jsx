import React from 'react'
import { Link } from 'react-router-dom'

const AddShowProgress = ({ viewportName, progress = [], slug, ...props }) => {
	let nextLabel = `Next${viewportName === 'small' ? '' : ', information'}`
	let stepName = 'Artwork'
	let step = Number(props.step)
	let path = slug ? `/shows/${slug}/edit/` : `/add/`

	switch(props.step) {
		case '2':
			stepName = 'Information'
			nextLabel = `Next${viewportName === 'small' ? '' : ', add lineup'}`
			break
		case '3':
			stepName = 'Lineup'
			nextLabel = 'Next'
			break
		case '4':
			stepName = 'Venue'
			nextLabel = `Almost done`
			break
		case '5':
			stepName = `Review`
			break
	}

	return (
		<div className="addshow-progress grid">
			<div className="row">
				<div className={`addshow-progress-${step} col col-6-of-12 push-3-of-12 col-medium-5-of-8 push-medium-2-of-8 col-small-12-of-12 push-small-0-of-12`}>
					<div className="addshow-progress-bar-wrapper">
						<div className="addshow-progress-bar"></div>
					</div>

					<div className="addshow-stepname typography-subheadline inlineblock">{stepName}</div>

					<div className="addshow-control right">
						{/*Back Button*/}
						{step > 1 && (
							<Link to={`${path}${step - 1}`}
								className={`btn btn-back btn--small ${(step < 2 || progress.length > 0) ? 'btn-back--disabled' : 'btn--primary'}`}
								title="← Back">
								{`←`}
							</Link>
						)}

						{/*Ability to Skip Artwork*/}
						{step === 1 && (
							<Link to={`${path}${step + 1}`} className={`btn btn--small ${props.required[step - 1].valid ? 'btn--disabled' : 'btn--primary'}`}>
								{viewportName === 'small' ? 'Later' : 'Add later'}
							</Link>
						)}

						{/*Next Button*/}
						{step < 5 && (
							<Link to={`${path}${step + 1}`}
								className={`btn btn--small ${props.required[step - 1].valid ? 'btn--primary' : 'btn--disabled'}`}>
								{nextLabel}
							</Link>
						)}

						{/*Final Step*/}
						{step == 5 && (
							<button onClick={props.submit}
								className={`btn btn--small ${progress.length > 0 ? 'btn--disabled' : 'btn--primary'}`}>
								{slug ? 'Update' : 'Publish'}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default React.memo(AddShowProgress)
