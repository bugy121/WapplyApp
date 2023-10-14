import { firestore } from "../../constants/firebase";
import { addDoc, collection, setDoc, doc, getDocs, getDoc, where, endAt, startAt, updateDoc } from 'firebase/firestore';
import { query, orderBy, limit } from 'firebase/firestore'

import { EmployerProfileData } from "../../store/EmployerProfileReducer";

const employerRef = collection(firestore, "employerProfile")

export async function addNewEmployerProfileAPI(profile, callback) {
    try {
        await setDoc(doc(employerRef, profile.id), {
            profile
        })
        console.log('Add new employer profile succesfully!');
        callback(null)
    } catch (err) {
        console.log('Add new employer profile failed');
        callback(err)
    }
}

export async function updateEmployerProfileAPI(profile, callback) {
    try {
        console.log('profile: ', profile);
        await setDoc(doc(employerRef, profile.id), {
            profile
        });

        console.log('update employer profile info successfully!');
        callback(null)
    } catch (err) {
        console.log('update employer profile failed');
        callback(err);
    }
}

function decodeFetchedProfile(employerSnapshot: any) {
    const profile = employerSnapshot.profile
    const decodedProfile: EmployerProfileData = {
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        userType: profile.userType,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        address: {
            streetAddr: profile.address.streetAddr,
            complementAddr: profile.address.complementAddr,
            city: profile.address.city,
            state: profile.address.state,
            zip: profile.address.zip,
            country: profile.address.country
        },
        location: {
            lon: profile.location.lon,
            lat: profile.location.lat,
        },
        businessName: profile.businessName,
        businessDescription: profile.businessDescription,
        industry: profile.industry,
        jobPostIds: profile.jobPostIds,
        profilePicUrl: profile.profilePicUrl,
    }
    return decodedProfile
}

// in future we can use getDocFromCache for offline to potentially improve UX
export async function fetchEmployerProfile(id: string, callback) {
    try {
        const docRef = doc(employerRef, id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const decodedUser = decodeFetchedProfile(docSnap.data())
            // callback(null, decodedUser)
            callback(null, docSnap.data().profile)
        } else {
            callback("Profile does not exist", null)
        }
    } catch (err) {
        callback(err, null)
    }
}

// update employer profile pic 
export async function updateEmployerProfilePicUrlAPI (uid, data) {
    try {
        await updateDoc(doc(firestore, "employerProfile", uid), {
            "profile.profilePicUrl": data
        })
        console.log('update employer profile pic url successfully');
    } catch (err) {
        console.log('update employer profile pic url failed');
        console.log(err);
    }
}

// address to string (helper function)
export async function addressToString (addr, callback) {
    let res = '';
    res += addr.streetAddr + ', ' + addr.city + ', ' + addr.state + ', ' + addr.zip
    if (callback) {callback(res)}
}

// address to string (helper function)
export async function addressToStringLite (addr, callback) {
    let res = '';
    res += addr.streetAddr + ', ' + addr.city
    if (callback) {callback(res)}
}