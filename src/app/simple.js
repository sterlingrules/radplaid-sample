(function () {
	const App = {
		_validateEmail: (email) => {
			const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ig
			return !!(email.match(regex))
		},

		init: () => {
			console.info('running...? ', fetch)

			App.setupEmailLogin()
			App.setupFBLogin()
		},

		setupEmailLogin: () => {
			const nameEl = document.querySelector('#signup-name')
			const nameInputEl = document.querySelector('#signup-name-input')
			const emailEl = document.querySelector('#signup-email')
			const emailInputEl = document.querySelector('#signup-email-input')
			const submitEl = document.querySelector('#signup-submit')
			const submitButtonEl = document.querySelector('#signup-submit-button')

			let emailValue
			let nameValue

			emailInputEl.addEventListener('input', () => {
				emailValue = emailInputEl.value

				let isValid = App._validateEmail(emailValue)

				// Toggle Name
				if (emailValue && nameEl.style.display !== 'block') {
					nameEl.style.display = 'block'
				}
				else if (!emailValue) {
					nameEl.style.display = 'none'
				}

				// Email Validation styles
				if (isValid && !emailEl.classList.contains('form--valid')) {
					emailEl.classList.remove('form--invalid')
					emailEl.classList.add('form--valid')
				}
				else if (!isValid) {
					emailEl.classList.remove('form--valid')
					emailEl.classList.add('form--invalid')
				}
			})

			nameInputEl.addEventListener('input', () => {
				nameValue = nameInputEl.value

				// Toggle Submit
				if (emailValue && nameValue && submitEl.style.display !== 'block') {
					submitEl.style.display = 'block'
				}
				else if (!emailValue && !nameValue) {
					submitEl.style.display = 'none'
				}

				// Name Validation styles
				if (nameValue && !nameEl.classList.contains('form--valid')) {
					nameEl.classList.remove('form--invalid')
					nameEl.classList.add('form--valid')
				}
				else if (!nameValue) {
					nameEl.classList.remove('form--valid')
					nameEl.classList.add('form--invalid')
				}
			})

			submitButtonEl.addEventListener('click', (evt) => {
				evt.preventDefault()
				App.onEmailSignup(emailValue, nameValue)
			})
		},

		setupFBLogin: () => {
			if (typeof FB === 'undefined') {
				return
			}

			const btnEl = document.querySelector('#signup-facebook')
			const options = {
				scope: 'public_profile,email',
				// fields: 'name,email,picture',
			}

			btnEl.addEventListener('click', (evt) => {
				evt.preventDefault()
				FB.login(App.onFBSignup, options)
			})
		},

		// Events
		onEmailSignup: (email, name) => {
			if (!email || !name) {
				return
			}

			let heroContentEl = document.querySelector('#hero-content')
			let heroContentCopy = heroContentEl.querySelector('p')
			let settings = {
				method: 'post',
				path: `/auth/send-token`,
				data: {
					user: email,
					name,
				}
			}

			superagent.post(`${process.env.BASE_SERVER_URL}/${process.env.API_VERSION}${settings.path}`)
				.timeout({
					response: 10000 * 2, // Wait 10 seconds for the server to start sending,
					deadline: 30000 // but allow 30 seconds for the file to finish loading.
				})
				.set('Content-Type', 'application/json')
				.set('x-radplaid-client-id', process.env.RADPLAID_CLIENT_ID)
				.send(settings.data)
				.end((err, reply) => {
					if (err || !reply) {
						return
					}

					let { body } = reply

					console.log('body ', body)

					if (body) {
						heroContentCopy.innerHTML = `A secure login link has just been sent to <strong>${email}</strong>. You should see this email shortly or check your spam&nbsp;folder.`
						heroContentEl.classList.add('is-success')
					}
				})
		},

		onFBSignup: (reply) => {
			if (!reply || !reply.authResponse) {
				return
			}

			let { accessToken } = reply.authResponse
			let options = {
				fields: 'name,email,picture',
			}

			FB.api('/me', options, (reply) => {
				if (!reply) {
					return
				}

				let user = reply
				let settings = {
					method: 'post',
					path: '/auth/facebook',
					data: { user }
				}

				superagent.post(`${process.env.BASE_SERVER_URL}/${process.env.API_VERSION}${settings.path}`)
					.timeout({
						response: 10000 * 2, // Wait 10 seconds for the server to start sending,
						deadline: 30000 // but allow 30 seconds for the file to finish loading.
					})
					.set('Content-Type', 'application/json')
					.set('x-radplaid-client-id', process.env.RADPLAID_CLIENT_ID)
					.send(settings.data)
					.end((err, reply) => {
						if (err || !reply) {
							return
						}

						let { body } = reply

						console.log('body ', body)

						if (!body.jwt) {
							return
						}

						window.location.href = `${process.env.BASE_CLIENT_URL}/?jwt=${body.jwt}`
					})
			})
		}
	}

	App.init()
})()
