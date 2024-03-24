import React, { useEffect, useState } from 'react';
import './ServicesDetails.scss'
import { pricingData } from '../../../data/pricingData';

const ServicesDetails = ({ formData,setFormData, currentForm, setCurrentForm, handleSubmit}) => {
  
  const [activeValidation, setActiveValidation] = useState(false);
  const [amount, setAmount] = useState(0);
  
  const setService = (service) => {
    setFormData((prevData) => {
      const updatedService = (currentService, shouldUpdate) => ({
        ...currentService,
        status: shouldUpdate ? !currentService.status : currentService.status
      });
      const updateServices = (photographyStatus, videographyStatus) => ({
        photography: updatedService(prevData.services.photography, photographyStatus),
        videography: updatedService(prevData.services.videography, videographyStatus)
      });
  
      let services;
      if (service === "photography" || service === "videography") {
        services = updateServices(service === "photography", service === "videography");
      }
  
      return {
        ...prevData,
        services,
      };
    });
  };
  // Photographer
  const handlePhotographerSelection = (photographers) => {
    setFormData((prevData) => ({
      ...prevData,
      services: {
        ...prevData.services,
        photography: {
          ...prevData.services.photography,
          photographers: photographers
        }
      }
    }));
  };
  const handleVideographerSelection = (videographers) => {
    setFormData((prevData) => ({
      ...prevData,
      services: {
        ...prevData.services,
        videography: {
          ...prevData.services.videography,
           videographers: videographers
        }
      }
    }));
  };
  // Premium
  const handlePremium = (service, e) => {
    const { checked } = e.target;
  
    const { videography, photography } = formData.services;
  
    let updatedFormData;
    if (service === 'photography') {
      updatedFormData = {
        ...formData,
        services: {
          ...formData.services,
          photography: {
            ...photography,
            premium: checked,
          },
        },
      };
    } else if (service === 'videography') {
      updatedFormData = {
        ...formData,
        services: {
          ...formData.services,
          videography: {
            ...videography,
            premium: checked,
          },
        },
      };
    }
  
    if (photography.premium && service === 'videography') {
      updatedFormData.services.photography.premium = false;
    } else if (videography.premium && service === 'photography') {
      updatedFormData.services.videography.premium = false;
    }
  
    setFormData(updatedFormData);
  };
  // Delivery
  const handlePhotographyDelivery = (delivery) => {
    setFormData((prevData) => ({
      ...prevData,
      services: {
        ...prevData.services,
         photography: {
          ...prevData.services.photography,
           delivery: delivery
         }
      }
    }));
  };
  const handleVideographyDelivery = (delivery) => {
    setFormData((prevData) => ({
      ...prevData,
      services: {
        ...prevData.services,
         videography: {
          ...prevData.services.videography,
           delivery: delivery
         }
      }
    }));
  };
  // Raw
  const handleRaw = (service, e) => {
    const { checked } = e.target;

    const { videography, photography } = formData.services;

    let updatedFormData;
    if (service === 'photography') {
      updatedFormData = {
        ...formData,
        services: {
          ...formData.services,
          photography: {
            ...photography,
            rawPhotos: checked,
          },
        },
      };
    } else if (service === 'videography') {
      updatedFormData = {
        ...formData,
        services: {
          ...formData.services,
          videography: {
            ...videography,
            rawVideos: checked,
          },
        },
      };
    }


    setFormData(updatedFormData);
  };
  const handlePaymentTotal = () => {
    setFormData((prevData) => ({
      ...prevData,
      payments: {
        ...prevData.payments,
         total: amount,
         balance: amount
      }
    }));
  };
  useEffect(() => {
    handlePaymentTotal()
  },[amount])
  const [formErrors, setFormErrors] = useState({});
  const validateForm = () => {
    let errors = {};
    let isValid = true;
  
    // Example validation for 'type' field
    if (!formData.services.photography.status & !formData.services.videography.status) {
      isValid = false;
      errors.service = "Choose a service ";
    }
  
    // Add more validations as needed...
  
    setFormErrors(errors);
    return isValid;
  };
  const handleSubmitForm = () => {
    if (validateForm()) {
      // Proceed with form submission or next step
      setCurrentForm('finish');
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
  useEffect(() => {
    //update amount baaseed on services and duration
    const { photography, videography } = formData.services;
      const duration = formData.duration;
      /* Photogrtaphy */
      let photographyAmount = 0;
      if (photography.status) {
        //Photographers
       if(photography.photographers > 0) {
          photographyAmount += photography.photographers * pricingData.photography.photographers.primary;
          // Duration
          photographyAmount = parseInt(duration) * photographyAmount;
        }
        // Delivery
        if (photography.delivery === "premium") {
          photographyAmount += pricingData.photography.delivery.premium;
        }
        else if (photography.delivery === "express") {
          photographyAmount += pricingData.photography.delivery.express;
        }
        // Premium
        if (photography.premium) {
          photographyAmount += pricingData.photography.photographers.premium;
        }
        // Raw
        if (photography.rawPhotos) {
          photographyAmount += pricingData.photography.rawPhotos;
        }

      }

      /* videography */
      let videographyAmount = 0;
      if (videography.status) {
        if(videography.videographers > 1) {
          // Duration
          videographyAmount = parseInt(duration) * (pricingData.videography.videographers.primary + pricingData.videography.videographers.secondary);
        }
        else if (videography.status && videography.videographers === 1) {
          // Duration
          videographyAmount = parseInt(duration) * pricingData.videography.videographers.primary;
        }
        // Delivery
        if (videography.delivery === "premium") {
          videographyAmount += pricingData.videography.delivery.premium;
        }
        else if (videography.delivery === "express") {
          videographyAmount += pricingData.videography.delivery.express;
        }
        if (videography.premium) {
          videographyAmount += pricingData.videography.videographers.premium;
        }
        // Raw
        if (videography.rawVideos) {
          videographyAmount += pricingData.videography.rawVideos;
        }
      }

      setAmount(photographyAmount + videographyAmount);
      
  }, [formData]);
  return (
    <div className={`form-screen services-details ${currentForm==='servicesDetails'?'active':''} ${currentForm === 'finish' ? 'hide' : ''}`}>
      <form action="">
      
        <div className="services-wrap">
          {/* Photography */}
          <div className={`form-section service box-reveal-anm ${formData.services.photography.status?'active':''}`}
          >
            <div className="service-header"
            onClick={()=>{setService('photography')}}>
              <div className="service-selector">
                <h3 className="service-title">Photography</h3>
                {formData.services.photography.status?<p>Selected</p>:<p>Click to add this service</p>}
                <h3 className='service-base-rate'>$100/Hr</h3>
                <p>{formData.duration}Hrs</p>
              </div>
            </div>
            {/* Photographer */}
            <div className="service-body">
              <div className="service-option-group">
                <div className="option-header">
                  <h4>Photographer</h4>
                  <p className="whats-right-info">Which is right for your event?</p>
                </div>
                {/* Primary Photographer */}
                <div className={`option-cell ${formData.services.photography.photographers===1 ? 'selected':''}`}
                onClick={()=>handlePhotographerSelection(1)}
                >
                  
                  <div className="cell-left">
                      <div className="option-title">Primary</div>
                      <div className="option-description">Key Moments</div>
                  </div>
                  <div className="cell-right">Included</div>
                </div>
                {/* Secondary Photographer */}
                <div className={`option-cell ${formData.services.photography.photographers==2 ? 'selected':''}`}
                onClick={()=>handlePhotographerSelection(2)}
                >
                  <div className="cell-left">
                      <div className="option-title">Secondary</div>
                      <div className="option-description">300+ Guests</div>
                  </div>
                  <div className="cell-right">+ $100/Hr</div>
                </div>  
                <div className="option-checkbox">
                  <input type="checkbox" name="premium-photographer" 
                  id="premium-photographer"
                  value={formData.services.photography.premium}
                  checked={formData.services.photography.premium} 
                  onChange={(e)=>handlePremium('photography', e)}
                  />
                  <label  htmlFor="premium-photographer" >PREMIUM Photographer</label>
                  <p className="cell-right">+ $200</p>
                </div>
              </div>
            </div>
            {/* Delivery */}
            <div className="service-body">
              <div className="service-option-group">
                <div className="option-header">
                  <h4>Delivery</h4>
                </div>
                {/* Standard Delivery */}
                <div className={`option-cell ${formData.services.photography.delivery=='standard' && 'selected'}`}>
                  <div className="cell-left"
                    onClick={()=>handlePhotographyDelivery('standard')}
                  >
                      <div className="option-title">Standard</div>
                      <div className="option-description">Within 7 - 14 Days</div>
                  </div>
                  <div className="cell-right">Included</div>
                </div>
                {/* Express Delivery */}
                <div className={`option-cell ${formData.services.photography.delivery=='express' && 'selected'}`}>
                  <div className="cell-left"  
                    onClick={()=>handlePhotographyDelivery('express')}
                  >
                      <div className="option-title">Express</div>
                      <div className="option-description">Within 3 Days</div>
                  </div>
                  <div className="cell-right">+ $200</div>
                </div>  
                {/* Premium Delivery */}
                <div className={`option-cell ${formData.services.photography.delivery=='premium' && 'selected'}`}>
                  <div className="cell-left"
                    onClick={()=>handlePhotographyDelivery('premium')}
                  >
                      <div className="option-title">Premium</div>
                      <div className="option-description">Next day</div>
                  </div>
                  <div className="cell-right">+ $400</div>
                </div>  
              </div>
              <div className="option-checkbox selectable">
                <input type="checkbox" name="raw-photos" value="raw-photos" id="raw-photos" checked={formData.services.photography.rawPhotos} onChange={(e)=>handleRaw('photography', e)} />
                <p>RAW Photos</p>
                  <p className="cell-right">+ $300</p>
              </div>
            </div>
          </div>
            {/* Videography */}
          <div className={`form-section service  box-reveal-anm ${formData.services.videography.status?'active':''}`}
          >
            <div className="service-header"
            onClick={()=>{setService('videography')}}>
              <div className="service-selector">
                <h3 className="service-title">Videography</h3>
                {formData.services.videography.status?<p>Selected</p>:<p>Click to add this service</p>}
                <h3 className='service-base-rate'>$150/Hr</h3>
                <p>{formData.duration}Hrs</p>
              </div>
            </div>
            {/* Videographer */}
            <div className="service-body">
              <div className="service-option-group">
                <div className="option-header">
                  <h4>Videographer</h4>
                  <p className="whats-right-info">Which is right for your event?</p>
                </div>
                {/* Primary Videographer */}
                <div className={`option-cell ${formData.services.videography.videographers===1 ? 'selected':''}`}
                onClick={()=>handleVideographerSelection(1)}
                >
                  <div className="cell-left">
                      <div className="option-title">Primary</div>
                      <div className="option-description">Highlight Video</div>
                  </div>
                  <div className="cell-right">Included</div>
                </div>
                {/* Secondary Videographer */}
                <div className={`option-cell ${formData.services.videography.videographers===2 ? 'selected':''}`}
                onClick={()=>handleVideographerSelection(2)}
                >
                  <div className="cell-left">
                      <div className="option-title">Secondary</div>
                      <div className="option-description">Full Event</div>
                  </div>
                  <div className="cell-right">+ $100/Hr</div>
                </div>  
                {/* Premium Videographer */}
                  <div className="option-checkbox selectable">
                    <input
                      type="checkbox"
                      id='premium-videographer'
                      name="premium-videographer"
                      value={formData.services.videography.premium}
                      checked={formData.services.videography.premium}
                      onChange={(e) => handlePremium('videography', e)}
                    />
                    <label htmlFor="premium-videographer">PREMIUM Videographer</label>
                    <p className="cell-right">+ $200</p>
                  </div>


              </div>
            </div>
            {/* Delivery */}
            <div className="service-body">
              <div className="service-option-group">
                <div className="option-header">
                  <h4>Delivery</h4>
                  </div>
                {/* Standard Delivery */}
                <div className={`option-cell ${formData.services.videography.delivery=='standard' && 'selected'}`}>
                  <div className="cell-left"
                    onClick={()=>handleVideographyDelivery('standard')}
                  >
                      <div className="option-title">Standard</div>
                      <div className="option-description">Within 7 - 14 Days</div>
                  </div>
                  <div className="cell-right">Included</div>
                </div>
                {/* Express Delivery */}
                <div className={`option-cell ${formData.services.videography.delivery=='express' && 'selected'}`}>
                  <div className="cell-left"  
                    onClick={()=>handleVideographyDelivery('express')}
                  >
                      <div className="option-title">Express</div>
                      <div className="option-description">Within 3 Days</div>
                  </div>
                  <div className="cell-right">+ $400</div>
                </div>  
                {/* Premium Delivery */}
                <div className={`option-cell ${formData.services.videography.delivery=='premium' && 'selected'}`}>
                  <div className="cell-left"
                    onClick={()=>handleVideographyDelivery('premium')}
                  >
                      <div className="option-title">Premium</div>
                      <div className="option-description">Next day</div>
                  </div>
                  <div className="cell-right">+ $600</div>
                </div>  
              </div>
                <div className="option-checkbox selectable">
                  <input type="checkbox" name="raw-videos" value={'raw-videos'} checked={formData.services.videography.raw} onChange={(e) => handleRaw('videography', e)}/>
                  <p>RAW Videos</p>
                  <p className="cell-right">+ $500</p>
                </div>
            </div>
          </div>

        </div>
        {formErrors.service && <div className="error-message">{formErrors.service}</div>}
      <div className="price-overview-wrap">
        <div className="price-overview">
          <div className="items">
          {formData.services.photography.status&& <p>Photography</p>}
          {formData.services.videography.status&& <p>Videography</p>}
            <p>{formData.duration} Hrs Session</p>
          </div>
          <div className="amount">
            <h2>${amount.toFixed(2)}</h2>
            <p className='tax-label'>+ HST (13%)</p>
          </div>
          <div className="button primary-dark box-reveal-anm"
              onClick={()=>{handleSubmitForm()}}
            >NEXT</div>
        </div>
      </div>
      </form>
    </div>
  );
};
export default ServicesDetails;
// Line Complexity => 388 -> 519 -> 492 ->