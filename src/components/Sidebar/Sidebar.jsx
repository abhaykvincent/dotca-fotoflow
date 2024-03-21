import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.scss'
import { GrUpgrade } from "react-icons/gr";
import { addWishlistToFirestore } from '../../firebase/functions/firestore';
function Sidebar({eventCount,projectCount,logout}) {
  // console.log(eventCount,projectCount)
  const [profileOptionActive, setProfileOptionActive] = useState(false)
  const toggleProfileOption = () => {
    setProfileOptionActive(!profileOptionActive)
  }
  useEffect(() => {
    // console.log(profileOptionActive)
  }, [profileOptionActive])
  const location = useLocation();
  return (
    <div className="sidebar">
      <div className="menu-list">
        <Link to={`/`}>
          <div className={`menu home ${location.pathname === '/' ? 'selected' : ''}`}>
            <div className="icon"></div>
            <div className="label">Home</div>
          </div>
        </Link>
        <Link to={`/events`}>
          <div className={`menu events ${location.pathname === '/events' ? 'selected' : ''}`}>
            <div className="icon"></div>
            <div className="label">Events</div>
            <div className="count">{eventCount > 0 && eventCount }</div>
          </div>
        </Link>
        <Link to={`/`}>
          <div className={`menu projects ${location.pathname === '/projects' ? 'selected' : ''} disabled`}>
            <div className="icon"></div>
            <div className="label">Galleries</div>
            {/* <div className="count">{projectCount > 0 && projectCount}</div> */}
            <div className="coming-soon">
              <div className="coming-soon-tag">SOON</div>
            </div>
          </div>
        </Link>
        
        <Link to={`/store`}>
          <div className={`menu store ${location.pathname === '/store' ? 'selected' : ''} disabled`}>
            <div className="icon"></div>
            <div className="label">Store</div>
          </div>
        </Link>
        <Link to={`/calendar`}>
          <div className={`menu calendar ${location.pathname === '/calendar' ? 'selected' : ''} disabled`}>
            <div className="icon"></div>
            <div className="label">Calendar</div>
          </div>
        </Link>
        <Link to={`/invoices`}>
          <div className={`menu invoices ${location.pathname === '/invoices' ? 'selected' : ''} disabled`}>
            <div className="icon"></div>
            <div className="label">Invoices</div>
          </div>
        </Link>
        {/* Admin */}
        <p className="label">ADMIN</p>
        <Link to={`/storage`}>
          <div className={`menu storage ${location.pathname === '/storage' ? 'selected' : ''} disabled`}>
            <div className="icon"></div>
            <div className="label">Storage</div>
            <div className="coming-soon">
              <div className="coming-soon-tag">SOON</div>
            </div>
          </div>
        </Link>
        <Link to={`/team`}>
          <div className={`menu team ${location.pathname === '/team' ? 'selected' : ''} disabled`}>
            <div className="icon"></div>
            <div className="label">Team</div>
            <div className="coming-soon">
              <div className="coming-soon-tag">SOON</div>
            </div>
          </div>
        </Link>
        <Link to={`/financials`}>
          <div className={`menu accounts ${location.pathname === '/accounts' ? 'selected' : ''} disabled`}>
            <div className="icon"></div>
            <div className="label">Accounts</div>
          </div>
        </Link>
        <Link to={`/subscription`}>
          <div className={`menu subscription ${location.pathname === '/subscription' ? 'selected' : ''} `}>
            <div className="icon"></div>
            <div className="label">Subscription</div>
          </div>
        </Link>
      </div>
      <div className="profile-settings">
        <div className="profile-options" onClick={toggleProfileOption}>
          <div className="profile"
          >
            <div className="profile-image"></div>
            <div className="account-name">
              <div className="studio-name">Dot CA </div>
              <div className="profile-name">Robinson</div>
            </div>
          </div>
          <div className="option-icon"></div>
        </div>
        <div className={`profile-options-window ${profileOptionActive?'active':''}`}>
          <div className="option disabled">Profile</div>
          <div className="option disabled">Account</div>
          <div className="option disabled">Subscription</div>
          <div className="option disabled">Settings</div>
          <div className="option logout"
           onClick={logout}
          >Logout</div>
        </div>
      </div>
      <div className="subscriptoion status">
        <div className="icon">
        <GrUpgrade />
        </div>
        <div className="message">Upgrade to <span>STUDIO</span></div>
        <div className="button primary outline"
          onClick={()=>{
            addWishlistToFirestore('dotca-media','studio')
          }}
        >Waitlist</div>
        <p className="plan">Current Plan: Freelancer</p>
      </div>
    </div>
  );
}

export default Sidebar;
