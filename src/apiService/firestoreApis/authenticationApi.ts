import { firestore } from "../../constants/firebase";
import { addDoc, collection, setDoc, doc, getDocs, getDoc, where, endAt, startAt, updateDoc } from 'firebase/firestore';
import { query, orderBy, limit } from 'firebase/firestore'
import auth from '@react-native-firebase/auth';

export async function addNewPhoneNumberEmailPairAPI (profile) {
    try {
        await setDoc(doc(firestore, "phoneNumberEmailMap", profile.phoneNumber), {
            email: profile.email
        })

        console.log('Add new phone number email pair successfully!');
    } catch (err) {
        console.log('Add new phone number email pair failed');
        console.log(err);
    }
}

export async function getEmailAddressByPhoneNumberAPI (phoneNumber, callback) {
    try {
        const docSnap = await getDoc(doc(firestore, 'phoneNumberEmailMap', "+1" + phoneNumber));
        if (docSnap.exists() && callback) {
            callback(docSnap.data().email)
        } else {
            callback("")
        }
    } catch (err) {
        console.log('Get email address failed');
        console.log(err);
    }
}

// Send verification Code
export async function signInWithPhoneNumber(phoneNumber) {
    return await auth().signInWithPhoneNumber('+1 ' + phoneNumber);
}