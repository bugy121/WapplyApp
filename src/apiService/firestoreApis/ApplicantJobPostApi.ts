import { firestore } from '../../constants/firebase';
import { addDoc, collection, setDoc, doc, getDocs, getDoc, where, endAt, startAt, deleteDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { jobPostConverter } from './firestoreUtils';
import { query, orderBy, limit } from 'firebase/firestore'
import { geohashQueryBounds, geohashForLocation, distanceBetween } from 'geofire-common'
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { ConsoleLogger } from '@aws-amplify/core';
import { updateApplicantAppliedJobsAPI } from './ApplicantProfileDataApi';
import { updateJobPostApplicationList } from './JobPostingApplicationListApi';


/** ============================ APPLICANT JOB API ================================== */

// apply to a job post
export async function applyJobPostAPI (uid, app, post) {
    try {
        // create job application
        await setDoc(doc(firestore, "jobApplications", app.id), {
            app
        });

        // add job post id in appliedJobPost
        await updateApplicantAppliedJobsAPI(uid, post.id, app.id);

        // add application id to list of application ids for the job post
        // await updateJobPostApplicationList(post.id, app.id);

        // add jobpost -> application id map in jobPostApplications
        await updateJobPostApplicationList(post.id, app.id);

        console.log('Apply to job post succesfully!');
    } catch (err) {
        console.log('Apply to job post failed');
        console.log(err);
    }
}

// fetch all job posts
// Currently not being called
export async function getAllJobPostAPI (callback) {
    try {
        const ref = collection(firestore, 'jobPosts');
        const querySnapshot = await getDocs(ref);
        let postList = [];
        if (querySnapshot) {
            await querySnapshot.forEach((doc) => {
                const data = doc.data();
                console.log("job listing data" + data)
                postList.push(data);
            })
        }
        if (callback) {callback(postList);}
        console.log('get all job posts succesfully!');
    } catch (err) {
        console.log('get all job posts failed');
        console.log(err);
    }
}

// fetch job posts within a range
export async function getJobPostInRange (userLoc, callback) {

    let promises = [];
    const center = userLoc;
    const radiusInM = 15 * 1600; // within 25 mile radius
    const bounds = geohashQueryBounds(center, radiusInM);

    try {
        for (let b of bounds) {
            const ref = collection(firestore, "jobPosts");
            const q = query(ref, orderBy("post.geoHash"), startAt(b[0]), endAt(b[1]));

            const querySnapshot = await getDocs(q);

            if (querySnapshot) {
                await querySnapshot.forEach((doc) => {
                    let data = doc.data();
                    promises.push(data);
                })
            } else {
                console.log('no job post available');
            }
        }

        // Collect all the query results together into a single list
        Promise.all(promises).then((snapshots) => {
            const matchingDocs = [];

            for (const doc of snapshots) {
                const lat = doc.post.location.lat;
                const lng = doc.post.location.lon;

                // We have to filter out a few false positives due to GeoHash
                // accuracy, but most will match
                const distanceInKm = distanceBetween([lat, lng], center);
                const distanceInM = distanceInKm * 1000;
                if (distanceInM <= radiusInM) {
                matchingDocs.push(doc);
                }
            }

            return matchingDocs;
        }).then((matchingDocs) => {
            // Process the matching documents

            for (let i = 0; i < matchingDocs.length; i++) {
                matchingDocs[i].post = sanitizeJobPostData(matchingDocs[i].post)
            }
            console.log("matching docs: " + matchingDocs.length)
            if (callback) {callback(matchingDocs);}
        });

        console.log('get job posts in range successfully!');
    } catch (err) {
        console.log('get job posts in range failed');
        console.log(err);
    }
}

// fetch job posts within a range
export async function getLinkPostInRange (userLoc, callback) {

    let promises = [];
    const center = userLoc;
    const radiusInM = 15 * 1600; // within 25 mile radius
    const bounds = geohashQueryBounds(center, radiusInM);

    try {
        for (let b of bounds) {
            const ref = collection(firestore, "linkPosts");
            const q = query(ref, orderBy("post.geoHash"), startAt(b[0]), endAt(b[1]));

            const querySnapshot = await getDocs(q);

            if (querySnapshot) {
                await querySnapshot.forEach((doc) => {
                    let data = doc.data();
                    promises.push(data);
                })
            } else {
                console.log('no job post available');
            }
        }

        // Collect all the query results together into a single list
        Promise.all(promises).then((snapshots) => {
            const matchingDocs = [];

            for (const doc of snapshots) {
                const lat = doc.post.location.lat;
                const lng = doc.post.location.lon;

                // We have to filter out a few false positives due to GeoHash
                // accuracy, but most will match
                const distanceInKm = distanceBetween([lat, lng], center);
                const distanceInM = distanceInKm * 1000;
                if (distanceInM <= radiusInM) {
                matchingDocs.push(doc);
                }
            }

            return matchingDocs;
        }).then((matchingDocs) => {
            // Process the matching documents

            for (let i = 0; i < matchingDocs.length; i++) {
                matchingDocs[i].post = sanitizeJobPostData(matchingDocs[i].post)
            }
            console.log("matching docs: " + matchingDocs.length)
            if (callback) {callback(matchingDocs);}
        });

        console.log('get link posts in range successfully!');
    } catch (err) {
        console.log('get link posts in range failed');
        console.log(err);
    }
}

// fetch all internship posts
export async function getInternJobPostAPI (userLoc, callback) {
    // exclude in-person internships that are out of range first
    let promises = [];
    const center = userLoc;
    const radiusInM = 15 * 1600; // within 25 mile radius
    const bounds = geohashQueryBounds(center, radiusInM);

    try {
        for (let b of bounds) {
            const ref = collection(firestore, "internshipPosts");
            const q = query(ref, orderBy("post.geoHash"), startAt(b[0]), endAt(b[1]));

            const querySnapshot = await getDocs(q);

            if (querySnapshot) {
                await querySnapshot.forEach((doc) => {
                    let data = doc.data();
                    if (!data.post.isRemote) {
                        promises.push(data);
                    }
                })
            } else {
                console.log('no job post available');
            }
        }

        // Collect all the query results together into a single list
        Promise.all(promises).then((snapshots) => {
            const matchingDocs = [];

            for (const doc of snapshots) {
                if (doc.post.status == "DELETED" || doc.post.status == "DEACTIVATED") {
                    continue
                }

                const lat = doc.post.location.lat;
                const lng = doc.post.location.lon;

                // We have to filter out a few false positives due to GeoHash
                // accuracy, but most will match
                const distanceInKm = distanceBetween([lat, lng], center);
                const distanceInM = distanceInKm * 1000;
                if (distanceInM <= radiusInM) {
                matchingDocs.push(doc);
                }
            }

            return matchingDocs;
        }).then((matchingDocs) => {
            // Process the matching documents

            for (let i = 0; i < matchingDocs.length; i++) {
                matchingDocs[i].post = sanitizeJobPostData(matchingDocs[i].post)
            }
            console.log("matching docs: " + matchingDocs.length)
            promises = matchingDocs;
        });
    } catch (err) {
        console.log('get link posts in range failed');
        console.log(err);
    }

    // add remote internship posts
    try {
        const ref = collection(firestore, 'internshipPosts');
        const querySnapshot = await getDocs(ref);
        if (querySnapshot) {
            await querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.post.isRemote) {
                    promises.push(data);
                }
            })
        }
        if (callback) {callback(promises);}
        console.log('get all internship job posts succesfully!');
    } catch (err) {
        console.log('get all internship job posts failed');
        console.log(err);
    }
}

// fetch applied job posts
export async function getAppliedJobPostAPI (appliedList, callback) {
    try {
        let postList = [];
        for (let post of appliedList) {
            const id = post.postId;
            const ref = doc(firestore, "jobPosts", id);
            const docSnap = await getDoc(ref);

            if (docSnap.exists()) {
                postList.push(docSnap.data());
            }
        }
        if (callback) {
            console.log('get applied job posts successfully!')
            callback(postList);
        }
    } catch (err) {
        console.log('failed to get posted job posts');
        console.log(err);
    }
}

// withdraw an applied job post
export async function withdrawAppliedJobPostAPI (uid, appliedList, withdrawPostId, appId) {
    try {
        // delete application
        await deleteDoc(doc(firestore, "jobApplications", appId));

        // delete application id in postid -> appid map
        await updateDoc(doc(firestore, "jobPostApplications", withdrawPostId), {
            "jobApplicationIds": arrayRemove(appId)
        });

        // delete applied job post id in applicant profile data
        let postList = [];
        // console.log('appliedList', appliedList);
        for (let post of appliedList) {
            if (post.postId != withdrawPostId) {
                postList.push({appId: post.appId, postId: post.postId});
            }
        }
        await updateDoc(doc(firestore, "applicantProfile", uid), {
            "data.appliedJobs": postList
        });
        console.log('withdraw job post successfully!');
    } catch (err) {
        console.log('withdraw job post failed');
        console.log(err);
    }
}

// update a job application
export async function updateJobPost (post, postId) {
    try {
        const ref = doc(firestore, "jobPosts", postId);
        await updateDoc(ref, post);
    } catch (err) {
        console.log('failed to update job post');
        console.log(err);
    }
}

// add application id to a job post
export async function updateJobPostApplicationIdAPI (postId, appId) {
    try {
        console.log('post id: ', postId);
        await updateDoc(doc(firestore, "jobPosts", postId), {
            "post.applicationIds": arrayUnion(appId)
        });
        console.log('add application id to job post successfully!');
    } catch (err) {
        console.log('add application id to job post failed');
        console.log(err);
    }
}

// fetch application for a job post
export async function getApplicationforAppliedJobPostAPI (appliedList, callback) {
    try {
        let postList = [];
        for (let post of appliedList) {
            const id = post.appId;
            const ref = doc(firestore, "jobApplications", id);
            const docSnap = await getDoc(ref);

            if (docSnap.exists()) {
                postList.push({postId: post.postId, applicationData: docSnap.data()});
            }
        }
        if (callback) {callback(postList);}
    } catch (err) {
        console.log('failed to get posted job posts');
        console.log(err);
    }
}

export async function updateJobPostViews (postId, views, callback) {
  try {
      console.log('updating view count of post id: ', postId);
      await updateDoc(doc(firestore, "jobPosts", postId), {
          "post.views": views
      });
      console.log('updated view count of job post successfully');
      callback(null);
  } catch (err) {
      console.log('updating view count of job post failed');
      callback(err);
  }
}

function sanitizeJobPostData(post) {
    if (post.latestDateBumped == null) {
        post.latestDateBumped = post.datePosted
        // console.log("post in sanitze:" + JSON.stringify(post))
    }
    return post
}


export async function bumpJobAppAPI(appId, priority: boolean, callback) {
    try {
        const ref = doc(firestore, "jobApplications", appId);
        await updateDoc(ref, {
            "app.priority": priority
        });
        console.log('bump job app successfully!');
        callback(null)
    } catch (err) {
        console.log('failed to bump job app');
        console.log(err);
        callback(err)
    }
}
