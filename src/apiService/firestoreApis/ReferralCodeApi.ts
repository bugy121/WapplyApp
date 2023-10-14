import { firestore } from '../../constants/firebase';
import { addDoc, collection, setDoc, doc, getDocs, getDoc, where, endAt, startAt, deleteDoc, updateDoc, arrayRemove, arrayUnion, increment} from 'firebase/firestore';
import { query, orderBy, limit } from 'firebase/firestore'


// create referral code for a profile.
// data: code, userid
export async function createReferralCodeAPI(data) {
    try {
        console.log(data);
        await setDoc(doc(firestore, "referralCodes", data.code), {
            data
        });

        console.log('Registered new referral code successfully!');
    } catch (err) {
        console.log('registered new referral code failed');
    }
}

// fetch userid for a referral code
export async function fetchReferralCodeUserAPI (code, callback) {
    try {
        const ref = doc(firestore, "referralCodes", code);
        const docSnap = await getDoc(ref);

        if (docSnap.exists() && callback) {
            console.log('Referral code found!')
            callback(docSnap.data().data);
        } else {
            console.log('Referral code not found!');
            callback(null);
        }
    } catch (err) {
        console.log('Fetch referral code failed');
        console.log(err);
    }
}

// record a referral for the referrer given by userid
export async function recordReferralAPI (uid, callback) {
    const referralNumCoins = 100;
    console.log(uid);
    try {
        const ref = doc(firestore, "applicantProfile", uid);
        await updateDoc(ref, {
          "data.referralNum": increment(1)
        });
        await updateDoc(ref, {
          "data.coins": increment(referralNumCoins)
        });
        console.log("Registered referral successfully");
    } catch (err) {
        console.log('Register referral failed');
        console.log(err);
    }
}

// record a referral for the referrer given by userid
export async function editReferralCoinsAPI (uid, numCoins, callback) {
    try {
        const ref = doc(firestore, "applicantProfile", uid);
        await updateDoc(ref, {
          "data.coins": increment(numCoins)
        });
        console.log("Modified coins successfully");
        callback(null);
    } catch (err) {
        console.log('Modify coins failed');
        console.log(err);
    }
}
