import React, { useEffect, useState } from 'react';
import { addEventPaymentLogInFirestore, addProject, updateEventPaymentLogInFirestore } from '../../firebase/functions/firestore';
import { analytics } from '../../firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { capitalizeFirstLetter } from '../../utils/stringUtils';

function UpdatePaymentModal({ event,showAlert,visibleUpdate, onClose, logIndex,updatePaymentLocal,updatePayment }) {
// console.log(updatePayment)
  const [paymentData, setPaymentData] = useState(updatePayment);
  const paymentStatuses = ['pending', 'paid', 'overdue', 'draft'];
  const handleInputChange = (event) => {
      const {name,value} = event.target;
      // console.log(name,value)
      // console.log(paymentData)
      setPaymentData((prevData) => ({
          ...prevData,
          [name]: name === 'amount' ? Number(value) : value,
      }));
  };
  useEffect(()=>{
    setPaymentData(updatePayment)
  },[updatePayment])
  const handleSubmit = () => {
      // Call the API function to add a new project
      updateEventPaymentLogInFirestore(event.id,logIndex,paymentData)
          .then((addedPayment) => {
            // console.log(addedPayment)
            updatePaymentLocal(event.id,logIndex,addedPayment);
            showAlert('success', 'Payment log updated')
            onClose();

          })
          .catch((error) => {
              console.error('Error updating payment:', error);
              showAlert('error', 'error')
              // Handle error scenarios, e.g., show an error message
          });
  };


  if (!visibleUpdate) {
    return null;
  }

  return (
    <div className="modal-container">
        <div className="modal create-project">
            <div className='modal-header'>
                <div className="modal-controls">
                    <div className="control close" onClick={onClose}></div>
                    <div className="control minimize"></div>
                    <div className="control maximize"></div>
                </div>
                <div className="modal-title">Update {paymentData.name} Payment</div>
            </div>
            <div className='modal-body'>
                <div className="form-section">
                    <div className="field">
                        <label className="" htmlFor="">Name</label>
                        <input className="" name="name" value={paymentData.name} type="text"
                            onChange={handleInputChange} />
                    </div>
                    <div className="field">
                        <label className="" htmlFor="">Amount</label>
                        <input className="" name="amount" value={paymentData.amount} type="number"
                            onChange={handleInputChange} />
                    </div>
                    <div className="field">
                        <label className="" htmlFor="">Status</label>
                        <select className="" name="status" value={paymentData.status} onChange={handleInputChange}>
                            {paymentStatuses.map((status) => (
                                <option className={`option ${status}`}key={status} value={status}>{capitalizeFirstLetter(status) }</option>
                            ))}
                         </select>
                    </div>
                </div>
            </div>
            <div className="actions">
                <div className="button secondary" onClick={onClose}>Cancel</div>
                <div className="button primary" onClick={handleSubmit}>Update</div>
            </div>
        </div>
        <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}

export default UpdatePaymentModal