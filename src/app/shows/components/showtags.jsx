import React from 'react'
import { Link } from 'react-router-dom'
import URI from 'urijs'

const Tags = ({ tags }) => {
	let uri = new URI()

	tags = tags || []
	tags = tags.map((tag) => {
		return (
			<li key={tag.id || tag.value}>
				<Link to={{ pathname: `/`, search: `tag=${tag.value}` }}>#{tag.value}</Link>
			</li>
		)
	})

	return (tags.length > 0 && (
		<ul className="showitem-tags">
			{tags}
		</ul>
	))
}

export default Tags
