import React from 'react'
import moment from 'moment'

const TicketMaster = ({ ticketSource, viewportName }) => {
	const adInfo = {
		isCurrent: moment().isBefore('2019-08-12'),
		asset: {
			300: '629388',
			468: '629386'
		},
		accountId: '1331224',
		campaignId: '4272',
		alt: 'Save More When You Buy Four. Rally your crew and save on 4-pack summer concert tickets today!'
	}

	const canDisplayAd = (
		adInfo.isCurrent &&
		ticketSource.toLowerCase().indexOf('ticketmaster') >= 0
	)

	return (canDisplayAd ? (
		viewportName === 'small' ? (
			<div className="showdetail-item text-center">
				<a href={`//ticketmaster.evyy.net/c/${adInfo.accountId}/${adInfo.asset[300]}/${adInfo.campaignId}`} target="_blank">
					<img src={`//a.impactradius-go.com/display-ad/${adInfo.campaignId}-${adInfo.asset[300]}`} border={0} alt={adInfo.alt} width={300} height={250} />
				</a>
				<img
					border={0}
					height={0}
					width={0}
					src={`//ticketmaster.evyy.net/i/${adInfo.accountId}/${adInfo.asset[300]}/${adInfo.campaignId}`}
					style={{ position: 'static', visibility: 'hidden' }} />
			</div>
		) : (
			<div className="showdetail-item text-center">
				<a href={`//ticketmaster.evyy.net/c/${adInfo.accountId}/${adInfo.asset[468]}/${adInfo.campaignId}`} target="_blank">
					<img src={`//a.impactradius-go.com/display-ad/${adInfo.campaignId}-${adInfo.asset[468]}`} border="0" alt={adInfo.alt} width={468} height={60} />
				</a>
				<img
					border={0}
					height={0}
					width={0}
					src={`//ticketmaster.evyy.net/i/${adInfo.accountId}/${adInfo.asset[468]}/${adInfo.campaignId}`}
					style={{ position: 'static', visibility: 'hidden' }} />
			</div>
		)
	) : (
		<div />
	))
}

export default TicketMaster
