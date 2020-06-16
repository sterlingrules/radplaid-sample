import React, { Component } from 'react'
import HeadMeta from './../common/headmeta.jsx'
import { TwitterPicker } from 'react-color'

class WidgetBuilder extends Component {
	state = {
		primaryColor: '#3f5765',
		accentColor: '#58cfd7',
		keylineColor: '#d3e1e7',
		buttonTextColor: '',
		buttonBackground: '',
	}

	constructor(props) {
		super(props)

		this.widget = null
	}

	componentDidMount() {
		this.renderWidget()
	}

	renderWidget = () => {
		if (!window.EmbeddableWidget) {
			return
		}

		if (this.widget) {
			EmbeddableWidget.unmount()
		}

		EmbeddableWidget.mount({
			parentElement: '#rp-root',

			// Query
			query: '',
			venue: '',
			location: 'Portland, ME',
			cost: '',
			tag: '',
			genre: '',

			// Style
			// primaryColor: '',
			// accentColor: '',
			// keylineColor: '',
			// buttonColor: '',
			// logoType: '',
			...this.state
		})

		this.widget = true
	}

	render() {
		return (
			<section id="widget-builder" className="color-primary">

				<HeadMeta
					title="Build Your Event Widget | Rad Plaid"
					description="Share Portland's local music scene with your fans"
					canonicalUrl={`${process.env.BASE_CLIENT_URL}/widget-builder`}
					artwork={{
						url: `http://res.cloudinary.com/radplaid/image/upload/f_auto/v1555855910/services/promoter-alice-donovan-rouse.jpg`,
						secure_url: `https://res.cloudinary.com/radplaid/image/upload/f_auto/v1555855910/services/promoter-alice-donovan-rouse.jpg`,
						width: '1600',
						height: '1067'
					}} />

				<figure id="hero" className="hero hero-services" />

				<div className="grid relative">
					<div className="row">
						<div className="col col-6-of-12 col-medium-8-of-12 col-small-12-of-12 push-1-of-12 medium-un-push">
							<div className="bubble about-missioncopy">
								<div className="bubble-copy bubble-content">
									<h2 className="typography-hero-headline typography-gradient">Build Your Own Event Widget</h2>
									<p>Share Portland's local music scene with your fans. Customize your widget below.</p>
								</div>
							</div>
						</div>
					</div>

					<div className="row">
						<div className="col col-4-of-12 col-small-12-of-12">
							<div className="widget-control">
								<h3 className="typography-body-headline">Primary Color</h3>
								<TwitterPicker
									color={this.state.primaryColor}
									width="100%"
									triangle="hide"
									onChangeComplete={(color) => {
										console.log('color ', color)
										this.setState({ primaryColor: color.hex })
										this.renderWidget()
									}} />

								<h3 className="typography-body-headline">Accent Color</h3>
								<TwitterPicker
									color={this.state.accentColor}
									width="100%"
									triangle="hide"
									onChangeComplete={(color) => {
										console.log('color ', color)
										this.setState({ accentColor: color.hex })
										this.renderWidget()
									}} />
							</div>
						</div>
						<div className="col col-8-of-12 col-small-12-of-12">
							<h3 className="typography-body-headline">Preview</h3>
							<div id="rp-root" />
						</div>
					</div>
				</div>

			</section>
		)
	}
}

export default WidgetBuilder
