import React, { useEffect, useState } from 'react';
import { capitalizeFirstLetter, convertDateFormat, display24to12formatThrough } from '../../../utils/stringUtils';

import './FormFinish.scss'
const FormFinish = ({ formData,setFormData, currentForm, setCurrentForm, handleSubmit}) => {

  return (
    <div className={`form-screen thanks ${currentForm==='thanks'?'active':''} ${currentForm==='thanks'?'':''}`}>

      <form action="">
        <div className="form-section">
        <div className="form-section-wrap"></div>
          <h3>Dot CA Media will reach you out soon</h3>
          <p className='content'>We can't wait to capture beautiful moments for you.</p>
          <p className='sub-content'>
            As part of our commitment to delivering exceptional service, we aim to make your experience enjoyable and stress-free. 
            If you have any questions leading up to the session or if there's anything else we can assist you with, please don't hesitate to reach out to us.
          </p>
        </div>
          <div className="book-another"><a href="/book">Book</a> another Appoinment</div>
        
    </form>
    <p className='thanks-form-footer'>Dot CA Media Hub | Powered by FotoFlow</p>
    </div>
  );
};

export default FormFinish;

// Line Complexity => 388