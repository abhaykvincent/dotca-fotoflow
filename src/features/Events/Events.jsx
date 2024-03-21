import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import React Router components
import AddProjectModal from '../../components/Modal/AddProject';
import './Events.scss';
import ProjectCard from '../../components/Project/ProjectCard/ProjectCard';
import EventCard from '../../components/Event/EventCard/EventCard';
import { getEventsByStatus, getPastEvents, getRecentEvents, getWeekEvents } from '../../utils/projectFilters';

function Events({ events, addProject, showAlert, isLoading }) {

    const [updatedEvent, setUpdatedEvent] = useState(events)
    // Modal
    const [modal, setModal] = useState({ createProject: false })

    const openModal = () => setModal({ createProject: true });

    const closeModal = () => setModal({ createProject: false });

    const [filter, setFilter] = useState('all')
    useEffect(()=>{
        if(filter==='all'){
            setUpdatedEvent(events)
        }
        if(filter==='pending'){
            setUpdatedEvent(getEventsByStatus(events,'pending'))
        }
        if(filter==='active'){
            setUpdatedEvent(getEventsByStatus(events,'confirmed'))
        }
        if(filter==='recent'){
            setUpdatedEvent(getRecentEvents(events,10))
        }
        if(filter==='week'){
            setUpdatedEvent(getWeekEvents(events,10))
        }
        if(filter==='past'){
            setUpdatedEvent(getPastEvents(events,10))
        }
    },[filter,events])

    return (
        <main className="projects">
            <div className="projects-header">
                <h1>Events</h1>
                <div className="actions">
                    <a href="/book" 
                    //open in new window
                    target="_blank"
                     className="button primary">Add Event</a>
                </div>
            </div>
            <div className="view-control">
                <div className="control-wrap">
                    <div className="controls">
                        <div className={`control ${filter==='all' && 'active'}`} 
                        onClick={()=>{
                            setFilter('all')
                        }}>All <b>{updatedEvent.length}</b></div>
                        <div className={`control ${filter==='active' && 'active'}`}  
                        onClick={()=>{
                            setFilter('active')
                        }}>Active <b>{updatedEvent.length}</b></div>
                        <div className={`control ${filter==='week' && 'active'}`}  
                        onClick={()=>{
                            setFilter('week')
                        }}>Soon <b>{updatedEvent.length}</b></div>
                        <div className={`control ${filter==='past' && 'active'}`}  
                        onClick={()=>{
                            setFilter('past')
                        }}>Past <b>{updatedEvent.length}</b></div>
                        <div className={`control ${filter==='pending' && 'active'}`} 
                        onClick={()=>{
                            setFilter('pending')
                        }}>Pending <b>{updatedEvent.length}</b></div>
                    </div>
                    <div className={`active`}></div>
                </div>
            </div>
            <div className={`projects-list ${filter}`}>
                {updatedEvent?.length !== 0? (
                    updatedEvent.map((event, index) => (
                        <EventCard
                        key={event.id}
                        filter={filter}
                        event={event}
                        index={index}
                    /> 
                    ))) : (
                        <>
                        <div className="section recent">
                            {updatedEvent?.length !== 0&&
                                <h3 className='section-heading'>Recent Projects</h3>
                            }
                        </div>

                        <Link target='_blank' to="/book"className="project new"  >
                            <div className="project-cover"></div>
                            <div className="project-details">
                                <div className="details-top">

                                    <h4 className="project-title">Create Your First Event</h4>
                                    <p className="project-type"></p>
                                </div>
                            </div>
                            <div className="project-options">
                                
                            </div>
                        </Link>
                        </>
                    )
                    }
                </div>
            
            <AddProjectModal visible={modal.createProject} onClose={closeModal} onSubmit={addProject} showAlert={showAlert} />
        </main>
    );

}

export default Events;
