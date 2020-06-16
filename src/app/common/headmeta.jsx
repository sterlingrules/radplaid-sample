import React from 'react'
import Helmet from 'react-helmet'
import { META_TITLE, META_DESCRIPTION, APPLE_APP_ID } from './../constants.jsx'
import { getArtworkUrl } from './../shows/components/showartwork.jsx'
import { stripHtml } from './../helpers'

/**
 * Meta Tags management Component
 *
 * @params title {String}
 * @params socialTitle {String}
 * @params canonicalUrl {String}
 * @params description {String}
 * @params artwork {String}
 *
 * @return HeadMeta {Component}
 */
const HeadMeta = ({ title, socialTitle, appUrl, canonicalUrl, description, artwork }) => {
	let artworkType = 'url'
	let path = getArtworkUrl({ path: artwork })

	if (typeof window !== 'undefined') {
		artworkType = window.location.protocol === 'https:' ? 'secure_url' : 'url'
	}

	title = title || META_TITLE
	socialTitle = socialTitle || title
	description = description ? stripHtml(description) : META_DESCRIPTION
	canonicalUrl = canonicalUrl || process.env.BASE_CLIENT_URL

	return (
		<Helmet>
			{/*General Meta Data*/}
			<title>{title}</title>

			<link rel="canonical" href={canonicalUrl} />

			{appUrl ? (
				<meta name="apple-itunes-app" content={`app-id=${APPLE_APP_ID}, app-argument=${appUrl}`} />
			) : (
				<meta name="apple-itunes-app" content={`app-id=${APPLE_APP_ID}`} />
			)}

			{description && (<meta name="description" content={description} />)}

			{/*Facebook*/}
			{description && (<meta property="og:description" content={description} />)}

			<meta property="og:url" content={canonicalUrl} />
			<meta property="og:title" content={socialTitle} />
			<meta property="og:locale" content="en_US" />

			{artwork && (<meta property="og:image" content={path || artwork[artworkType]} />)}
			{artwork && (<meta property="og:image:width" content={artwork.width} />)}
			{artwork && (<meta property="og:image:height" content={artwork.height} />)}

			{/*Twitter Card*/}
			<meta name="twitter:card" content="summary" />
			<meta name="twitter:site" content="@getradplaid" />
			<meta name="twitter:creator" content="@getradplaid" />
			<meta name="twitter:url" content={canonicalUrl} />
			<meta name="twitter:title" content={socialTitle} />

			{description && (<meta name="twitter:description" content={description} />)}
			{artwork && (<meta name="twitter:image" content={path || artwork[artworkType]} />)}
		</Helmet>
	)
}

export default HeadMeta
