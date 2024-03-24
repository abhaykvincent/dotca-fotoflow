import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
// Components
import './App.scss';
import Alert from './components/Alert/Alert';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
// Features
import Home from './features/Home/Home';
import Project from './features/Project/Project';
import Projects from './features/Projects/Projects';
import LoginModal from './features/Login/Login';
import ShareProject from './features/Share/Share';
//Firebase functions
import { 
  fetchProjects,
  addCollectionToFirestore, 
  deleteProjectFromFirestore, 
  deleteCollectionFromFirestore,
  fetchEvents, 
} from './firebase/functions/firestore';
import Selection from './features/Selection/Selection';
import Storage from './features/Storage/Storage';
import UploadProgress from './components/UploadProgress/UploadProgress';
import BookingPage from './features/BookingPage/BookingPage';
import Events from './features/Events/Events';
import Event from './features/Event/Event';
import Subscription from './components/Subscription/Subscription';
import useScrollToTop from './hooks/ScrollToTop';

function App() {
  //forcefully go browser full screen


  useScrollToTop()
  const navigate = useNavigate();
  const [authenticated,setAuthenticated] = useState(false)
  const logout = () =>{
    setAuthenticated(false)
    localStorage.removeItem('authenticated')
    navigate('/login')
  }
  const checkAuthStatus = () => {
    const isAuthenticated = localStorage.getItem('authenticated');
    if (isAuthenticated === 'true') {
        setAuthenticated(true);
    }
    else{
      setAuthenticated(false);
    }
};

  // Alert
  const [alert, setAlert] = useState({ type: '', message: '', show: false });
  const showAlert = (type, message) => setAlert({ type, message, show: true });
  // Core Data
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);
  const addEvent  = (event)=>{
    setEvents([...events, event])
  }
 // Upload progress
 const [uploadList, setUploadList] = useState([]);
 const [uploadStatus, setUploadStatus] = useState('close');
  const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
  if(uploadStatus === 'completed'){
    setTimeout(() => {
      setUploadStatus('close')
    }, 1000)
  }
}, [uploadStatus])
useEffect(() => {
  console.log(events)
}, [events])
  // Fetch Projects
  useEffect(() => {
    document.title = `FotoFlow`;
    checkAuthStatus()
    loadProjects()
    loadEvents()
  }, []);

  const loadProjects = () => {
    setIsLoading(true);
    fetchProjects()
    .then((fetchedProjects) => {
      setProjects(fetchedProjects)
    });
  };
  const loadEvents = () => {
    setIsLoading(true);
    fetchEvents()
    .then((fetchedEvents) => {
      // console.log(fetchedEvents)
      setEvents(fetchedEvents)
      setIsLoading(false);
    });
  };
  const updateEventLocal =(id,updateEvent)=>{
    const updatedEvents = events.map((event) => {
      if (event.id === id) {
        return { ...event, ...updateEvent };
      }
      return event;
    });
    console.log('Event updated')
    console.log(updatedEvents)
    setEvents(updatedEvents);
  }
  const deleteEventLocal =(id)=>{
    const updatedEvents = events.filter((event) => event.id !== id);

    setEvents(updatedEvents);
  }
  const addPaymentLocal = (id,payment) =>{
    const updatedEvents = events.map((event) => {
      if (event.id === id) {
        // add payment to event.payments.log
        event.payments.log.push(payment)
        // console.log(event)
        return event;
      }
      return event;
    });
    setEvents(updatedEvents);
  }
  const updatePaymentLocal = (id,logIndex,payment) =>{
    const updatedEvents = events.map((event) => {
      if (event.id === id) {
        // add payment to event.payments.log
        event.payments.log[logIndex]=payment
        return event;
      }
      return event;
    });
    setEvents(updatedEvents);
  }

  // Project/Collection Data Logic
  const addProject = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
    navigate(`/project/${newProject.id}`);
  };
  const deleteProject = (projectId) => {
    const updatedProjects = projects.filter(project => project.id !== projectId)
    const project = projects.find(project => project.id === projectId) || {}
    deleteProjectFromFirestore(projectId)
    .then(() => {
      navigate('/projects');
      setTimeout(() => {
        const projectElement = document.querySelector(`.${projectId}`);
        projectElement.classList.add('delete-caution');
      }, 1);
      setTimeout(() => {
        setProjects(updatedProjects);
        showAlert('success', `Project <b>${project.name}</b> deleted successfully!`);// Redirect to /projects page
      }, 700);
    })
    .catch((error) => {
      console.error('Error deleting project:', error);
      showAlert('error', error.message)
    })
  };
  const addCollection = (projectId, newCollection) => {
    addCollectionToFirestore(projectId,newCollection)
    .then((id)=>{
      const updatedProjects = projects.map((project) => {
        if (project.id === projectId) {
          const updatedCollections = [...project.collections, {id,...newCollection}];
          showAlert('success', 'New Collection created!')
          return { ...project, collections: updatedCollections };
        }
        return project;
      });
      setProjects(updatedProjects);
      showAlert('success', `Collection <b>${newCollection.name}</b> added successfully!`);// Redirect to /projects page
      navigate(`/project/${projectId}/${id}`);
    })
    .catch((error) => {
      showAlert('error', `Error adding collection: ${error.message}`);
    });
  };
  const deleteCollection = (projectId, collectionId) => {
    deleteCollectionFromFirestore(projectId, collectionId)
    .then(() => {
      const updatedProjects = projects.map((project) => {
        if (project.id === projectId) {
            const updatedCollections = project.collections.filter(
            (collection) => collection.id !== collectionId
          );
          showAlert('success', 'Collection deleted!');
          return { ...project, collections: updatedCollections };
        }
        return project;
      });
      setProjects(updatedProjects);
    })
    .catch((error) => {
      showAlert('error', `Error deleting collection: ${error.message}`);
    });
  };
  
  const shareOrSelection = window.location.href.includes('share') || window.location.href.includes('selection' )|| window.location.href.includes('book' )
  
  // Render
  return (
    <div className="App">
      {authenticated && (!shareOrSelection)? (
        <>
          <Header />
          <Sidebar eventCount={events.length} projectCount={projects.length} logout={logout}  />
          <Alert {...alert} setAlert={setAlert} />
          <UploadProgress {...{uploadList,uploadStatus}}/>
        </>
      ) : (
        <>{!shareOrSelection && <LoginModal {...{ setAuthenticated }} />}</>
      )}
      {isLoading ? (
                <div className="loader-wrap">
                    <div className="loader"></div>
                    <p className='loading-message'>Loading Data</p>
                </div>
            ) : (
      <Routes>
        { authenticated ? 
          <>
            <Route exact path="/" element={<Home {...{projects,events,loadProjects}} />}/>
            <Route path="/project/:id/:collectionId?" element={<Project {...{ projects, addCollection, deleteCollection, deleteProject,setUploadList,setUploadStatus,showAlert }} />}/>
            <Route path="/projects" element={<Projects {...{ projects, addProject, showAlert, isLoading }} />}/>
            <Route path="/event/:id/" element={<Event {...{ events,deleteEventLocal,updateEventLocal,addPaymentLocal,updatePaymentLocal,showAlert }} />}/>
            <Route path="/events" element={<Events {...{ events, addProject, showAlert, isLoading }} />}/>
            <Route path="/subscription" element={<Subscription/>}/>
            <Route path="/storage" element={<Storage {...{projects}}/>}/>
            
          </> 
          
          : ''
        }
        <Route path="/share/:projectId/:collectionId?" element={<ShareProject {...{ projects }} />}/>
        <Route path="/selection/:projectId/:collectionId?" element={<Selection {...{ projects }} />}/>
        <Route path="/book" element={<BookingPage {...{addEvent}}/>} />
      </Routes>
            )}
      
    </div>
  );
}

export default App;
// line Complexity  146 -> 133 -> 127 -> 152 -> 132