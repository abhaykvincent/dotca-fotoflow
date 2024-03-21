import React, { useState } from 'react';
import { capitalizeFirstLetter } from '../../../utils/stringUtils';
import Calendar from 'react-calendar';
import './ShootDetails.scss'
import 'react-calendar/dist/Calendar.css';
import { useEffect } from 'react';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../../firebase/app';

const ShootDetails = ({ formData,setFormData, handleChange, currentForm, setCurrentForm }) => {
    /* Event Type */
    const eventTypes = ['wedding', 'birthday', 'couple','maternity','new-born', 'commercial','real-Estate','fashion','concert','other'];
    const eventDurations = [2,3,4, 5, 6, 7, 8];
    const [dateValue, setDateValue] = useState(new Date());
    const [formErrors, setFormErrors] = useState({});
    const [activeValidation, setActiveValidation] = useState(false);
    const validateForm = () => {
      let errors = {};
      let isValid = true;
    
      // Example validation for 'type' field
      if (!formData.type) {
        isValid = false;
        errors.type = "Event type is required";
      }
      if(!formData.dateOfShoot){
        isValid = false;
        errors.dateOfShoot = "Event Date is required";
      }
      if(!formData.duration){
        isValid = false;
        errors.duration = "Event Duration is required";
      }
      // console.log(formData.startTime)
      if(!formData.startTime){
        isValid = false;
        errors.startTime = "Event Time is required";
      }
      if(!formData.location){
        isValid = false;
        errors.location = "Event Location is required";
      }
    
      // Add more validations as needed...
    
      setFormErrors(errors);
      return isValid;
    };
    const handleSubmit = () => {
      if (validateForm()) {
        // Proceed with form submission or next step
        setCurrentForm('clientDetails');

      logEvent(analytics,'booking_ShootDetails');
      } else {
        // Handle the case where the form is invalid
        setActiveValidation(true)
        console.error("Form is invalid");
      }
    };
    useEffect(()=>{
      if(activeValidation){
        validateForm()
      }
    },[formData,activeValidation])
    useEffect(()=>{
      // go to document .error-message first of type
      const errorMessages = document.querySelectorAll('.error-message');
      //scroll to  first error message
      if(errorMessages.length > 0){
        errorMessages[0].scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest", marginBottom: "-200px" });
      }
      
    },[formErrors])
    const setType = (type) => {
        setFormData((prevData) => {
        return {
        ...prevData,
            type: type,
        };
        });
    }
    /* Event Details */
    const setDate = (date) => {
        setFormData((prevData) => {
        return {
        ...prevData,
            dateOfShoot: date.toString(),
        };
        });

    }
    const setDuration = (duration) => {
        setFormData((prevData) => {
        return {
        ...prevData,
            duration: duration,
        };
        });
    };

  return (
    <div className={`form-screen shoot-details ${currentForm === 'shootDetails' ? 'active' : ''} ${currentForm != 'shootDetails' ? 'hide' : ''}`}>
      <form action="">
        {/* Event Type - Wedding, Birthday, ... */}
        <div className="form-section event-types box-reveal-anm ">
          <h4>Event Type{formErrors.type && <div className="error-message">{formErrors.type}</div>} </h4>
        
          <div className="form-group">
            {eventTypes.map(type => (
              <div
                key={type}
                className={`event-type ${formData.type === type ? 'active' : ''}`}
                onClick={() => setType(type)}
              >
                {capitalizeFirstLetter(type)}
              </div>
            ))}
          </div>
        </div>
        {/* Event Details -  Date, Time, Location, ... */}
        <div className="form-section event-details box-reveal-anm">
        
          {/* Event Date */}
          <div className="form-group event-date">
          <h4>Event Date{formErrors.date && <div className="error-message">{formErrors.date}</div>} </h4>
            {formErrors.dateOfShoot && <div className="error-message">{formErrors.dateOfShoot}</div>} 
            <Calendar onChange={setDate} value={setFormData.dateOfShoot} />
          </div>
          <div className="right-group">
            {/* Duration */}
            <div className="form-group event-durations">
                <h4>Duration {formErrors.duration && <div className="error-message">{formErrors.duration}</div>}</h4>
                <div className="duration-list">
                {eventDurations.map(duration => (
                
                <div 
                    className={`duration ${formData.duration === duration ? 'selected' : ''}`} 
                    key={duration}
                    onClick={() => setDuration(duration)}
                >
                    {`${duration} Hrs`}
                </div>
            
                ))}
                <div 
                    className={`duration custom ${formData.duration === '' ? 'selected' : ''}`} 
                    key={'custom'}
                    onClick={() => {}}
                >
                  Custom
                </div>
            </div>
          </div>
          {/* Eveent Time */}
          <div className="form-group event-time">
              <h4>Start time {formErrors.startTime && <div className="error-message">{formErrors.startTime}</div>}</h4>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
          </div>
          <div className="form-group event-location">
              <h4>Location {formErrors.location && <div className="error-message">{formErrors.location}</div>}</h4>
              <input type="text-area" name="location" value={formData.location} onChange={handleChange} />
          </div>

          </div>
        </div>
        <div className="button primary-dark box-reveal-anm"
          onClick={() => {
            handleSubmit()
          }}
        >CONTINUE</div>
      </form>
    </div>
  );
};

export default ShootDetails;
