import React from 'react'
import ViewableMonitor from './../../common/utils/viewable-monitor.jsx'

const Partners = ({ style = {} }) => {
	return (
		<ViewableMonitor minHeight={128} className="marketingsignup bg-relationships" style={style || {}}>
			<div className="grid text-left">
				<div className="flex">
					<a href="https://www.eatdrinklucky.com/" title="Eat Drink Lucky" target="_blank" className="relationship"><img src="https://res.cloudinary.com/radplaid/image/upload/f_auto/v1548022596/press/eatdrinklucky.png" alt="Eat Drink Lucky" /></a>
					<a href="https://www.coffeebydesign.com/" title="Coffee By Design" target="_blank" className="relationship"><img src="https://res.cloudinary.com/radplaid/image/upload/f_auto/v1545074092/press/cbd.png" alt="Coffee By Design" /></a>
					<a href="https://onelongfellowsquare.com/" title="One Longfellow Square" target="_blank" className="relationship"><img src="https://res.cloudinary.com/radplaid/image/upload/f_auto/v1545074093/press/ols.png" alt="One Longfellow Square" /></a>
					<a href="/?query=Genos+Rock+Club" title="Geno's Rock Club" target="_blank" className="relationship"><img src="https://res.cloudinary.com/radplaid/image/upload/f_auto/v1545074092/press/genos.png" alt="Geno's Rock Club" /></a>
					<a href="https://www.wmpg.org/show/fri1930/" title="WMPG Local Motives" target="_blank" className="relationship"><img src="https://res.cloudinary.com/radplaid/image/upload/f_auto/v1556723861/press/wmpg.png" alt="WMPG Local Motives" /></a>
					<a href="https://noshowmagazine.com" title="No Show Magazine" target="_blank" className="relationship"><img src="https://res.cloudinary.com/radplaid/image/upload/f_auto/v1563052912/press/noshow.png" alt="No Show Magazine" /></a>
				</div>
			</div>
		</ViewableMonitor>
	)
}

export default Partners
