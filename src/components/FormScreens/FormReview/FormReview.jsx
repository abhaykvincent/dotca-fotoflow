import React, { useEffect, useState } from 'react';
import './FormReview.scss'
import { capitalizeFirstLetter, convertDateFormat, display24to12formatThrough } from '../../../utils/stringUtils';

const FormReview = ({ formData,setFormData, currentForm, setCurrentForm, handleSubmit}) => {
  const [finish,setFinish]=useState(false)
  // console.log(formData.services.videography.rawPhotos !=true)
  return (
    <div className={`form-screen form-review ${currentForm==='finish'?'active':''} ${currentForm === 'thanks' ? 'hide' : ''}`}>
    {
      !finish ?
      <form action="">
      <section className="review">
        <div className="form-wrap">

          <div className="form-section">
            <h3>Personal Details</h3>
            <p className='client-names bolder'>{formData.firstName} {formData.lastName} ({capitalizeFirstLetter(formData.type)})</p>

            <p className='lighter'>{formData.email}</p>
            <p className='lighter'>{formData.phone}</p>

          </div>
          <div className="form-section">
            <h3>Shoot Details</h3>
            <p>{convertDateFormat(formData.dateOfShoot)}</p>
            <p>{display24to12formatThrough(formData.startTime, formData.duration) }  
              <span className='bolder'>{` (  ${formData.duration}  Hrs)`}</span>
            </p>
            <p className='location-details lighter'>{formData.location}</p>

          </div>
        </div>
        <div className="form-section services">
          <h3>Services </h3>
          <div className="photography-service">

            <h4 className='bolder'>Photography</h4>
            {/* Photographers count */}
            {formData.services.photography.status && <p>{formData.services.photography.photographers} Photographer</p>}
            {/* Videographers count */}
            {/* delivery */}
            
            {formData.services.photography.status===false &&  <p>Photography : Not selected</p>}
            {formData.services.photography.status && formData.services.photography.delivery === 'standard' && <p className='lighter'>Standard Delivery <span className='bolder'>(7 - 14 Days)</span></p>}
            {formData.services.photography.status && formData.services.photography.delivery === 'express' && <p className='lighter'>Express Delivery <span className='bolder'>(Within Days)</span></p>}
            {formData.services.photography.status && formData.services.photography.delivery === 'premium' && <p className='lighter'>Premium Delivery <span className='bolder'>(Next day)</span></p>}
            {/* RAW */}
            {formData.services.videography.rawPhotos!==true && <p className='lighter'>RAW Photos Included</p>}

            {

            }

          </div>

          <div className="videography-service">
            {formData.services.videography.status!==true && <p>Videography : Not selected</p>}
          {formData.services.videography.status &&<h4 className='bolder'>Videography</h4>}

            {formData.services.videography.status && <p>{formData.services.videography.videographers} Videographer</p>}
            {formData.services.videography.status && formData.services.videography.delivery === 'standard' && <p className='lighter'>Standard Delivery <span className='bolder'>(7 - 14 Days)</span></p>}
            {formData.services.videography.status && formData.services.videography.delivery === 'express' && <p className='lighter'>Express Delivery <span className='bolder'>(Within Days)</span></p>}
            {formData.services.videography.status && formData.services.videography.delivery === 'premium' && <p className='lighter'>Premium Delivery <span className='bolder'>(Next day)</span></p>}
            {formData.services.videography.rawPhotos !== true && <p className='lighter'>RAW Videos Included</p>}

          </div>
          
        </div>
        

        

      </section>
      <p className='privacy-statment'>By clicking the "Finish" button, you agree to adhere to the following policy <span>Terms & Conditions</span> </p>
      <div className="button primary-dark box-reveal-anm"
            onClick={() => {
              setCurrentForm('thanks')
              handleSubmit()
            }}
            >FINISH</div>
    </form>:
      <form>
        <div className="form-section">
        <h2>Thanks for Booking</h2>
        <p></p>
        </div>

      </form>
          }

    </div>
  );
};

export default FormReview;

// Line Complexity => 388