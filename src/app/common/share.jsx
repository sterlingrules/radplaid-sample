import URI from 'urijs'
import React, { Component } from 'react'
import { track } from './../helpers/analytics.jsx'
import moment from 'moment'

import {
	IconClose,
	IconTwitter,
	IconFacebook,
	IconMessenger,
	IconMail,
} from './icons.jsx'

export const getSharePath = (username, path, slug, source, medium) => {
	let uri = new URI(`${process.env.BASE_CLIENT_URL}${path || '/shows'}/${slug}`)

	if (username) {
		uri.search({ ref: username })
	}

	return uri.addSearch({
		utm_source: source,
		utm_medium: medium,
		utm_campaign: 'share'
	})
}

const trackShare = ({ target }) => {
	let { slug, source } = target.dataset
	let { name } = target

	track('share', {
		action: name,
		show_id: slug,
		source: source,
		label: slug
	})
}

/**
 * TODO: Update tweet action to this:
 *
 * 	<a
 * 		href="https://twitter.com/share?ref_src=twsrc%5Etfw"
 * 		class="twitter-share-button"
 * 		data-text="Yep"
 * 		data-url="http://localhost:3000/project/6e8aRV3gpiNY9MLFvajV"
 * 		data-show-count="false">
 * 		Tweet
 * 	</a>
 */

export const TwitterButton = ({ path, url, slug, title, date, username, source, btnClass, iconClass }) => {
	url = url || getSharePath(username, path, slug, source, 'twitter')

	return (
		<a
			name="twitter"
			data-slug={slug}
			data-source={source}
			target="_blank"
			title="Share on Twitter"
			className={btnClass}
			onClick={trackShare}
			href={`https://twitter.com/share?
				url=${encodeURIComponent(url)}&
				via=getradplaid&
				text=${encodeURIComponent(title)}${date ? ' on ' + moment(date).format('MMMM Do') : ''}`}>

			<IconTwitter className={iconClass} />
		</a>
	)
}

export const FacebookButton = ({ path, url, slug, username, source, btnClass, iconClass }) => {
	url = url || getSharePath(username, path, slug, source, 'facebook')

	return (
		<a
			name="facebook"
			data-slug={slug}
			data-source={source}
			target="_blank"
			title="Share on Facebook"
			className={btnClass}
			onClick={trackShare}
			href={`https://www.facebook.com/dialog/share?
				app_id=${process.env.FACEBOOK_APP_ID}&
				display=popup&
				href=${encodeURIComponent(url)}&
				redirect_uri=${url}`}>

			<IconFacebook className={iconClass} />
		</a>
	)
}

export const MessengerButton = ({ path, url, slug, username, source, btnClass, iconClass }) => {
	url = url || getSharePath(username, path, slug, source, 'messenger')

	return (
		<a
			name="facebook_messenger"
			data-slug={slug}
			data-source={source}
			target="_blank"
			title="Send in Messenger"
			className={btnClass}
			onClick={trackShare}
			href={`fb-messenger://share/?
				link=${encodeURIComponent(url)}&
				app_id=${process.env.FACEBOOK_APP_ID}`}>

			<IconMessenger className={iconClass} />
		</a>
	)
}

export const MailButton = ({ path, url, slug, title, date, username, source, btnClass, iconClass }) => {
	url = url || getSharePath(username, path, slug, source, 'email')

	return (
		<a
			name="mail"
			data-slug={slug}
			data-source={source}
			target="_blank"
			title="Share via Email"
			className={btnClass}
			onClick={trackShare}
			href={`mailto:?
				subject=${encodeURIComponent(title)}${date ? ' on ' + moment(date).format('MMMM Do') : ''}&
				body=${encodeURIComponent(url)}`}>

			<IconMail className={iconClass} />
		</a>
	)
}
