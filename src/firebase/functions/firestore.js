
import { db } from "../app";
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, updateDoc, arrayUnion} from "firebase/firestore";
import {generateRandomString} from "../../utils/stringUtils";
import { deleteCollectionFromStorage, deleteProjectFromStorage } from "../../utils/storageOperations";



//Fetches
export const fetchProjects = async () => {
    const projectsCollection = collection(db, 'projects');
    const querySnapshot = await getDocs(projectsCollection);

    const projectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    return projectsData
};
export const fetchProject = async (projectId) => {
    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);
    const projectSnapshot = await getDoc(projectDoc);

    const projectData = projectSnapshot.data();
    // loop through projectData.collections
    // for each collection, fetch collection data
    let collectionsData = [];
    projectData.collections = await Promise.all(projectData.collections.map(async (collection) => {
        const subCollectionId = projectId + '-' + collection.id;
        const collectionDoc = doc(projectDoc, 'collections', subCollectionId);
        const collectionSnapshot = await getDoc(collectionDoc);
    
        if (collectionSnapshot.exists()) {
            // console.log(collectionSnapshot.data());
            return {...collection,...collectionSnapshot.data(),...{id:collection.id}};
        } else {
            throw new Error('Collection does not exist.');
        }
    }));
    

    return projectData;
};
export const fetchImages = async (projectId,collectionId) => {
    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);
    const subCollectionId = projectId+'-'+collectionId;
    const collectionDoc = doc(projectDoc, 'collections', subCollectionId);
    const collectionSnapshot = await getDoc(collectionDoc);


    if (collectionSnapshot.exists()) {
        const collectionsData = collectionSnapshot.data();
        return collectionsData.uploadedFiles
    } else {
        throw new Error('Project does not exist.');
    }
}
export const fetchEvents = async () => {
    const eventsCollection = collection(db, 'events');
    const querySnapshot = await getDocs(eventsCollection);

    const eventsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    return eventsData
};

// Project Operations
export const addProject = async ({ name, type, ...optionalData }) => {
    if (!name || !type) {
    throw new Error('Project name and type are required.');
    }
    const id= `${name.toLowerCase().replace(/\s/g, '-')}-${generateRandomString(5)}`;
    const projectData = {
        id,
        name,
        type, 
        ...optionalData};
    const projectsCollection = collection(db, 'projects');
    return setDoc(doc(projectsCollection, id), projectData)
    .then((dta) => {
        // console.log(dta)
        return projectData
    } )
    .catch(error => {
        console.error('Error adding project:', error.message);
        throw error;
    });
};
export const deleteProjectFromFirestore = async (projectId) => {
    if (!projectId) {
      throw new Error('Project ID is required for deletion.');
    }
  
    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);
  
    try {
      const docSnapshot = await getDoc(projectDoc);
  
      if (docSnapshot.exists()) {
        await deleteDoc(projectDoc);
        // console.log('Project deleted successfully.');
        deleteProjectFromStorage(projectId);
      } else {
        // console.log('Document does not exist.');
        // Handle the case where the document doesn't exist
        throw new Error('Project does not exist.');
      }
    } catch (error) {
      console.error('Error deleting project:', error.message);
      throw error;
    }
  };
  
// Collection Operations
export const addCollectionToFirestore = async (projectId,collectionData) => {
    const {name,status} =collectionData;
    const id= `${name.toLowerCase().replace(/\s/g, '-')}-${generateRandomString(5)}`;

    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);

    const collectionsCollection = collection(projectDoc, 'collections');
    const collectionDoc = {
        id : projectId+'-'+id,
    }

    // Update the project with the new collection
    return updateDoc(projectDoc, {
        collections: arrayUnion({ id, name, status }), // Assuming collections is an array in your projectData
    })
    .then(() => {
        // create new collection 
        setDoc(doc(collectionsCollection, collectionDoc.id), collectionDoc)
    })
    .then(() => {
        // console.log('Collection added to project successfully.');
        return id
    })
    .catch((error) => {
        console.error('Error adding collection to project:', error.message);
        throw error;
    });
};
export const deleteCollectionFromFirestore = async (projectId, collectionId) => {
    if (!projectId || !collectionId) {
        throw new Error('Project ID and Collection ID are required for deletion.');
    }

    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);

    try {
        const projectSnapshot = await getDoc(projectDoc);

        if (projectSnapshot.exists()) {
            const projectData = projectSnapshot.data();
            const updatedCollections = projectData.collections.filter(
                (collection) => collection.id !== collectionId
            );

            await updateDoc(projectDoc, { collections: updatedCollections });
            // console.log('Collection deleted successfully.');
            deleteCollectionFromStorage(projectId, collectionId);
        } else {
            // console.log('Project document does not exist.');
            throw new Error('Project does not exist.');
        }
    } catch (error) {
        console.error('Error deleting collection:', error.message);
        throw error;
    }
};

// Collection Image Operations
// add array of images to collection as selectedImages
export const addSelectedImagesToFirestore = async (projectId, collectionId, images, page, size,totalPages) => {
    if (!projectId || !collectionId || !images) {
        throw new Error('Project ID, Collection ID, and Images are required.');
    }

    let status = page===totalPages? 'selected' : 'selecting';
    // console.log(page,totalPages)
    // console.log(status)
    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);
    const subCollectionId = projectId + '-' + collectionId;
    const collectionDoc = doc(projectDoc, 'collections', subCollectionId);
    try {
        const collectionSnapshot = await getDoc(collectionDoc);
        const collectionData = collectionSnapshot.data();

        if (collectionSnapshot.exists()) {

            const updatedImages = collectionData.uploadedFiles.map((image) => {
                const imageIndex = collectionData.uploadedFiles.indexOf(image);
                const startIndex = (page - 1) * size;
                const endIndex = page * size;

                if (imageIndex >= startIndex && imageIndex < endIndex) {
                    return {
                        ...image,
                        status: images.includes(image.url) ? 'selected' : ''
                    };
                } else {
                    return image; // retain the status if outside the page and size range
                }
            });



            await updateDoc(collectionDoc, {...collectionData,uploadedFiles:updatedImages});
            // update status on projeect
            const projectSnapshot = await getDoc(projectDoc);
            const projectData = projectSnapshot.data();
            
            await updateDoc(projectDoc, {...projectData, status: status});
            // console.log('Selected images status updated successfully.');

        } else {
            // console.log('Collection document does not exist.');
            throw new Error('Collection does not exist.');
        }
    } catch (error) {
        console.error('Error updating image status:', error.message);
        throw error;
    }
}
// Update project status
export const updateProjectStatusInFirestore = async (projectId, status) => {
    if (!projectId || !status) {
        throw new Error('Project ID and status are required.');
    }
    debugger

    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);

    try {
        const projectSnapshot = await getDoc(projectDoc);

        if (projectSnapshot.exists()) {
            await updateDoc(projectDoc, { status: status });
            // console.log('Project status updated successfully.');
        } else {
            // console.log('Project document does not exist.');
            throw new Error('Project does not exist.');
        }
    } catch (error) {
        console.error('Error updating project status:', error.message);
        throw error;
    }
}
// Set Project cover photo
export const setCoverPhotoInFirestore = async (projectId, image) => {
    if (!projectId || !image) {
        throw new Error('Project ID and Image are required.');
    }

    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);

    try {
        const projectSnapshot = await getDoc(projectDoc);
        const projectData = projectSnapshot.data();

        if (projectSnapshot.exists()) {
            await updateDoc(projectDoc, { projectCover: image });
            // console.log('Cover photo updated successfully.');
        } else {
            // console.log('Project document does not exist.');
            throw new Error('Project does not exist.');
        }
    } catch (error) {
        console.error('Error updating cover photo:', error.message);
        throw error;
    }
}


// Event Operations
export const addEventToFirestore = async ({ firstName,lastName, type, ...optionalData }) => {
    if (!firstName ||!lastName || !type) {
    throw new Error('Project name and type are required.');
    }
    const id= `${firstName.toLowerCase().replace(/\s/g, '-')}-${lastName.toLowerCase().replace(/\s/g, '-')}-${generateRandomString(5)}`;
    const eventData = {
        id,firstName,lastName, type,
        ...optionalData,
        // curreent time
        createdAt: new Date()
    };
    // console.log(eventData)
    const eventsCollection = collection(db, 'events');
    return setDoc(doc(eventsCollection, id), eventData)
    .then((dta) => {
        // console.log(dta)
        return eventData
    } )
    .catch(error => {
        console.error('Error adding project:', error.message);
        throw error;
    });
};
export const deleteEventFromFirestore = async (eventId) => {
    if (!eventId) {
        throw new Error('Event ID is required.');
    }
    const eventsCollection = collection(db, 'events');
    const eventDoc = doc(eventsCollection, eventId);
    try {
        const eventSnapshot = await getDoc(eventDoc);
        if (eventSnapshot.exists()) {
            await deleteDoc(eventDoc);
            // console.log('Event deleted successfully.');
        } else {
            // console.log('Event document does not exist.');
            throw new Error('Event does not exist.');
        }
    }
    catch (error) {
        console.error('Error deleting event:', error.message);
        throw error;
    }
};

export const updateEventStatusInFirestore = async (eventId,status) => {
    if (!eventId) {
        throw new Error('Event ID is required.');
    }
    const eventsCollection = collection(db, 'events');
    const eventDoc = doc(eventsCollection, eventId);
    try {
        const eventSnapshot = await getDoc(eventDoc);
        const eventData = eventSnapshot.data();
        if (eventSnapshot.exists()) {
            await updateDoc(eventDoc, {...eventData, status: status});
            // console.log('Event status updated successfully.');
        } else {
            // console.log('Event document does not exist.');
            throw new Error('Event does not exist.');
        }
    }
    catch (error) {
        console.error('Error updating event status:', error.message);
        throw error;
    }

}
export const addEventPaymentLogInFirestore = async (eventId, payment) => {
    if (!eventId) {
        throw new Error('Event ID is required.');
    }

    const eventsCollection = collection(db, 'events');
    const eventDoc = doc(eventsCollection, eventId);

    try {
        const eventSnapshot = await getDoc(eventDoc);

        if (eventSnapshot.exists()) {
            const eventData = eventSnapshot.data();

            // Assuming your event document has a 'paymentLogs' field to store payment information
            const updatedPaymentLogs = eventData.payments.log ? [...eventData.payments.log, payment] : [payment];
            // console.log(updatedPaymentLogs)
            // Update the Firestore document with the new payment information
            await updateDoc(eventDoc, {
                payments:{
                    ...eventData.payments,
                    log: updatedPaymentLogs,
                }
            });
            
            // console.log('Payment log added successfully.');
            return payment;
        } else {
            // console.log('Event document does not exist.');
            throw new Error('Event does not exist.');
        }
    } catch (error) {
        console.error('Error updating payment log:', error.message);
        throw error;
    }
};

export const updateEventPaymentLogInFirestore = async (eventId,logIndex, payment) => {
    if (!eventId) {
        throw new Error('Event ID is required.');
    }

    const eventsCollection = collection(db, 'events');
    const eventDoc = doc(eventsCollection, eventId);

    try {
        const eventSnapshot = await getDoc(eventDoc);

        if (eventSnapshot.exists()) {
            const eventData = eventSnapshot.data();

            // Assuming your event document has a 'paymentLogs' field to store payment information
            eventData.payments.log[logIndex] = payment
            const updatedPaymentLogs = eventData.payments.log
            // console.log(updatedPaymentLogs)
            // Update the Firestore document with the new payment information
            await updateDoc(eventDoc, {
                payments:{
                    ...eventData.payments,
                    log: updatedPaymentLogs,
                }
            });
            
            // console.log('Payment log updated successfully.');
            return payment;
        } else {
            // console.log('Event document does not exist.');
            throw new Error('Event does not exist.');
        }
    } catch (error) {
        console.error('Error updating payment log:', error.message);
        throw error;
    }
};
export const  rescheduleEventDateInFirestore = async (eventId,date) => {
    // date that need to bee updated is in eevent.dateOfShoot
    if (!eventId) {
        throw new Error('Event ID is required.');
    }
    const eventsCollection = collection(db, 'events');
    const eventDoc = doc(eventsCollection, eventId);
    try {
        const eventSnapshot = await getDoc(eventDoc);
        const eventData = eventSnapshot.data();
        if (eventSnapshot.exists()) {
            await updateDoc(eventDoc, {...eventData, dateOfShoot: date});
            // console.log('Event date updated successfully.');
        }
        else {
            // console.log('Event document does not exist.');
            throw new Error('Event does not exist.');
        }
        return {...eventData, dateOfShoot: date}
    }
    catch (error) {
        console.error('Error updating event date:', error.message);
        throw error;
    }
}
// Set Event Cover
export const setEventCoverPhotoInFirestore = async (eventId, image) => {
    if (!eventId || !image) {
        throw new Error('Event ID and Image are required.');
    }

    const eventsCollection = collection(db, 'events');
    const eventDoc = doc(eventsCollection, eventId);

    try {
        const eventSnapshot = await getDoc(eventDoc);
        const eventData = eventSnapshot.data();

        if (eventSnapshot.exists()) {
            await updateDoc(eventDoc, { eventCover: image });
            console.log('Cover photo updated successfully.');
        } else {
            console.log('Event document does not exist.');
            throw new Error('Event does not exist.');
        }
    } catch (error) {
        console.error('Error updating cover photo:', error.message);
        throw error;
    }
}

// add wishlist status for STUDIO plan to use userid
export const addWishlistToFirestore = async (userId, productId) => {
    if (!userId) {
        throw new Error('User ID is required.');
    }

    if (!productId) {
        throw new Error('Product ID is required.');
    }

    const userDoc = doc(db, 'users', userId);

    try {
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) {
            // Create new user document if it doesn't exist
            await setDoc(userDoc, {
                wishlist: [productId],
                requestedDates: [new Date()]
            });

            // console.log('New user document created with wishlist.');

        } else {
            const userData = userSnapshot.data();

            // check if wishlist array exists  
            let wishlist = userData.wishlist ? [...userData.wishlist] : [];


            if (true) {
                wishlist.push(productId);

                await updateDoc(userDoc, {
                    wishlist,
                    requestedDates: [...userData.requestedDates, new Date()]
                });

                // console.log('Product added to wishlist successfully.');
                return true;
            } else {
                // console.log('Product already in wishlist.');
                return false;
            }

        }

    } catch (error) {
        console.error('Error adding product to wishlist:', error.message);
        throw error;
    }
};


