import React from 'react'
import keys from 'lodash/keys'
import isString from 'lodash/isString'
import { getDateTitle } from './../../helpers'
import { SEARCH_CLASS, CONTROL_CLASS } from './index.jsx'
import { IconStar } from './../icons.jsx'

const SearchSummary = ({ summary, viewportName }) => {
	const _keys = keys(summary)
	const toggleMobileSearch = () => {
		let headerEl = document.querySelector('header')
		let queryInputEl = (headerEl) ? headerEl.querySelector('.header-search .search-input input') : null

		if (!headerEl || viewportName !== 'small') {
			return
		}

		headerEl.classList.toggle(SEARCH_CLASS)

		if (headerEl.classList.contains(SEARCH_CLASS)) {
			headerEl.classList.remove(CONTROL_CLASS)

			setTimeout(() => queryInputEl.focus(), 500)
		}
	}

	return (
		<div className="search-summary">
			<div className="search-summary-content" onClick={toggleMobileSearch}>
				{_keys.map((key, index) => {
					let isBest = (isString(summary[key]) && summary[key].toLowerCase().indexOf('best') >= 0)
					let isToday = (key === 'date' && getDateTitle(summary[key]) === 'today')

					return (!isToday ? (
						<div key={index} className={`violator violator--${key}`}>
							{isBest && (
								<IconStar className="fill-white inlineblock icon--small" />
							)}
							{key === 'date' ? getDateTitle(summary[key]) : summary[key]}
						</div>
					) : (
						<span key={index} />
					))
				})}
			</div>
		</div>
	)
}

export default SearchSummary
