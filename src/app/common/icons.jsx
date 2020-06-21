import React from 'react'

export const IconWarning = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="48" height="48" viewBox="0 0 48 48"><path d="M2 42h44L24 4 2 42zm24-6h-4v-4h4v4zm0-8h-4v-8h4v8z"/></svg>
	)
}

export const IconCircleSelect = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			width="48"
			height="48"
			viewBox="0 0 48 48"
			fill="currentColor"
			focusable="false">
			<path d="M22,8.1v-4c-4,0.4-7.7,2-10.6,4.4l2.9,2.9C16.4,9.7,19.1,8.5,22,8.1z M36.7,8.5c-3-2.4-6.6-4-10.7-4.4v4
				c2.9,0.4,5.6,1.5,7.8,3.2C33.8,11.4,36.6,8.5,36.7,8.5z M39.9,22h4c-0.4-4-2-7.7-4.4-10.6l-2.8,2.9C38.3,16.4,39.5,19.1,39.9,22z
				 M11.4,14.2l-2.9-2.8c-2.4,3-4,6.6-4.4,10.6h4C8.5,19.1,9.7,16.4,11.4,14.2z M8.1,26h-4c0.4,4,2,7.7,4.4,10.7l2.9-2.8
				C9.7,31.6,8.5,28.9,8.1,26z M36.6,33.8l2.8,2.8c2.4-3,4-6.6,4.4-10.6h-4C39.5,28.9,38.3,31.6,36.6,33.8z M26,39.9v4
				c4-0.4,7.7-2,10.7-4.4l-2.8-2.8C31.6,38.3,28.9,39.5,26,39.9z M11.4,39.5c3,2.4,6.6,4,10.6,4.4v-4c-2.9-0.4-5.6-1.5-7.8-3.2
				L11.4,39.5z"/>
		</svg>
	)
}

export const IconLock = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={`icon ${props.className || ''}`}
		style={props.style || {}}
		width="48"
		height="48"
		viewBox="0 0 48 48"
		fill="currentColor"
		focusable="false">
		<path d="M36 16h-2v-4c0-5.52-4.48-10-10-10S14 6.48 14 12v4h-2c-2.21 0-4 1.79-4 4v20c0 2.21 1.79 4 4 4h24c2.21 0 4-1.79 4-4V20c0-2.21-1.79-4-4-4zM24 34c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm6.2-18H17.8v-4c0-3.42 2.78-6.2 6.2-6.2 3.42 0 6.2 2.78 6.2 6.2v4z"/>
	</svg>
)

export const IconHelp = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={`icon ${props.className || ''}`}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="currentColor"
		focusable="false">
	    <path fill="none" d="M0 0h24v24H0z"/>
	    <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
	</svg>
)

export const IconClose = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			width="48"
			height="48"
			viewBox="0 0 48 48"
			fill="currentColor">
			<path d="M38 12.83L35.17 10 24 21.17 12.83 10 10 12.83 21.17 24 10 35.17 12.83 38 24 26.83 35.17 38 38 35.17 26.83 24z"/>
		</svg>
	)
}

export const IconMove = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			width="48"
			height="48"
			viewBox="0 0 48 48"
			fill="currentColor"
			focusable="false">
			<path d="M20 18h8v-6h6L24 2 14 12h6v6zm-2 2h-6v-6L2 24l10 10v-6h6v-8zm28 4L36 14v6h-6v8h6v6l10-10zm-18 6h-8v6h-6l10 10 10-10h-6v-6z"/>
		</svg>
	)
}

export const IconNotificationActive = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="currentColor"
			focusable="false">
			<path d="M0 0h24v24H0z" fill="none"/>
			<path d="M7.58 4.08L6.15 2.65C3.75 4.48 2.17 7.3 2.03 10.5h2c.15-2.65 1.51-4.97 3.55-6.42zm12.39 6.42h2c-.15-3.2-1.73-6.02-4.12-7.85l-1.42 1.43c2.02 1.45 3.39 3.77 3.54 6.42zM18 11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2v-5zm-6 11c.14 0 .27-.01.4-.04.65-.14 1.18-.58 1.44-1.18.1-.24.15-.5.15-.78h-4c.01 1.1.9 2 2.01 2z"/>
		</svg>
	)
}

export const IconRefresh = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			width="48"
			height="48"
			viewBox="0 0 48 48"
			fill="currentColor"
			focusable="false"
			title={props.label || 'refresh'}
			alt={props.label || 'refresh'}>
			<path d="M35.3 12.7C32.41 9.8 28.42 8 24 8 15.16 8 8.02 15.16 8.02 24S15.16 40 24 40c7.45 0 13.69-5.1 15.46-12H35.3c-1.65 4.66-6.07 8-11.3 8-6.63 0-12-5.37-12-12s5.37-12 12-12c3.31 0 6.28 1.38 8.45 3.55L26 22h14V8l-4.7 4.7z"/>
		</svg>
	)
}

export const IconArrowDown = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="48" height="48" viewBox="0 0 48 48"><path d="M14 20l10 10 10-10z"/></svg>
	)
}

export const IconDone = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			width="48"
			height="48"
			viewBox="0 0 48 48"
			fill="currentColor"
			focusable="false">
			<path d="M18 32.34L9.66 24l-2.83 2.83L18 38l24-24-2.83-2.83z"/>
		</svg>
	)
}

export const IconHeart = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			style={props.style || {}}
			width="48"
			height="48"
			viewBox="0 0 48 48"
			fill="currentColor"
			focusable="false">
			<path d="M24 42.7l-2.9-2.63C10.8 30.72 4 24.55 4 17 4 10.83 8.83 6 15 6c3.48 0 6.82 1.62 9 4.17C26.18 7.62 29.52 6 33 6c6.17 0 11 4.83 11 11 0 7.55-6.8 13.72-17.1 23.07L24 42.7z"/>
		</svg>
	)
}

export const IconHeartEmpty = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} style={props.style || {}} width="48" height="48" viewBox="0 0 48 48"><path d="M33 6c-3.48 0-6.82 1.62-9 4.17C21.82 7.62 18.48 6 15 6 8.83 6 4 10.83 4 17c0 7.55 6.8 13.72 17.1 23.07L24 42.7l2.9-2.63C37.2 30.72 44 24.55 44 17c0-6.17-4.83-11-11-11zm-8.79 31.11l-.21.19-.21-.19C14.28 28.48 8 22.78 8 17c0-3.99 3.01-7 7-7 3.08 0 6.08 1.99 7.13 4.72h3.73C26.92 11.99 29.92 10 33 10c3.99 0 7 3.01 7 7 0 5.78-6.28 11.48-15.79 20.11z"/></svg>
	)
}

export const IconStar = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			style={props.style || {}}
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="currentColor"
			focusable="false">
			<path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z"/>
		</svg>
	)
}

export const IconPlus = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			width="48"
			height="48"
			viewBox="0 0 48 48"
			fill="currentColor"
			focusable="false">
			<path d="M38 26H26v12h-4V26H10v-4h12V10h4v12h12v4z"/>
		</svg>
	)
}

export const IconRemove = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			width="48"
			height="48"
			viewBox="0 0 48 48"
			fill="currentColor"
			focusable="false">
			<path d="M38 26H10v-4h28v4z"/>
		</svg>
	)
}

export const IconBookmark = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="48" height="48" viewBox="0 0 48 48"><path d="M34 6H14c-2.21 0-3.98 1.79-3.98 4L10 42l14-6 14 6V10c0-2.21-1.79-4-4-4z"/></svg>
	)
}

export const IconBookmarkBorder = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="48" height="48" viewBox="0 0 48 48"><path d="M34 6H14c-2.21 0-3.98 1.79-3.98 4L10 42l14-6 14 6V10c0-2.21-1.79-4-4-4zm0 30l-10-4.35L14 36V10h20v26z"/></svg>
	)
}

export const IconOpenInNew = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="48" height="48" viewBox="0 0 48 48"><path d="M38 38H10V10h14V6H10c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V24h-4v14zM28 6v4h7.17L15.51 29.66l2.83 2.83L38 12.83V20h4V6H28z"/></svg>
	)
}

export const IconLocation = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="48" height="48" viewBox="0 0 48 48"><path d="M24 4c-7.73 0-14 6.27-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.73-6.27-14-14-14zm0 19c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
	)
}

export const IconLocationOff = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="48" height="48" viewBox="0 0 24 24"><path d="M16.37,16.1L11.75,11.47L11.64,11.36L3.27,3L2,4.27L5.18,7.45C5.06,7.95 5,8.46 5,9C5,14.25 12,22 12,22C12,22 13.67,20.15 15.37,17.65L18.73,21L20,19.72M12,6.5A2.5,2.5 0 0,1 14.5,9C14.5,9.73 14.17,10.39 13.67,10.85L17.3,14.5C18.28,12.62 19,10.68 19,9A7,7 0 0,0 12,2C10,2 8.24,2.82 6.96,4.14L10.15,7.33C10.61,6.82 11.26,6.5 12,6.5Z" /></svg>
	)
}

export const IconChart = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={`icon ${props.className || ''}`}
		width="48"
		height="48"
		viewBox="0 0 48 48"
		fill="currentColor"
		focusable="false">
		<path d="M46 16c0 2.2-1.8 4-4 4-.36 0-.7-.04-1.02-.14l-7.12 7.1c.1.32.14.68.14 1.04 0 2.2-1.8 4-4 4s-4-1.8-4-4c0-.36.04-.72.14-1.04l-5.1-5.1c-.32.1-.68.14-1.04.14s-.72-.04-1.04-.14l-9.1 9.12c.1.32.14.66.14 1.02 0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.36 0 .7.04 1.02.14l9.12-9.1c-.1-.32-.14-.68-.14-1.04 0-2.2 1.8-4 4-4s4 1.8 4 4c0 .36-.04.72-.14 1.04l5.1 5.1c.32-.1.68-.14 1.04-.14s.72.04 1.04.14l7.1-7.12c-.1-.32-.14-.66-.14-1.02 0-2.2 1.8-4 4-4s4 1.8 4 4z"/>
	</svg>
)

export const IconLightning = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={`icon ${props.className || ''}`}
		width="48"
		height="48"
		viewBox="0 0 48 48"
		fill="currentColor"
		focusable="false">
		<path d="M14 4v22h6v18l14-24h-8l8-16z"/>
	</svg>
)

export const IconSearch = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			width="48"
			height="48"
			viewBox="0 0 48 48"
			fill="currentColor"
			focusable="false">
			<path d="M31 28h-1.59l-.55-.55C30.82 25.18 32 22.23 32 19c0-7.18-5.82-13-13-13S6 11.82 6 19s5.82 13 13 13c3.23 0 6.18-1.18 8.45-3.13l.55.55V31l10 9.98L40.98 38 31 28zm-12 0c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z"/>
		</svg>
	)
}

export const IconMenu = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			style={props.style || {}}
			width="48"
			height="48"
			viewBox="0 0 48 48"
			fill="currentColor"
			focusable="false">
			<path d="M6 36h36v-4H6v4zm0-10h36v-4H6v4zm0-14v4h36v-4H6z"/>
		</svg>
	)
}

export const IconAccountCircle = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="48" height="48" viewBox="0 0 48 48"><path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 6c3.31 0 6 2.69 6 6 0 3.32-2.69 6-6 6s-6-2.68-6-6c0-3.31 2.69-6 6-6zm0 28.4c-5.01 0-9.41-2.56-12-6.44.05-3.97 8.01-6.16 12-6.16s11.94 2.19 12 6.16c-2.59 3.88-6.99 6.44-12 6.44z"/></svg>
	)
}

export const IconChat = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="48" height="48" viewBox="0 0 48 48"><path d="M42 12h-4v18H12v4c0 1.1.9 2 2 2h22l8 8V14c0-1.1-.9-2-2-2zm-8 12V6c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v28l8-8h20c1.1 0 2-.9 2-2z"/></svg>
	)
}

export const IconDrag = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="24" height="24" viewBox="0 0 24 24">
			<path fill="none" d="M0 0h24v24H0V0z"/>
			<path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
		</svg>

	)
}

export const IconVerified = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="48" height="48" viewBox="0 0 48 48">
			<path d="M24 2L6 10v12c0 11.11 7.67 21.47 18 24 10.33-2.53 18-12.89 18-24V10L24 2zm-4 32l-8-8 2.83-2.83L20 28.34l13.17-13.17L36 18 20 34z"/>
		</svg>
	)
}

export const IconToday = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			width="48"
			height="48"
			viewBox="0 0 48 48"
			fill="currentColor"
			focusable="false">
			<path d="M38 6h-2V2h-4v4H16V2h-4v4h-2c-2.21 0-3.98 1.79-3.98 4L6 38c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V10c0-2.21-1.79-4-4-4zm0 32H10V16h28v22zM14 20h10v10H14z"/>
		</svg>
	)
}

//
// Editor
//
export const IconLink = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="48" height="48" viewBox="0 0 48 48"><path d="M7.8 24c0-3.42 2.78-6.2 6.2-6.2h8V14h-8C8.48 14 4 18.48 4 24s4.48 10 10 10h8v-3.8h-8c-3.42 0-6.2-2.78-6.2-6.2zm8.2 2h16v-4H16v4zm18-12h-8v3.8h8c3.42 0 6.2 2.78 6.2 6.2s-2.78 6.2-6.2 6.2h-8V34h8c5.52 0 10-4.48 10-10s-4.48-10-10-10z"/></svg>
	)
}

export const IconQuote = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="48" height="48" viewBox="0 0 48 48"><path d="M12 34h6l4-8V14H10v12h6zm16 0h6l4-8V14H26v12h6z"/></svg>
	)
}

export const IconUnorderedList = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="48" height="48" viewBox="0 0 48 48"><path d="M8 21c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM8 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 24c-1.67 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.33-3-3-3zm6 5h28v-4H14v4zm0-12h28v-4H14v4zm0-16v4h28v-4H14z"/></svg>
	)
}

export const IconEdit = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			style={props.style || {}}
			width="48"
			height="48"
			viewBox="0 0 48 48"
			fill="currentColor">
			<path d="M6 34.5V42h7.5l22.13-22.13-7.5-7.5L6 34.5zm35.41-20.41c.78-.78.78-2.05 0-2.83l-4.67-4.67c-.78-.78-2.05-.78-2.83 0l-3.66 3.66 7.5 7.5 3.66-3.66z"/>
		</svg>
	)
}

export const IconTrash = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={`icon ${props.className || ''}`}
		style={props.style || {}}
		width="48"
		height="48"
		viewBox="0 0 48 48"
		fill="currentColor"
		focusable="false">
		<path d="M12 38c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4V14H12v24zM38 8h-7l-2-2H19l-2 2h-7v4h28V8z"/>
	</svg>
)

//
// Social
//

export const IconShare = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={`icon ${props.className || ''}`}
		style={props.style || {}}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round">
		<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
		<polyline points="16 6 12 2 8 6" />
		<line x1="12" y1="2" x2="12" y2="15" />
	</svg>
)

export const IconTwitter = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} aria-labelledby="twitter-icon" role="img" viewBox="0 0 24 24">
			<title id="twitter-icon">Twitter icon</title>
			<path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/>
		</svg>
	)
}

export const IconInstagram = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} aria-labelledby="instagram-icon" role="img" viewBox="0 0 24 24">
			<title id="simpleicons-instagram-icon">Instagram icon</title>
			<path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
		</svg>
	)
}

export const IconFacebook = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon icon-facebook ${props.className || ''}`} aria-labelledby="facebook-icon" role="img" viewBox="0 0 24 24">
			<title id="facebook-icon">Facebook icon</title>
			<path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.408.593 24 1.324 24h11.494v-9.294H9.689v-3.621h3.129V8.41c0-3.099 1.894-4.785 4.659-4.785 1.325 0 2.464.097 2.796.141v3.24h-1.921c-1.5 0-1.792.721-1.792 1.771v2.311h3.584l-.465 3.63H16.56V24h6.115c.733 0 1.325-.592 1.325-1.324V1.324C24 .593 23.408 0 22.676 0"/>
		</svg>
	)
}

export const IconTumblr = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} aria-labelledby="tumblr-icon" role="img" viewBox="0 0 24 24">
			<title id="tumblr-icon">Tumblr icon</title>
			<path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 9.999 0h3.517v6.114h4.801v3.633h-4.82v7.47c.016 1.001.375 2.371 2.207 2.371h.09c.631-.02 1.486-.205 1.936-.419l1.156 3.425c-.436.636-2.4 1.374-4.156 1.404h-.178l.011.002z"/>
		</svg>
	)
}

export const IconSpotify = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon icon-spotify ${props.className || ''}`} aria-labelledby="spotify-icon" role="img" viewBox="0 0 168 168">
			<title id="spotify-icon">Spotify icon</title>
			<path d="m83.996 0.277c-46.249 0-83.743 37.493-83.743 83.742 0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l0.001-0.004zm38.404 120.78c-1.5 2.46-4.72 3.24-7.18 1.73-19.662-12.01-44.414-14.73-73.564-8.07-2.809 0.64-5.609-1.12-6.249-3.93-0.643-2.81 1.11-5.61 3.926-6.25 31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-0.903-8.148-4.35-1.04-3.453 0.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-0.001zm0.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219-1.254-4.14 1.08-8.513 5.221-9.771 29.581-8.98 78.756-7.245 109.83 11.202 3.73 2.209 4.95 7.016 2.74 10.733-2.2 3.722-7.02 4.949-10.73 2.739z" />
		</svg>
	)
}

export const IconMedium = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			aria-labelledby="medium-icon"
			role="img"
			viewBox="0 0 195 195"
			fill="currentColor"
			focusable="false">

			<title id="medium-icon">Medium.com icon</title>
			<g id="Monogram">
				<rect id="Rectangle-path" x="0" y="0" width="195" height="195"></rect>
				<path d="M46.5340803,65.2157554 C46.6968378,63.6076572 46.0836,62.018231 44.8828198,60.93592 L32.6512605,46.2010582 L32.6512605,44 L70.6302521,44 L99.9859944,108.380952 L125.794585,44 L162,44 L162,46.2010582 L151.542017,56.2281011 C150.640424,56.9153477 150.193188,58.0448862 150.380019,59.1628454 L150.380019,132.837155 C150.193188,133.955114 150.640424,135.084652 151.542017,135.771899 L161.755369,145.798942 L161.755369,148 L110.38282,148 L110.38282,145.798942 L120.963119,135.527337 C122.002801,134.487948 122.002801,134.182246 122.002801,132.592593 L122.002801,73.0417402 L92.585901,147.755438 L88.6106443,147.755438 L54.3622782,73.0417402 L54.3622782,123.115814 C54.0767278,125.221069 54.7759199,127.3406 56.2581699,128.863022 L70.0186741,145.55438 L70.0186741,147.755438 L31,147.755438 L31,145.55438 L44.7605042,128.863022 C46.2319621,127.338076 46.8903838,125.204485 46.5340803,123.115814 L46.5340803,65.2157554 Z" id="Shape" fill="#f0f5ff"></path>
			</g>
		</svg>
	)
}

export const IconMessenger = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} viewBox="96 93 322 324"><path d="M257 93c-88.918 0-161 67.157-161 150 0 47.205 23.412 89.311 60 116.807V417l54.819-30.273C225.449 390.801 240.948 393 257 393c88.918 0 161-67.157 161-150S345.918 93 257 93zm16 202l-41-44-80 44 88-94 42 44 79-44-88 94z" /></svg>
	)
}

export const IconCopy = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5zm18-4H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 16H7V3h14v14z"/></svg>
	)
}

export const IconSoundCloud = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon icon-soundcloud ${props.className || ''}`} width="92.985px" height="53.006px" viewBox="0 0 92.985 53.006">
			<title id="soundcloud-icon">SoundCloud icon</title>
			<path d="M1.053,24.152c-0.194,0-0.348,0.15-0.373,0.364L0,29.681l0.68,5.076
				c0.025,0.214,0.179,0.363,0.373,0.363c0.188,0,0.341-0.148,0.371-0.361l0,0v-0.001c0,0,0,0,0,0.001l0.806-5.078l-0.806-5.166
				C1.395,24.302,1.24,24.152,1.053,24.152z M4.877,21.33c-0.032-0.222-0.191-0.375-0.387-0.375c-0.197,0-0.36,0.158-0.387,0.375
				c0,0.002-0.914,8.351-0.914,8.351l0.914,8.166c0.026,0.219,0.189,0.377,0.387,0.377c0.195,0,0.354-0.154,0.386-0.375l1.04-8.168
				L4.877,21.33z M19.281,13.627c-0.375,0-0.685,0.307-0.703,0.697l-0.728,15.364l0.728,9.929c0.019,0.388,0.328,0.694,0.703,0.694
				c0.373,0,0.682-0.307,0.704-0.696v0.003l0.823-9.93l-0.823-15.364C19.963,13.934,19.654,13.627,19.281,13.627z M11.826,18.967
				c-0.288,0-0.523,0.23-0.546,0.537l-0.82,10.18l0.82,9.849c0.022,0.305,0.258,0.535,0.546,0.535c0.285,0,0.52-0.23,0.545-0.535
				l0.932-9.849l-0.932-10.182C12.346,19.197,12.111,18.967,11.826,18.967z M26.857,40.31c0.465,0,0.843-0.375,0.862-0.855l0.714-9.762
				L27.72,9.238c-0.019-0.48-0.397-0.855-0.862-0.855c-0.469,0-0.848,0.376-0.863,0.856c0,0.001-0.633,20.453-0.633,20.453l0.633,9.766
				C26.01,39.934,26.389,40.31,26.857,40.31z M42.367,40.356c0.64,0,1.168-0.527,1.18-1.175v0.007v-0.007l0.498-9.482L43.547,6.075
				c-0.011-0.647-0.54-1.175-1.18-1.175c-0.641,0-1.17,0.527-1.18,1.176l-0.445,23.615c0,0.015,0.445,9.496,0.445,9.496
				C41.197,39.829,41.727,40.356,42.367,40.356z M34.553,40.319c0.557,0,1.006-0.447,1.021-1.017v0.007l0.606-9.614L35.573,9.092
				c-0.015-0.57-0.464-1.016-1.021-1.016c-0.561,0-1.01,0.446-1.022,1.016l-0.539,20.604l0.54,9.612
				C33.543,39.872,33.992,40.319,34.553,40.319z M15.539,40.229c0.331,0,0.599-0.265,0.624-0.614l0.878-9.931l-0.878-9.447
				c-0.024-0.349-0.292-0.612-0.624-0.612c-0.336,0-0.604,0.265-0.625,0.616l-0.773,9.443l0.773,9.93
				C14.936,39.964,15.203,40.229,15.539,40.229z M8.143,39.685c0.242,0,0.438-0.191,0.466-0.455l0.986-9.548l-0.985-9.908
				c-0.029-0.265-0.225-0.456-0.467-0.456c-0.245,0-0.441,0.192-0.466,0.456c0,0.001-0.868,9.908-0.868,9.908l0.868,9.546
				C7.701,39.493,7.897,39.685,8.143,39.685z M38.445,8.749c-0.605,0-1.09,0.481-1.102,1.097l-0.492,19.851l0.492,9.552
				c0.012,0.608,0.496,1.089,1.102,1.089c0.604,0,1.086-0.48,1.1-1.096v0.008l0.552-9.552L39.545,9.844
				C39.531,9.23,39.049,8.749,38.445,8.749z M23.055,40.33c0.418,0,0.763-0.341,0.783-0.776l0.768-9.863l-0.768-18.878
				c-0.021-0.436-0.365-0.776-0.783-0.776c-0.422,0-0.766,0.341-0.784,0.776c0,0.001-0.68,18.878-0.68,18.878l0.681,9.867
				C22.289,39.989,22.633,40.33,23.055,40.33z M31.631,39.399v-0.005l0.66-9.7l-0.66-21.144c-0.016-0.525-0.43-0.937-0.941-0.937
				c-0.514,0-0.928,0.411-0.942,0.937l-0.586,21.143l0.587,9.705c0.014,0.52,0.428,0.931,0.941,0.931c0.512,0,0.924-0.411,0.941-0.934
				V39.399z M81.549,17.506c-1.567,0-3.062,0.317-4.424,0.888C76.215,8.086,67.571,0,57.027,0c-2.58,0-5.095,0.508-7.316,1.367
				c-0.863,0.334-1.093,0.678-1.101,1.345v36.3c0.009,0.7,0.552,1.283,1.235,1.352c0.029,0.003,31.499,0.019,31.703,0.019
				c6.316,0,11.437-5.121,11.437-11.438S87.865,17.506,81.549,17.506z M46.272,2.68c-0.687,0-1.251,0.564-1.261,1.257l-0.516,25.765
				l0.517,9.351c0.009,0.683,0.573,1.246,1.26,1.246c0.685,0,1.249-0.563,1.259-1.256v0.011l0.561-9.352L47.531,3.935
				C47.521,3.244,46.957,2.68,46.272,2.68z M9.236,47.654c-1.353-0.318-1.719-0.488-1.719-1.024c0-0.378,0.305-0.769,1.219-0.769
				c0.781,0,1.391,0.317,1.939,0.878l1.231-1.194c-0.805-0.841-1.78-1.341-3.108-1.341c-1.684,0-3.049,0.951-3.049,2.5
				c0,1.682,1.098,2.182,2.67,2.547c1.609,0.365,1.902,0.61,1.902,1.159c0,0.646-0.477,0.927-1.487,0.927
				c-0.817,0-1.585-0.28-2.183-0.977L5.42,51.458c0.646,0.951,1.891,1.548,3.316,1.548c2.33,0,3.354-1.097,3.354-2.718
				C12.09,48.434,10.59,47.971,9.236,47.654z M17.09,44.204c-2.328,0-3.705,1.804-3.705,4.401s1.377,4.4,3.705,4.4
				s3.707-1.803,3.707-4.4S19.418,44.204,17.09,44.204z M17.09,51.312c-1.377,0-1.951-1.183-1.951-2.706
				c0-1.524,0.574-2.707,1.951-2.707c1.379,0,1.951,1.183,1.951,2.707C19.041,50.129,18.469,51.312,17.09,51.312z M27.686,49.13
				c0,1.365-0.672,2.207-1.756,2.207c-1.085,0-1.743-0.866-1.743-2.231v-4.769h-1.708v4.793c0,2.486,1.391,3.876,3.451,3.876
				c2.17,0,3.463-1.427,3.463-3.9v-4.769h-1.707V49.13z M36.756,47.947c0,0.476,0.024,1.548,0.024,1.865
				c-0.11-0.22-0.39-0.646-0.597-0.964l-3.025-4.512h-1.633v8.536h1.683v-3.756c0-0.476-0.024-1.548-0.024-1.865
				c0.109,0.219,0.391,0.646,0.597,0.964l3.134,4.657h1.524v-8.536h-1.683V47.947z M43.303,44.337h-2.67v8.536h2.547
				c2.195,0,4.366-1.269,4.366-4.268C47.546,45.483,45.741,44.337,43.303,44.337z M43.18,51.215h-0.84v-5.219h0.902
				c1.805,0,2.549,0.865,2.549,2.609C45.791,50.166,44.973,51.215,43.18,51.215z M52.825,45.898c0.768,0,1.256,0.342,1.561,0.927
				l1.585-0.731c-0.537-1.109-1.513-1.89-3.122-1.89c-2.229,0-3.791,1.804-3.791,4.401c0,2.694,1.499,4.4,3.73,4.4
				c1.549,0,2.573-0.719,3.158-1.926l-1.438-0.854c-0.451,0.757-0.903,1.086-1.671,1.086c-1.28,0-2.024-1.171-2.024-2.706
				C50.812,47.021,51.546,45.898,52.825,45.898z M59.156,44.337h-1.707v8.536h5.13v-1.684h-3.423V44.337z M67.076,44.204
				c-2.33,0-3.707,1.804-3.707,4.401s1.377,4.4,3.707,4.4c2.328,0,3.706-1.803,3.706-4.4S69.404,44.204,67.076,44.204z M67.076,51.312
				c-1.379,0-1.951-1.183-1.951-2.706c0-1.524,0.572-2.707,1.951-2.707c1.376,0,1.949,1.183,1.949,2.707
				C69.025,50.129,68.452,51.312,67.076,51.312z M77.67,49.13c0,1.365-0.669,2.207-1.754,2.207c-1.087,0-1.744-0.866-1.744-2.231
				v-4.769h-1.707v4.793c0,2.486,1.39,3.876,3.451,3.876c2.17,0,3.462-1.427,3.462-3.9v-4.769H77.67V49.13z M84.181,44.337h-2.669
				v8.536h2.547c2.196,0,4.365-1.269,4.365-4.268C88.424,45.483,86.62,44.337,84.181,44.337z M84.059,51.215h-0.841v-5.219h0.903
				c1.803,0,2.547,0.865,2.547,2.609C86.668,50.166,85.851,51.215,84.059,51.215z"/>
		</svg>
	)
}

export const IconMail = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			width="48"
			height="48"
			viewBox="0 0 48 48"
			fill="currentColor"
			focusable="false"
			title={props.label || 'mail'}
			alt={props.label || 'mail'}>
			<path d="M40 8H8c-2.21 0-3.98 1.79-3.98 4L4 36c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zm0 8L24 26 8 16v-4l16 10 16-10v4z"/>
		</svg>
	)
}

export const IconMailUnread = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			fill="currentColor"
			focusable="false"
			title={props.label || 'mail unread'}
			alt={props.label || 'mail unread'}>
			<path d="M-618-3000H782V600H-618zM0 0h24v24H0z" fill="none"/>
			<path d="M20 6H10v6H8V4h6V0H6v6H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>
		</svg>
	)
}

//
// Navigation
//
export const IconChevron = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			width="48"
			height="48"
			viewBox="0 0 48 48"
			fill="currentColor"
			focusable="false"
			title={props.label || 'chevron'}
			alt={props.label || 'chevron'}>
			<path d="M20 12l-2.83 2.83L26.34 24l-9.17 9.17L20 36l12-12z"/>
		</svg>
	)
}

export const IconChevronLeft = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			width="48"
			height="48"
			viewBox="0 0 48 48"
			fill="currentColor"
			focusable="false"
			title={props.label || 'chevron'}
			alt={props.label || 'chevron'}>
			<path d="M30.83 14.83L28 12 16 24l12 12 2.83-2.83L21.66 24z"/>
		</svg>
	)
}

export const IconMore = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="48" height="48" viewBox="0 0 48 48"><path d="M12 20c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm24 0c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-12 0c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/></svg>
	)
}

//
// Media Icons
//
export const IconPlay = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="48" height="48" viewBox="0 0 48 48"><path d="M16 10v28l22-14z"/></svg>
	)
}

export const IconPause = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="48" height="48" viewBox="0 0 48 48"><path d="M12 38h8V10h-8v28zm16-28v28h8V10h-8z"/></svg>
	)
}

export const IconSkipNext = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="48" height="48" viewBox="0 0 48 48"><path d="M12 36l17-12-17-12v24zm20-24v24h4V12h-4z"/></svg>
	)
}

export const IconSkipPrevious = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`icon ${props.className || ''}`} width="48" height="48" viewBox="0 0 48 48"><path d="M12 12h4v24h-4zm7 12l17 12V12z"/></svg>
	)
}

export const IconImageAdd = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon ${props.className || ''}`}
			style={props.style || {}}
			width="48"
			height="48"
			viewBox="0 0 24 24"
			fill="currentColor"
			focusable="false">
			<path d="M5,3A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H14.09C14.03,20.67 14,20.34 14,20C14,19.32 14.12,18.64 14.35,18H5L8.5,13.5L11,16.5L14.5,12L16.73,14.97C17.7,14.34 18.84,14 20,14C20.34,14 20.67,14.03 21,14.09V5C21,3.89 20.1,3 19,3H5M19,16V19H16V21H19V24H21V21H24V19H21V16H19Z" />
		</svg>
	)
}
