import {Link} from 'react-router-dom';
import './EventCard.scss'
import { Tooltip } from 'react-tooltip'
import { capitalizeFirstLetter, convertDateFormat, convertDateFormatDay, convertDateFormatMDY } from '../../../utils/stringUtils';
import 'react-tooltip/dist/react-tooltip.css'
function EventCard({event,filter, key, index}) {
    // console.log(event)
    let statusTooltip = {
        content:'',
        variant:''
    };
    if (event.status === 'confirmed') {
        statusTooltip.content = 'Event confirmed';
        statusTooltip.variant = 'success';
    }
    else if (event.status === 'pending') {
        statusTooltip.content = 'Event confirmation pending';
        statusTooltip.variant = 'warning';
    }
  return (
    <Link className={`event ${event.status} ${filter}`} to={`/event/${event.id}`} key={key}
        data-tooltip-id="my-tooltip"
        data-tooltip-content={statusTooltip.content}
        data-tooltip-place="top-end"
        data-tooltip-variant={statusTooltip.variant}
        
        
    >

<Tooltip id="my-tooltip" className='card-tooltip'/>
        <div className="cover-wrap">
            <div
                className={`project-cover ${event.type}`}
                style={{
                    backgroundImage: event.eventCover ? `url(${event.eventCover})` : '',
                    backgroundSize: event.eventCover ? 'cover' : '',
                }}
            />
        </div>
        <div className="project-details">
            <div className="details-top">
                <div className="left">
                    <h4 className="project-title">{event.type=='wedding' ? event.firstName+' & '+event.lastName :event.firstName+' '+event.lastName}</h4>
                    <div className="project-type-services">
                        <p className="project-type">{capitalizeFirstLetter(event.type)}</p>
                        <div className="card-services">
                            {event.services.photography.status&&<div className="icon photography"></div>}
                            {event.services.videography.status&&<div className="icon videography"></div>}
                        </div>
                    </div>
            
                </div>
                <div className="right">
                    <div className="status-signal"></div>
                </div>
            </div>
            <div className="details-bottom">
                <div className="left">
                    <div className="day">
                    {
                        convertDateFormatDay(event.dateOfShoot)
                    }
                    </div>
                    <div className="date">
                    {
                        convertDateFormatMDY(event.dateOfShoot)
                    }
                    </div>
                </div>
                <div className="right">
                    <div className="amount">
                        ${event.payments.total}
                    </div>
                </div>
                
                
            </div>
        </div>
        
    </Link>
    );
}

    export default EventCard;
