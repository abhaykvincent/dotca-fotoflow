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
                        <h1 className='welcome-message '>Upgrade to <span className='iconic-gradient'>Studio Plan</span>!</h1>
                        
                    <h2 className='welcome-message'>Manage you <span className='bold'>Payments</span> & <span className='bold'>Crew.</span> </h2>
                    </div>
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
                            <h4 className='beta'>Gallery<span className='tag'>BETA</span></h4>
                        </div>
                        <div className="plan-features">
                            <p className="features">Events</p>
                            <p className="features">Galleries </p>
                        </div>
                        <div className="validity disable">
                            <p className='label'>Plan expries on</p>
                            <p>31 March 2025</p>
                            </div>
                        <p className='payment-status'>Payment Pending</p>
                        <div className="button primary outline ">Current Plan</div>
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
                            <h4>512 GB Storage</h4>
                            <h4>Accounts</h4>
                            <h4>Teams</h4>
                        </div>
                        <div className="plan-features">
                            <p className="features">Invoices</p>
                            <p className="features">Expances</p>
                            <p className="features">Collabration</p>
                            <p className="features">Online Payments</p>
                            <p className="features">Cold Storage Access </p>
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
