import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ElementEngagement from './../../common/utils/element-engagement.jsx'

class MarketingCopy extends Component {
	static propTypes = {
		index: PropTypes.number,
		showIndex: PropTypes.number,
		userId: PropTypes.string,
		className: PropTypes.string,
		position: PropTypes.string
	}

	render() {
		const {
			className,
			children,
			position,
			viewportName,
			arrowPosition,
			showIndex,
			index,
			userId
		} = this.props

		const colClass = (viewportName === 'small') ? '' : 'push-9-of-12'

		return ((showIndex === index && !userId) && (
				<ElementEngagement offset={0.25}>
					<div className={`marketingcopy ${className || ''}`}>
						<div className={`${arrowPosition ? `arrow--${arrowPosition}` : ''} ${position === 'right' ? `marketingcopy--right ${colClass}` : 'marketingcopy--left'}`}>
							{children}
						</div>
					</div>
				</ElementEngagement>
			)
		)
	}
}

export default MarketingCopy
