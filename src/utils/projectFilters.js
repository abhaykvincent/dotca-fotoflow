
  // Project Filters
  export const getRecentProjects = (projects, limit) => {
    // console.log(projects);
    return projects.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
  };
  export const getProjectsByStatus = (projects, status) => {
    return projects.filter(project => project.status === status);
  };

  // Event filters
  export const getRecentEvents = (events, limit, exclude) => {
    // exclude is an array
    // remove all elements in exclude array from events
    const filtered = events.filter(event => !exclude.includes(event));
    return filtered
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  };
  //get events only this week within 7 days
  export const getWeekEvents = (events, limit) => {
    // get events where dateOfShoot this week (7 days from now) 
    // event.dateOfShoot is a string 
    // convert event.dateOfShoot to date object
    const weekPast = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    // filter events where dateOfShoot is between now and 7 days from now
    return events.filter(event => {
      const eventDate = new Date(event.dateOfShoot);
      return eventDate >= new Date() && eventDate <= weekPast;
    })
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  };
  export const getPastEvents = (events, limit) => {
    return events.filter(event => {
      const eventDate = new Date(event.dateOfShoot);
      return eventDate < new Date();
    })
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  };
  //get eevents by stattus
  export const getEventsByStatus = (events, status) => {
    // console.log(events);
    return events.filter(event => event.status === status);
  };
