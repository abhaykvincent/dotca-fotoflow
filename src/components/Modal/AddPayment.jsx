import React, { useEffect, useState } from 'react';
import { addEventPaymentLogInFirestore, addProject } from '../../firebase/functions/firestore';
import { analytics } from '../../firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { capitalizeFirstLetter } from '../../utils/stringUtils';

function AddPaymentModal({ event,balanceAmount,showAlert,visible, onClose, addPaymentLocal,  }) {

  const [paymentData, setPaymentData] = useState({
      name: 'Advance',
      status:'pending',
      amount:500
  });
  const paymentStatuses = ['pending', 'paid', 'overdue', 'draft'];

  const [formErrors, setFormErrors] = useState({});
  const [activeValidation, setActiveValidation] = useState(false);
  const validateForm = () => {
    let errors = {};
    let isValid = true;
  
    // Example validation for 'type' field
    if (!paymentData.name) {
      isValid = false;
      errors.name = "Payment Name is required";
    }
    // if amount is less than 1 balance  amount is greeateer than  the actual balancee amount from the payments
    console.log(paymentData.amount > balanceAmount)

    if (paymentData.amount <1 ){
        
      isValid = false;
      errors.amount = "Payment amount is required";
    }
    if(paymentData.amount > balanceAmount){
        
        isValid = false;
        errors.amount = "Exceeds balance amount";
      }
  
    // Add more validations as needed...
    console.log(errors)
    setFormErrors(errors);
    return isValid;
  };
  const handleInputChange = (event) => {
      const {name,value} = event.target;
      setPaymentData((prevData) => ({
          ...prevData,
          [name]: name === 'amount' ? Number(value) : value,
      }));
  };
  const handleSubmit = () => {
    // Call the API function to add a new project
    if (validateForm()){
    
        addEventPaymentLogInFirestore(event.id,paymentData)
        .then((addedPayment) => {
            addPaymentLocal(event.id,addedPayment);
            showAlert('success', 'New Payment log Added')
            onClose();
        })
        .catch((error) => {
            console.error('Error adding payment:', error);
            showAlert('error', 'error')
            // Handle error scenarios, e.g., show an error message
        });
    }
    else {
        // Handle the case where the form is invalid
        setActiveValidation(true)
        console.error("Form is invalid");
        console.log(formErrors)
    }
  };
  //UseEffect
  useEffect(()=>{
    console.log(paymentData)
    console.log(activeValidation)
    if(activeValidation){
      validateForm()
    }
  },[paymentData,activeValidation])


  if (!visible) {
    return null;
  }

  return (
    <div className="modal-container">
        <div className="modal add-payment">
            <div className='modal-header'>
                <div className="modal-controls">
                    <div className="control close" onClick={onClose}></div>
                    <div className="control minimize"></div>
                    <div className="control maximize"></div>
                </div>
                <div className="modal-title">Add Payment</div>
            </div>
            <div className='modal-body'>

                <div className="form-section">
                    <div className="field">
                        <label className="" htmlFor="">Name</label>
                        <input className="" name="name" value={paymentData.name} type="text"
                            onChange={handleInputChange} />
                            {formErrors.name && <div className="error-message">{formErrors.name}</div>}
                    </div>
                    <div className="field">
                        <label className="" htmlFor="">Amount</label>
                        <input className="" name="amount" value={paymentData.amount} type="number"
                            onChange={handleInputChange} />
                            {formErrors.amount && <div className="error-message">{formErrors.amount}</div>}
                    </div>
                    <div className="field">
                        <label className="" htmlFor="">Status</label>
                        <select className="" name="status" value={paymentData.status} onChange={handleInputChange}>
                            {paymentStatuses.map((status) => (
                                <option key={status} value={status}>{capitalizeFirstLetter(status) }</option>
                            ))}
                         </select>
                         {formErrors.status && <div className="error-message">{formErrors.status}</div>}
                    </div>
                </div>

            </div>
            <div className="actions">
                <div className="button secondary" onClick={onClose}>Cancel</div>
                <div className="button primary" onClick={handleSubmit}>Create</div>
            </div>
        </div>
        <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}

export default AddPaymentModal