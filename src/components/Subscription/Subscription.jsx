import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Subscription.scss';
import { getEventsByStatus, getProjectsByStatus, getRecentEvents, getRecentProjects } from '../../utils/projectFilters';
import ProjectCard from '../../components/Project/ProjectCard/ProjectCard';
import EventCard from '../../components/Event/EventCard/EventCard';
function Subscription({ }) {

    return (
        <main className="subscription">
            <div className="welcome-section">
                <div className="welcome-content">
                    <div className='welcome-message-top user-name'>
                        <h1 className='welcome-message '>Ugrade to</h1>
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            {/* Define the linear gradient */}
                            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#30d158', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#136a29', stopOpacity: 1 }} />
                            </linearGradient>
                            {/* Apply the gradient to the text */}
                            <text x="136px" y="46px" fontFamily="Arial" fontSize="3rem" font-fontWeight="800" fill="url(#textGradient)" textAnchor="middle">
                                Studio Plan
                            </text>
                        </svg>
                    </div>
                    <h1 className='welcome-message'>Elevate Your Photo Game! </h1>
                </div>
            </div>
            <div className="plans-container">
                <h1 className='subscriptions-heading'>Subscription Plans</h1>
                <div className="plans">
                    {/* <div className="plan hobbiest">

                        <h3 className="plan-name">Hobbiest</h3>
                        <div className="plan-pricing">
                            <h1>
                                Free
                            </h1>
                            <div className="unit">/ month</div>
                        </div>
                    </div> */}
                    <div className="plan freelancer">

                        <h3 className="plan-name">Freelancer</h3>
                        <div className="cover"></div>
                        <div className="plan-pricing">
                            <h1>$20</h1>
                            <div className="unit"><span>$25</span> / month</div>
                        </div>
                        <div className="plan-pricing yearly ">
                            <h1>$200</h1>
                            <div className="unit"><span>$300</span> / year</div>
                        </div>
                        <div className="plan-pricing yearly ">
                            <div className=" first-month">First 2 month on us</div>
                        </div>
                        <div className="core-features">
                            <h4>2.5 GB storage</h4>
                            <h4>Bookings</h4>
                            <h4>Gallery</h4>
                        </div>
                        <div className="plan-features">
                            <p className="features">Unlimited Events</p>
                            <p className="features">Unlimited Galleries</p>
                        </div>
                        <div className="validity disable">
                            <p className='label'>Plan expries on</p>
                            <p>31 March 2025</p>
                            </div>
                        <div className="button primary outline disable">Current Plan</div>
                        <p className='payment-status'>Payment Pending</p>
                    </div>

                    <div className="plan studio">
                        <h3 className="plan-name tag">Studio</h3>
                        <div className="cover"></div>
                        <div className="plan-pricing">
                            <h1>
                                $30
                            </h1>
                            <div className="unit"><span>$35</span> / month</div>
                        </div>
                        <div className="plan-pricing yearly ">
                            <h1>$300</h1>
                            <div className="unit"><span>$420</span> / year</div>
                        </div>
                        <div className="plan-pricing yearly ">
                            <div className=" first-month">First 2 month on us</div>
                        </div>
                        <div className="core-features">
                            <h4>512GB Hot &</h4>
                            <h4>256GB Cold storage</h4>
                            <h4>Accounts</h4>
                            <h4>Teams</h4>
                        </div>
                        <div className="plan-features">
                            <p className="features">Invoices</p>
                            <p className="features">Payments</p>
                            <p className="features">Expances Tracker</p>
                            <p className="features">Access Cold Storage</p>
                        </div>
                        <p className='waitlist-label'>Join the Studio Waitlist Today</p>
                        <div className="button primary"> Join Waitlist</div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Subscription;
