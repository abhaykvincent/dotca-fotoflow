// BookingPage.js
import React, { useEffect, useState } from 'react';
import { capitalizeFirstLetter, generateRandomString } from '../../utils/stringUtils';
import './BookingPage.scss';
import ShootDetails from '../../components/FormScreens/ShootDetails/ShootDetails';
import ClientDetails from '../../components/FormScreens/ClientDetails/ClientDetails';
import ServicesDetails from '../../components/FormScreens/ServicesDetails/ServicesDetails';
import { Link } from 'react-router-dom';
import { addEventToFirestore } from '../../firebase/functions/firestore';
import FormReview from '../../components/FormScreens/FormReview/FormReview';
import FormFinish from '../../components/FormScreens/FormFinish/FormFinish';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase/app';

const BookingPage = ({addEvent}) => {

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfShoot: null,
    type: '',
    location: '',
    startTime: '', // Initialize with an empty string or your desired default value
    duration: 4,
    services: {
      photography:{
        status:false,
        photographers: 1,
        premium: false,
        delivery:'standard'
      },
      videography: {
        status:false,
        videographers: 1,
        premium: false,
        delivery:'standard'
      },
    },
    payments:{
      log:[
        {
          name: 'Deposit',
          amount: 100,
          status: 'pending'
        }
      ],
      breakdown:[
        {
          name: 'Photographer',
          amount:0,
          active: false,
        },
        {
          name: 'Videographer',
          amount:0,
          active: false,
        },
        {
          name: 'Premium Crew',
          amount:0,
          active: false,
        },
        {
          name: 'Raw Photos',
          amount:0,
          active: false,
        },
        {
          name: 'Raw Videos',
          amount:0,
          active: false,
        },
        {
          name: 'Photography Delivery',
          amount:0,
          active: false,
        },
        {
          name: 'Videography Delivery',
          amount:0,
          active: false,
        },

      ],
      paid:0,
      balance: 0,
      total: 0,
    },
    status:'pending',
    deliveryPeriod: '1-2 weeks',
    addons: [],
  });
  const [currentForm, setCurrentForm] = useState('shootDetails')
  const [formTitle, setFormTitle] = useState('Select shoot')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? { ...prevData[name], [value]: checked } : value,
    }));
  };
  const handleSubmit = (e) =>{
    addEventToFirestore(formData)
    .then((fireEvent)=>{
    addEvent(fireEvent)
    console.log(logEvent(analytics,'booking_created'))
    })
    
  }
  const goBack = (e) => {
    e.preventDefault();
  
    const formMapping = {
      shootDetails: 'shootDetails',
      clientDetails: 'shootDetails',
      servicesDetails: 'clientDetails',
      finish: 'servicesDetails',
      thanks: 'finish',
    };
  
    setCurrentForm(formMapping[currentForm]);
  };
  
  const formTitles = {
    shootDetails: 'Select Shoot',
    clientDetails: 'Enter Personal Details',
    servicesDetails: 'Select Services',
    finish: 'Review and Submit',
    thanks: 'Thanks for Booking'
  };
  useEffect(() => {
    setFormTitle(formTitles[currentForm]);
    // scroll to top
    window.scrollTo(0, 0);
    // scroll to top .booking-body
    document.querySelector('.booking-body').scrollTo(0, 0);
  }, [currentForm]);

  useEffect(() => {
    // console.log(formData)
  }, [formData]);
  // make body white
  document.body.style.backgroundColor = 'white';

  return (
    <div className='booking-page'>
      <div className="booking-header">
        <div className="agency">
          <div className="agency-logo"></div>
          <div className="agency-name">DOT CA MEDIA HUB</div>
        </div>
        <div className="form-header">
          {currentForm !=='shootDetails'&& <div className={`back-button ${currentForm==='thanks'?'thanks':''}`}
            onClick={goBack}
          > </div>}
          <h2 className='booking-title'>{formTitle}</h2>
        </div>
      </div>
      <div className="booking-body">
        <div className="form-screen-wrap">

          <ShootDetails     {...{ formData,setFormData, handleChange, currentForm, setCurrentForm }}/>
          <ClientDetails    {...{ formData,setFormData, handleChange, currentForm, setCurrentForm }}/>
          <ServicesDetails  {...{ formData,setFormData, handleChange, currentForm, setCurrentForm }}/>
          <FormReview  {...{ formData,setFormData, handleChange, currentForm, setCurrentForm,handleSubmit }}/>
          <FormFinish  {...{ formData,setFormData, handleChange, currentForm, setCurrentForm }}/>
          
            {/* currentForm === 'shootDetails'&&
            <div className="agency-branding">
              <p>Dot CA Media Booking  | Powered by FotoFlow</p>
            </div> */}
          
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
