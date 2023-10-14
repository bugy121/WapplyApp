import { firestore } from '../../constants/firebase';
import { addDoc, collection, setDoc, doc, getDocs, getDoc, where, endAt, startAt, deleteDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { jobPostConverter } from './firestoreUtils';
import { query, orderBy, limit } from 'firebase/firestore'
import { geohashQueryBounds, geohashForLocation } from 'geofire-common'

/** ============================ POSTING JOB APPLICATION LIST API ================================== */

// create a new list of job applications for a new job posting
export async function createJobPostApplicationList(postId) {
    try {
        //
        await setDoc(doc(firestore, "jobPostApplications", postId), {
            jobApplicationIds: []
        });

        console.log('Created list of job applications for posting successfully');
    } catch (err) {
        console.log('Did not create list of job applications for posting successfully');
        console.log(err);
    }
}

// add a new application to the list of application ids for a given job posting
export async function updateJobPostApplicationList (postId, appId) {
    try {
        const postingRef = doc(firestore, "jobPostApplications", postId);
        await updateDoc(postingRef, {
        jobApplicationIds: arrayUnion(appId)
        });
        console.log('update job post application list successfully!');
    } catch (err) {
        console.log('failed to update job post application list');
        console.log(err);
    }
}

export async function getApplicationList(jobPostId: string, callback) {
    try {
        const postingRef = doc(firestore, "jobPostApplications", jobPostId);
        const applicationsSnap =  await getDoc(postingRef)
        if (applicationsSnap.exists()) {
            callback(null, applicationsSnap.data().jobApplicationIds)
        } else {
            callback("Snapshot for jobpostid does not exist!", null)
        }
    } catch (err) {
        console.log("Failed to get ")
        callback(err, null)
    }
}
