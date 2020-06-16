import * as Helpers from './../src/app/helpers/index.js'
import moment from 'moment-timezone'

const CURRENT_DATE = moment.tz('America/New_York').startOf('day').format(process.env.DATE_FORMAT)

describe('Helpers', () => {
	describe('#getDateRange', () => {
		test('default response', () => {
			let from = CURRENT_DATE
			expect(Helpers.getDateRange()).toEqual({ from, to: '' })
		})

		test('tomorrow', () => {
			let from = Helpers.TOMORROW
			expect(Helpers.getDateRange('/tomorrow')).toEqual({ from, to: '' })
		})

		xtest('weekend', () => {
			let from = Helpers.WEEKEND
			expect(Helpers.getDateRange('/weekend')).toEqual({ from, to: '' })
		})

		test('next-weekend', () => {
			let from = Helpers.NEXT_WEEKEND
			console.log('next-weekend from ', from)
			expect(Helpers.getDateRange('/next-weekend')).toEqual({ from, to: '' })
		})

		test('next-week', () => {
			let from = Helpers.NEXT_WEEK
			console.log('next-week from ', from)
			expect(Helpers.getDateRange('/next-week')).toEqual({ from, to: '' })
		})
	})

	describe('#toTitleCase', () => {
		test('matt anderson', () => {
			expect(Helpers.toTitleCase('matt anderson')).toEqual('Matt Anderson')
		})

		test('Dj test', () => {
			expect(Helpers.toTitleCase('Dj test')).toEqual('DJ Test')
		})

		test('test Of test', () => {
			expect(Helpers.toTitleCase('test Of test')).toEqual('Test of Test')
		})

		test('the bombpops', () => {
			expect(Helpers.toTitleCase('the bombpops')).toEqual('The Bombpops')
		})

		test('of mice and men', () => {
			expect(Helpers.toTitleCase('of mice and men')).toEqual('Of Mice and Men')
		})

		test('blues-rock', () => {
			expect(Helpers.toTitleCase('blues-rock')).toEqual('Blues-Rock')
		})
	})

	describe('#getDateName', () => {
		test('today', () => {
			console.log('today ', CURRENT_DATE)
			expect(
				Helpers.getDateName(
					Helpers.getDateRange('today').from
				)
			).toBe('today')
		})

		test('tomorrow', () => {
			console.log('tomorrow ', Helpers.TOMORROW)
			expect(
				Helpers.getDateName(
					Helpers.getDateRange('tomorrow').from
				)
			).toBe('tomorrow')
		})

		xtest('weekend', () => {
			console.log('weekend ', Helpers.WEEKEND)

			// the start of the weekend can be tomorrow AND the weekend
			let isToday = Helpers.getDateRange('weekend').from === CURRENT_DATE
			let isTomorrow = Helpers.getDateRange('weekend').from === Helpers.TOMORROW
			let _expectation = isToday ? 'today' : isTomorrow ? 'tomorrow' : 'weekend'

			expect(
				Helpers.getDateName(
					Helpers.getDateRange('weekend').from
				)
			).toBe(_expectation)
		})

		test('next-week', () => {
			console.log('next-week ', Helpers.NEXT_WEEK)
			expect(
				Helpers.getDateName(
					Helpers.getDateRange('next-week').from
				)
			).toBe('next-week')
		})

		test('next-weekend', () => {
			console.log('next-weekend ', Helpers.NEXT_WEEKEND)
			expect(
				Helpers.getDateName(
					Helpers.getDateRange('next-weekend').from
				)
			).toBe('next-weekend')
		})
	})

	describe('#getCurrentDate', () => {
		test('is current date', () => {
			expect(Helpers.getCurrentDate()).toBe(CURRENT_DATE)
		})
	})

	describe('#formatTitleFromLineup', () => {
		test('single artist lineup', () => {
			let lineup = [{
				artists: [{
					name: 'Belle Reve'
				}]
			}]

			expect(Helpers.formatTitleFromLineup(lineup)).toBe('Belle Reve')
		})

		test('two artist lineup', () => {
			let lineup = [
				{ artists: [{ name: 'The Bombpops' }] },
				{ artists: [{ name: 'Belle Reve' }] }
			]

			expect(Helpers.formatTitleFromLineup(lineup)).toBe('The Bombpops and Belle Reve')
		})

		test('three artist lineup', () => {
			let lineup = [
				{ artists: [{ name: 'Bad Cop, Bad Cop' }] },
				{ artists: [{ name: 'The Bombpops' }] },
				{ artists: [{ name: 'Belle Reve' }] }
			]

			expect(Helpers.formatTitleFromLineup(lineup)).toBe('Bad Cop, Bad Cop, The Bombpops, and Belle Reve')
		})

		test('artist lineup with prepended text', () => {
			let prepend = 'Check out '
			let lineup = [
				{ artists: [{ name: 'Bad Cop, Bad Cop' }] },
				{ artists: [{ name: 'The Bombpops' }] },
				{ artists: [{ name: 'Belle Reve' }] }
			]

			expect(Helpers.formatTitleFromLineup(lineup, prepend)).toBe('Check out Bad Cop, Bad Cop, The Bombpops, and Belle Reve')
		})
	})
})
