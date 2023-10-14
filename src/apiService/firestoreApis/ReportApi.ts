import { firestore } from '../../constants/firebase';
import { addDoc, collection, setDoc, doc, getDocs, getDoc, where, endAt, startAt, deleteDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { jobPostConverter } from './firestoreUtils';
import { query, orderBy, limit } from 'firebase/firestore'
import { geohashQueryBounds, geohashForLocation, distanceBetween } from 'geofire-common'
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { ConsoleLogger } from '@aws-amplify/core';
import uuid from 'react-native-uuid'

export async function reportJobPost(jobPostData, reporterProfileId: string, message: string, callback) {
    try {
        const newReportId = uuid.v4()
        let idsData = await (await getDoc(doc(firestore, "jobPostReportIds", jobPostData.id))).data()
        let reportIds = idsData != undefined ? idsData.reportIds : []
        
        //Check if the reporter has already reported
        let alreadyReported = false;
        reportIds.forEach((reportIdData) => {
            if (reportIdData.reporterProfileId === reporterProfileId) {
                alreadyReported = true
            }
        })
        if (alreadyReported) {
            callback("Already reported this job. Report will be reviewed and processed soon! Thank you for being patient")
            return
        }

        await setDoc(doc(firestore, "jobPostReportIds", jobPostData.id), {
            reportIds: [...reportIds, {reportId: newReportId, reporterProfileId: reporterProfileId}]
        })

        await setDoc(doc(firestore, "jobPostReportData", newReportId.toString()), {
            reporterProfileId: reporterProfileId,
            jobPostData: jobPostData,
            dateReported: Date(),
            message: message
        });
        callback(null)
    } catch(e) {
        callback(e)
    }
} 

export async function reportProfile(profileId: string, reporterProfileId: string) {

}

export async function reportApplication(applicationId: string, reporterProfileId: string) {

}

// export async function getJobPostReport
