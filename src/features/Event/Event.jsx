import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Styles
import './Event.scss';
// Components
import EventService from '../../components/EventService/EventService';
import PaymentInsignt from '../../components/PaymentInsight/PaymentInsignt';
// Functions
import { countdownTo } from '../../utils/dateUtils';
import { deleteEventFromFirestore, rescheduleEventDateInFirestore, updateEventStatusInFirestore } from '../../firebase/functions/firestore';
import { capitalizeFirstLetter, convert24To12HourFormat, convertDateFormat, convertDateFormatDay, convertDateFormatMDY, convertToGoogleMapsURL } from '../../utils/stringUtils';
import ExpanceInsight from '../../components/ExpanceInsight/ExpanceInsight';
import Calendar from 'react-calendar';
import { uploadEventCoverPhoto } from '../../utils/storageOperations';

export default function Event({ events,updateEventLocal,deleteEventLocal,addPaymentLocal,updatePaymentLocal,showAlert}) {
  const navigate = useNavigate();
  let { id } = useParams();
  // States
  const [ rescheduleModal, setReschduleModal ] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState();
  const [coverFile,setCoverFile]  = useState()
  const  [isPhotosImported,setIsPhotosImported] = useState(false)
  const [importFileSize, setImportFileSize] = useState();
  const  [uploadStatus,setUploadStatus] = useState('close')

  let event;
  useEffect(()=>{

    setRescheduleDate(event.dateOfShoot)
  },[event])
  if (!events) return;
  event = events.find((p) => p.id === id);
  // console.log(event)
  if (!event) {
    setTimeout(()=>navigate('/events'),100); 
    return;
  }
  else document.title = `${event.firstName}'s ${event.type}`


  // Functions 
  const confirmEvent = ()=>{
    updateEventStatusInFirestore(id,'confirmed')
    .then(()=>{
      event.status='confirmed'
      updateEventLocal(id,event);
      showAlert('success','Event confirmed successfully');
    })
  }
  const deleteEvent = ()=>{
    deleteEventFromFirestore (id)
    .then(()=>{
      event.status='confirmed'
      deleteEventLocal(id);
      showAlert('success','Event deleted successfully');
    })
  } 
  const recheduleEvent = ()=>{
    rescheduleEventDateInFirestore(id,rescheduleDate.toString()).
    then((event)=>{
      event.status='confirmed'
      updateEventLocal(id,event);
      showAlert('success','Event recheduled successfully');
    })
    .catch((error)=>{
      showAlert('error',error.message);
    })
    setReschduleModal(false);
  }
  // function to import file from file input to store
  // later uploadCover can upload file to firestoreee
  const handleFileInputChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setIsPhotosImported(true);
    setUploadStatus('open')
    setIsPhotosImported(false);
    let uploadedCover=await uploadEventCoverPhoto(selectedFiles[0], id,importFileSize,setUploadStatus,showAlert)
    // console.log(uploadedImages)
    setCoverFile(uploadedCover)
    let updatedEvent = {...event, ...{eventCover:uploadedCover}}
    console.log(updatedEvent)
    updateEventLocal(event.id, updatedEvent)
};

  // fuynction to upload cover image from file input to 
  const uploadCover =()=>{
    console.log('upload cover')
  }
  

  return (
    <main className='event-page'>
      <div className="event-cover-info">
        <div 
        className={`event-cover box ${event.type} ${uploadStatus==='open' ? 'uploading' : ''}`}
        style={{backgroundImage:`url(${uploadStatus==='open' ? 'https://media.tenor.com/t5DMW5PI8mgAAAAi/loading-green-loading.gif' : event.eventCover} )`}}>

        <div className="options">
          {
            event.eventCover===undefined ?
            <>
              <label htmlFor="fileInput" className={`button ${isPhotosImported ? 'secondary' : 'tertiary'}`} >Upload Cover
              </label>
              <input id='fileInput' type="file" multiple onChange={handleFileInputChange} />
              
            </> :
             <>
              <label htmlFor="fileInput" className={`button ${isPhotosImported ? 'secondary' : 'tertiary'}`} >Update Cover
              </label>
              <input id='fileInput' type="file" multiple onChange={handleFileInputChange} />
              
            </>
          }
          
        </div>
        </div>
          
      <div className="event-info">
        <div className="client">
          <h1>{event.firstName} {event.lastName}</h1>
          <div className="type">{capitalizeFirstLetter(event.type)}</div>
        </div>

        <div className="event-options">
          <div className="button warnning" onClick={()=>{
            deleteEvent()
          }}>Delete</div>
        </div>

        <div className="client-contact">
          <p className="client-phone">{event.phone}</p>
          <p className="client-email">{event.email}</p>
        </div>

      </div>
      </div>
      <div className="event-date-time">
        <div className="left box">

          <div className="event-date-countdown">
            <div className="event-date">
              <div className="day">
                    {
                        convertDateFormatDay(event.dateOfShoot)
                    }
                    </div>
                    <div className="date">
                    {
                        convertDateFormatMDY(event.dateOfShoot)
                    }
                    </div></div>
            <div className="event-countdown">{countdownTo(event.dateOfShoot)}</div>
          </div>
        <div className="event-time-duration">
            <div className="event-time">{convert24To12HourFormat(event.startTime)}</div>
            <div className="event-duration">{event.duration} hrs</div>
          </div>
          

          <div className="event-location">
            <div className="icon"></div>
            <div className="address">{event.location}</div>
            <a className="view-map"
            href={convertToGoogleMapsURL(event.location)}
            target='_blank'
            >View Map</a>
          </div>

        </div>
        <div className={`right actions box ${event.status}`}>

          <div className="confirm-message">This event is confirmed by Robinson</div>
          <div className="pending-message">Client is waiting for your approval</div>

          <div className={`action-wrap ${rescheduleModal ? 'rescheduleOpen' : ''}`}>
            <div className="button primary confirm" onClick={confirmEvent}>Confirm</div>
            <div className="button blue outline rechedule"
              onClick={()=>setReschduleModal(!rescheduleModal)}
            >Reschdule</div>
            <div className="button warnning outline cancel" onClick={()=>{}}>Cancel</div>

          </div>
          <div className={`rechedule-calendar ${rescheduleModal ? 'show' : 'hide'}`}>
            <Calendar minDate={new Date()}
            onChange={setRescheduleDate} /*value={setFormData.dateOfShoot} */ />
            <div className="button blue outline save"
              onClick={recheduleEvent}
            >Save</div>
          </div>

        </div>
      </div>
      <div className="event-insights">
        <div className="insight services">
          <div className="heading">Services</div>
          <div className="body">
            { 
              event.services.photography.status === true &&
              <EventService
                event={event}
                service="photography"
              />
            }
            { 
              event.services.videography.status === true && 
              <EventService
                event={event}
                service="videography"
              />
            }
          </div>
        </div>
        <PaymentInsignt {...{event,addPaymentLocal,updatePaymentLocal,showAlert}} />
        <ExpanceInsight/>
      </div>
    </main>
  )
}
// Line complexity => 125 -> 108