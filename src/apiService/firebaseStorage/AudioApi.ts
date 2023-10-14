import { firestore } from '../../constants/firebase';
import { addDoc, collection, setDoc, doc, getDocs, getDoc, where, endAt, startAt, deleteDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { query, orderBy, limit } from 'firebase/firestore'
import { geohashQueryBounds, geohashForLocation, distanceBetween } from 'geofire-common'
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { ConsoleLogger } from '@aws-amplify/core';
import { getStorage, ref, uploadBytes, getDownloadURL, } from "firebase/storage";
import uuid from 'react-native-uuid';
import storage, { firebase } from '@react-native-firebase/storage';
import { auth, database } from '../../constants/firebase'

export async function uploadAudioFile(filePath: string, applicationId: string, recordingStorageId: string, callback) {
    try {
        // const storageRef = storage().ref(`voices/${jobPostId}/${recordingStorageId}`);
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
              resolve(xhr.response);
            };
            xhr.onerror = function (e) {
              console.log(e);
              reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", filePath, true);
            xhr.send(null);
          });
        //   console.log("\n audioDebug: blob finished audio file")
        //   const storageRef = storage().ref(`${applicationId}/${recordingStorageId}`)
        //   const task = storageRef.putFile(filePath)
        //   const downloadURL = await storageRef.getDownloadURL()
        const fileRef = ref(getStorage(), `${applicationId}/${recordingStorageId}`);

        const result = await uploadBytes(fileRef, blob).then((snapshot) => {
        }).catch((err) => {
            callback(err, null)
        });
        
        const downloadURL = await getDownloadURL(fileRef);
        callback(null, downloadURL)
    } catch(e) {
        callback(e, null)
    }
}
