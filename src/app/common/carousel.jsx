import isEqual from 'lodash/isEqual'
import isFunction from 'lodash/isFunction'
import defaults from 'lodash/defaults'
import React, { Component, Children } from 'react'
import Glide from '@glidejs/glide'
import { IconChevron, IconChevronLeft } from './icons.jsx'

/**
 * Docs
 *
 * <div className="grid">
 *		<div className="row">
 *			<Carousel></Carousel>
 *		</div>
 * </div>
 */

class Carousel extends Component {
	constructor(props) {
		super(props)

		this.state = {
			options: {
				perView: 3,
				rewind: false,
				keyboard: false,
				bound: true,
				breakpoints: {
					767: {
						perView: 2,
						peek: {
							before: 0,
							after: 32
						}
					}
				}
			},
			carousel: null
		}
	}

	componentWillMount() {
		const _options = this.props.options || {}
		const options = defaults(_options, this.state.options)

		this.setState({ options })
	}

	componentDidMount() {
		this._createCarousel()
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(nextProps.children, this.props.children)
		)
	}

	componentDidUpdate(prevProps, prevState) {
		if (isEqual(prevProps.children, this.props.children)) {
			return
		}

		let { carousel } = this.state

		if (carousel) {
			carousel.destroy()
			this._createCarousel()
		}
	}

	_createCarousel = () => {
		const { options } = this.state
		const { onMountAfter, onRun, children, minLength = 0 } = this.props
		const events = [ 'run.after' ]

		if (!this.carouselEl || children.length <= minLength) {
			return
		}

		let _carousel = new Glide(this.carouselEl, options)

		if (!_carousel) {
			return
		}

		if (onMountAfter) {
			_carousel.on('mount.after', onMountAfter)
		}

		if (onRun) {
			_carousel.on(events, () => {
				onRun({ index: _carousel.index })
			})
		}

		_carousel.mount()

		this.setState({ carousel: _carousel })
	}

	render() {
		let { id, title, children, className, titleClass } = this.props
		let { options } = this.state
		let childCount = Children.count(children)

		return (
			<div id={id} ref={node => this.carouselEl = node} className={`glide ${className || ''}`}>
				{title ? (
					<div className={`glide__header ${titleClass || ''}`}>
						<div className="glide__title text-ellipsis">
							{title}
						</div>
						{childCount > options.perView && (
							<div className="glide__arrows" data-glide-el="controls">
								<button className="btn btn-circlecompact btn--small glide__arrow glide__arrow--left" data-glide-dir="<" title="prev" aria-label="prev">
									<IconChevronLeft />
								</button>
								<button className="btn btn-circlecompact btn--small glide__arrow glide__arrow--right" data-glide-dir=">" title="next" aria-label="next">
									<IconChevron />
								</button>
							</div>
						)}
					</div>
				) : (
					childCount > options.perView && (
						<div className={`glide__header ${titleClass || ''}`}>
							<div className="glide__arrows" data-glide-el="controls">
								<button className="btn btn-circlecompact btn--small glide__arrow glide__arrow--left" data-glide-dir="<" title="prev" aria-label="prev">
									<IconChevronLeft />
								</button>
								<button className="btn btn-circlecompact btn--small glide__arrow glide__arrow--right" data-glide-dir=">" title="next" aria-label="next">
									<IconChevron />
								</button>
							</div>
						</div>
					)
				)}

				<div data-glide-el="track" className="glide__track">
					<ul className="glide__slides">
						{Children.map(children, (child, index) => {
							return (
								<li key={index} className="glide__slide">{child}</li>
							)
						})}
					</ul>
				</div>
			</div>
		)
	}
}

export default React.memo(Carousel)
