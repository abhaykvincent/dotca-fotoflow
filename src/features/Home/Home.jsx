import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';
import { getEventsByStatus, getProjectsByStatus, getRecentEvents, getRecentProjects } from '../../utils/projectFilters';
import ProjectCard from '../../components/Project/ProjectCard/ProjectCard';
import EventCard from '../../components/Event/EventCard/EventCard';
function Home({ events,projects,loadProjects}) {

    document.title = `FotoFlow | Home`;
    const recentProjects = getRecentProjects(projects, 4);
    const selectionCompletedProjects = getProjectsByStatus(projects, 'selection-completed');
    const requestPendingProjects = getProjectsByStatus(projects, 'request-pending');
    const pendingEvents = getEventsByStatus(events, 'pending');
    const recentEvents = getRecentEvents(events, 10, pendingEvents);
    // console.log(recentEvents);

    return (
        <main className="home">
            <div className="welcome-section">
                <div className="welcome-content">
                    <div className='welcome-message-top user-name'>
                        <h1 className='welcome-message '>Hello,</h1>
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            {/* Define the linear gradient */}
                            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#30d158', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#136a29', stopOpacity: 1 }} />
                            </linearGradient>
                            {/* Apply the gradient to the text */}
                            <text x="188px" y="46px" fontFamily="Arial" fontSize="3rem" font-fontWeight="800" fill="url(#textGradient)" textAnchor="middle">
                                Dot CA Media ✨
                            </text>
                        </svg>
                    </div>
                    <h1 className='welcome-message'>Let's manage your Snaps </h1>
                </div>
                <div className="actions">
                    <a href="/book" target='_blank'><div className="button primary">Add Event</div></a>
                </div>
            </div>
            {
                pendingEvents.length > 0 ? (
                    <>
                        <div className="section recent ">
                            <div className="events-header">
                            <div className="icon"></div>
                            <h3 className='section-heading'> Event Confirmation Pending</h3>

                            </div>
                            <div className="projects">
                            {
                                pendingEvents.length !== 0? (
                                    pendingEvents.map((project, index) => (
                                    <EventCard
                                        key={project.id}
                                        event={project}
                                    /> 
                                ))
                                ) : (
                                    <p className="message">No recent events</p>)
                            }
                            <Link className="project see-all" to={`/events`} >
                                <div className="project-cover"
                                ></div>
                                <div className="project-details">
                                    <div className="details-top">

                                        <h4 className="project-title">See all {pendingEvents.length} Events</h4>
                                        <p className="project-type"></p>
                                    </div>
                                </div>
                                <div className="project-options">
                                    
                                </div>
                            </Link>
                            </div>
                        </div>

                    </>
                ):
                (<></>)
            }
            {
                recentEvents.length > 0 ? (
                    <>
                        <div className="section recent ">
                            <div className="events-header">
                            <div className="icon"></div>
                            <h3 className='section-heading'>Recent Events</h3>

                            </div>
                            <div className="projects">
                            {
                                recentEvents.length !== 0? (
                                    recentEvents.map((project, index) => (
                                    <EventCard
                                        key={project.id}
                                        event={project}
                                    /> 
                                ))
                                ) : (
                                    <p className="message">No recent events</p>)
                            }
                            <Link className="project see-all" to={`/events`} >
                                <div className="project-cover"
                                ></div>
                                <div className="project-details">
                                    <div className="details-top">

                                        <h4 className="project-title">See all {events.length} Events</h4>
                                        <p className="project-type"></p>
                                    </div>
                                </div>
                                <div className="project-options">
                                    
                                </div>
                            </Link>
                            </div>
                        </div>

                    </>
                ):
                (<>
                    <div className="section recent">
                        <div className="events-header">
                            <div className="icon"></div>
                            <h3 className='section-heading'>You dont have any events created</h3>

                        </div>
                    </div>
                    <div className="projects-list">

                    <Link target="_blank" className="project new" to={`/book`} >
                        <div className="project-cover"
                        ></div>
                        <div className="project-details">
                            <div className="details-top">

                                <h4 className="project-title">Create Your First Event</h4>
                                <p className="project-type"></p>
                            </div>
                        </div>
                        <div className="project-options">
                            
                        </div>
                    </Link>
                    </div>
                </>)
            }
            {
                /* projects.length > 0 ? (
                    <>
                        <div className="section recent">
                            <div className="project-header">
                                <div className="icon"></div>
                                <h3 className='section-heading'>Recent Projects</h3>
                            </div>
                            <div className="projects">
                            {
                                recentProjects.length !== 0? (
                                recentProjects.map((project, index) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                    /> 
                                ))
                                ) : (
                                    <p className="message">No recent projects</p>)
                            }
                            <Link className="project all" to={`/projects`} >
                                <div className="project-cover"
                                ></div>
                                <div className="project-details">
                                    <div className="details-top">

                                        <h4 className="project-title">See all {projects.length} Projects</h4>
                                        <p className="project-type"></p>
                                    </div>
                                </div>
                                <div className="project-options">
                                    
                                </div>
                            </Link>
                            </div>
                        </div>

                    </>
                ):
                (<>
                    <div className="section recent">
                        <div className="project-header">
                            <div className="icon"></div>
                            <h3 className='section-heading'>You dont have any projects created</h3>
                        </div>
                    </div>
                    <div className="projects-list">

                    <Link className="project new" to={`/projects`} >
                        <div className="project-cover"
                        ></div>
                        <div className="project-details">
                            <div className="details-top">

                                <h4 className="project-title">Create Your First Project</h4>
                                <p className="project-type"></p>
                            </div>
                        </div>
                        <div className="project-options">
                            
                        </div>
                    </Link>
                    </div>
                </>) */
            }
            <div className="refresh">
                <p>
                    Refresh your projects to see the latest updates
                </p>
                <div className="button secondary"

                onClick={loadProjects}
                >Refresh</div>
            </div>
        </main>
    );
}

export default Home;
