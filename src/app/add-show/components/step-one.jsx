import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { IconOpenInNew } from './../../common/icons.jsx'
import Artwork from './artwork.jsx'

class StepOne extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Fragment>
				<div className="show-hero show-hero--addshow">
					<div className="bubble bubble--nopadding" style={{ overflow: 'hidden' }}>
						<Artwork />
					</div>
				</div>
				<div className="row">
					<div className="col col-6-of-12 col-small-12-of-12 center relative">
						<div className="addshow-artwork-footer">
							<h3 className="typography-small-headline">Need artwork?</h3>
							<p className="typography-small">Try using a <strong>photo of the headliner</strong> or visit <a href="https://unsplash.com/" target="_blank" className="color-violator underline"><strong>Unsplash</strong></a> for our favorite free beautiful high-resolution images.</p>

							<h3 className="typography-small-headline">Too large?</h3>
							<p className="typography-small">Minimize your artwork online at <a href="https://compressor.io/compress" target="_blank" className="color-violator underline"><strong>Compress.io</strong></a>.</p>

							<p className="typography-small">You can always skip and add artwork later. We'll use your artists photos for now.</p>
						</div>
					</div>
				</div>
			</Fragment>
		)
	}
}

export default React.memo(StepOne)
