import React, { useEffect } from 'react';
// Utils
import { capitalizeFirstLetter } from '../../utils/stringUtils';

export default function EventService ({ event, service}) {

	const crewLabel= service==='photography' ? 'Photographer' : 'Videographer';
	const crewCount = service==='photography' ? event?.services.photography.photographers : event?.services.videography.videographers;
	
	let  deliveryLabel = service==='photography' ? event?.services.photography.delivery : event?.services.videography.delivery;
	let deliveryTime='';
	if 		(deliveryLabel === 'standard') 	deliveryTime = '1-2 Weeks'
	else if (deliveryLabel === 'express') 	deliveryTime = '3 Days'
	else if (deliveryLabel === 'premium') 	deliveryTime = '1 Day'

	return (
		<div className={`section ${service}`}>
			{/* Header */}
			<div className="section-header box">
				<div className="box-label">{capitalizeFirstLetter(service)}</div>
				<div className="header-icon"></div>
			</div>
			{/* Crew */}
			<div className="label">{capitalizeFirstLetter(service)} Crew</div>
			<div className="box">{crewLabel} 1</div>
			<div className={`box ${crewCount > 1 ? '':'hide'} `}>{crewLabel} 2</div>
			{ 	
				crewCount < 2 &&
				<div className="input-box"><div className="icon"></div>{crewLabel}</div>
			}
			<div className="input-box"><div className="icon"></div> Assistant</div>
			{/* Delivery */}
			<div className="label">Delivery</div>
			<div className=" delivery box">
				<p>{capitalizeFirstLetter(deliveryLabel)}</p>
				<p>{deliveryTime}</p>
			</div>
			{/* RAW */}
			{ event?.services[service].rawPhotos || event?.services[service].rawVideos &&
			<div className=" raw box">
				Raw {service=='photography'? 'Photos': 'Videos'}
			</div>
			}	
		</div>
	)
}
// Line complexity => 50 -> 47