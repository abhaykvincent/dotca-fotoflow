import React, { useEffect, useState } from 'react';
import './ClientDetails.scss'
import { capitalizeFirstLetter, convert24To12HourFormat, convertDateFormat, display24to12formatThrough } from '../../../utils/stringUtils';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../../firebase/app';

const ClientDetails = ({ formData, setFormData, handleChange, currentForm, setCurrentForm }) => {
  const [formErrors, setFormErrors] = useState({});
  
  const [activeValidation, setActiveValidation] = useState(false);
  const validateForm = () => {
    let errors = {};
    let isValid = true;
  
    // Example validation for 'type' field
    if (!formData.firstName) {
      isValid = false;
      errors.firstName = "Name type is required";
    }
    if (!formData.lastName) {
      isValid = false;
      errors.lastName = "Name type is required";
    }
    if (!formData.email) {
      isValid = false;
      errors.email = "Email type is required";
    }
    if (!formData.phone) {
      isValid = false;
      errors.phone = "Phone type is required";
    }
  
    // Add more validations as needed...
  
    setFormErrors(errors);
    return isValid;
  };
  const handleSubmit = () => {
    if (validateForm()) {
      // Proceed with form submission or next step
      setCurrentForm('servicesDetails');


    logEvent(analytics,'booking_clientDetails');
    console.log('booking_clientDetails')
    } else {
      // Handle the case where the form is invalid
      setActiveValidation(true)
      console.error("Form is invalid");
    }
  }; useEffect(()=>{
    // go to document .error-message first of type
    const errorMessages = document.querySelectorAll('.error-message');
    //scroll to  first error message
    if(errorMessages.length > 0){
      errorMessages[0].scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest", marginBottom: "-200px" });
    }
    
  },[formErrors])
  useEffect(()=>{
    if(activeValidation){
      validateForm()
    }
  },[formData,activeValidation])
  return (
    <div className={`form-screen client-details ${currentForm === 'clientDetails' ? 'active' : ''} ${currentForm === 'servicesDetails' ? 'hide' : ''}`}>
      <form action="">
        <div className="form-section client-form box-reveal-anm">
          <div className="form-group client-first-name">
            <h4>{formData.type=='wedding' ? 'Bride ' :'First Name'}  {formErrors.firstName && <div className="error-message">{formErrors.firstName}</div>}</h4>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          </div>
          <div className="form-group client-last-name">
            <h4>{formData.type=='wedding' ? 'Groom ' :'Last Name'}  {formErrors.lastName && <div className="error-message">{formErrors.lastName}</div>}</h4>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          </div>
          <div className="form-group client-email">
            <h4>Email {formErrors.email && <div className="error-message">{formErrors.email}</div>}</h4>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group client-phone">
            <h4>Phone {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}</h4>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
        </div>
        <div className="group-right ">
          <div className="form-section client-short-summary box-reveal-anm">
            <div className="event-symbol"></div>{
              // if first name is not yet starteed typiong
              formData.firstName.length <3 ?
                <h3 className="event-type"></h3>
                : formData.lastName.length <3 ?<h3 className="event-type">{formData.firstName} </h3>:<h3 className="event-type">{formData.type==='wedding' ? formData.firstName +' & '+  formData.lastName:formData.firstName +'  '+  formData.lastName}</h3>

            }
            <h4>{capitalizeFirstLetter(formData.type)}</h4>
            <div className="form-group">
              <div className="event-date">{convertDateFormat(formData.dateOfShoot)} </div>
              <div className="event-time">{display24to12formatThrough(formData.startTime,formData.duration)}</div>
            </div>
            <div className="form-group">
              <div className="event-location">{formData.location}</div>
            </div>
          </div>
          <div className="button primary-dark box-reveal-anm" onClick={() => handleSubmit()}>NEXT</div>
        </div>
      </form>
    </div>
  );
};

export default ClientDetails;
