import { firestore } from '../../constants/firebase';
import { addDoc, collection, setDoc, doc, getDocs, getDoc, where, endAt, startAt, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { jobPostConverter } from './firestoreUtils';
import { query, orderBy, limit } from 'firebase/firestore'
import { geohashQueryBounds, geohashForLocation } from 'geofire-common'
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { ConsoleLogger } from '@aws-amplify/core';
import { createReferralCodeAPI } from './ReferralCodeApi';


/** ============================ APPLICANT PROFILE DATA API ================================== */
const applicantRef = collection(firestore, "applicantProfile")
// create applicant profile data,
export async function createApplicantProfileAPI(data, callback) {
    try {
        await setDoc(doc(applicantRef, data.id), {
            data
        });

        console.log('create new applicant successfully!');
        callback(null)
    } catch (err) {
        console.log('create new applicant failed');
        callback(err);
    }
}

// Pretty much same as create
export async function updateApplicantProfileAPI(data, callback) {
    console.log(data)
    try {
        await setDoc(doc(firestore, "applicantProfile", data.id), {
            data
        });

        console.log('update applicant profile info successfully!');
        if (callback) {
          callback(null);
        }
    } catch (err) {
        console.log('update applicant profile failed');
        callback(err);
    }
}

// fetch applicant profile data
export async function fetchApplicantProfileDataAPI (uid, callback) {
    try {
        const ref = doc(firestore, "applicantProfile", uid);
        const docSnap = await getDoc(ref);

        if (docSnap.exists() && callback) {
            callback(docSnap.data().data);
        } else {
            console.log('no applicant data!');
        }
    } catch (err) {
        console.log('Fetch applicant profile data failed');
        console.log(err);
        callback(null);
    }
}

// update applicant profile data
export async function updateApplicantProfileDataAPI (uid, data) {
    try {
        await updateDoc(doc(firestore, "applicantProfile", uid), {
            data
        });

        console.log('update applicant profile data successfully!');
    } catch (err) {
        console.log('update applicant profile data failed');
        console.log(err);
    }
}

// update applicant profile pic
export async function updateApplicantProfilePicUrlAPI (uid, data, callback) {
    try {
        await updateDoc(doc(firestore, "applicantProfile", uid), {
            "data.profilePicUrl": data
        })
        console.log('update employer profile pic url successfully');
        if (callback) {
          callback();
        }
    } catch (err) {
        console.log('update applicant profile pic url failed');
        console.log(err);
    }
}

// update applied job post id
export async function updateApplicantAppliedJobsAPI (uid, postId, appId) {
    try {
        const data = Object({postId: postId, appId: appId});
        await updateDoc(doc(firestore, "applicantProfile", uid), {
            "data.appliedJobs": arrayUnion(data)
        });
        console.log('applied to job successfully!');
    } catch (err) {
        console.log('applied to job failed');
        console.log(err);
    }
}

// update applicant availability
export async function updateApplicantAvailabilityAPI (uid, availability) {
    try {
        await updateDoc(doc(firestore, "applicantProfile", uid), {
            "data.availability": availability
        })
        console.log('update availability successfully!');
    } catch (err) {
        console.log('update availability failed');
        console.log(err);
    }
}
