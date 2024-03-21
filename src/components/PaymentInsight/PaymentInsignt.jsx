import React, { useEffect, useState } from 'react'
// Components
import AddPaymentModal from '../Modal/AddPayment';
import UpdatePaymentModal from '../Modal/UpdatePayment';

export default function PaymentInsignt({ event, addPaymentLocal, updatePaymentLocal, showAlert }) {
  const [logIndex, setLogIndex] = useState(0);

  const amountTotal = event.payments.total;
  const { amountPaid, balanceAmount, pendingAmount, overdueAmount } = event.payments.log.reduce(
    (acc, log) => {
      if (log.status === 'paid') {
        acc.amountPaid += log.amount;
      }
      acc.balanceAmount -= log.amount;
      if (log.status === 'pending') {
        acc.pendingAmount += log.amount;
      }
      if (log.status === 'overdue') {
        acc.overdueAmount += log.amount;
      }
      return acc;
    },
    { amountPaid: 0, balanceAmount: amountTotal, pendingAmount: 0, overdueAmount: 0 }
  );


  const amountPaidPercentage = (amountPaid / amountTotal) * 100;
  const pendingPercentage = ((pendingAmount + amountPaid) / amountTotal) * 100;
  const overduePercentage = ((overdueAmount + pendingAmount + amountPaid) / amountTotal) * 100;

  const circumference = 2 * Math.PI * 40;
  const dasharray = `${circumference} ${circumference}`;
  const dashoffset = circumference - (amountPaidPercentage / 100) * circumference;
  const pendingdashoffset = circumference - ((pendingPercentage === 0 ? 1 : pendingPercentage) / 100) * circumference;
  const overduedashoffset = circumference - ((overduePercentage === 0 ? 0 : overduePercentage) / 100) * circumference;

  const [updatePayment, setUpdatePayment] = useState({});
  const [visible, setVisible] = useState(false);
  const [visibleUpdate, setVisibleUpdate] = useState(false);

  const onClose = () => {
    setVisible(false);
    setVisibleUpdate(false);
  };
  useEffect(()=>{
    // console.log(updatePayment)
  },[updatePayment])

  const onOpenAddModel = () => setVisible(true);
  const onOpenUpdateModel = () => setVisibleUpdate(true);

  return (
    <div className="insight payments">
      <div className="heading">Payments</div>
      <div className="body">
        <div className="section">
          <div className="section-header box">
            <svg width="160" height="160" viewBox="0 0 100 100">
              <circle className="available-storage" cx="50" cy="50" r="40" fill="none" strokeWidth="4" />
              <circle
                className="overdue-circle"
                cx="50"
                cy="50"
                r="40"
                fill="none"
                strokeWidth="6"
                strokeDasharray={dasharray}
                strokeDashoffset={overduedashoffset}
                transform="rotate(-90 50 50)"
              />
              <circle
                className="pending-circle"
                cx="50"
                cy="50"
                r="40"
                fill="none"
                strokeWidth="6"
                strokeDasharray={dasharray}
                strokeDashoffset={pendingdashoffset}
                transform="rotate(-90 50 50)"
              />
              <circle
                className="used-storage"
                cx="50"
                cy="50"
                r="40"
                fill="none"
                strokeWidth="6"
                strokeDasharray={dasharray}
                strokeDashoffset={dashoffset}
                transform="rotate(-90 50 50)"
              />
              <text className="used-storage-text" x="50" y="47" textAnchor="middle" dy="0.3em" fill="white" style={{ maxWidth: '50px' }}>
                ${amountPaid}
              </text>
              <text className="available-storage-text" x="50" y="62" textAnchor="middle" dy="0.3em" fill="white" style={{ maxWidth: '50px' }}>
                {`of $${amountTotal} `}
              </text>
            </svg>
          </div>
          <div className="label">Breakdown</div>
          <div className="logs">
            {event.payments.log.map((log, index) => (
              <div
                key={index}
                className={`log box ${log.status}`}
                onClick={() => {
                  setUpdatePayment(event.payments.log[index]);
                  setLogIndex(index)
                  onOpenUpdateModel();
                }}
              >
              <div className="log-label">{log.name}</div>
                <div className="amount">${log.amount}</div>
                <div className="status">
                  <div className="status-signal"></div>
                </div>
              </div>
            ))}
            <div className="log balance upcoming">
              <div className="log-label">Balance</div>
              <div className="amount">${balanceAmount}</div>
              <div className="status">
                <div className="status-signal"></div>
              </div>
            </div>
            <div className="input-box" onClick={onOpenAddModel}>
              <div className="icon"></div>Payment
            </div>
          </div>
        </div>
      </div>
      <AddPaymentModal {...{ event, balanceAmount,showAlert, visible, onClose, addPaymentLocal }} />
      <UpdatePaymentModal {...{ event, balanceAmount,showAlert, visibleUpdate, onClose, logIndex, updatePaymentLocal, updatePayment }} />
    </div>
  );
}
// Line complexity => 184 -> 168 ->135