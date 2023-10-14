import { firestore } from '../../constants/firebase';
import { addDoc, collection, setDoc, doc, getDocs, getDoc, where, endAt, startAt, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { jobPostConverter } from './firestoreUtils';
import { query, orderBy, limit } from 'firebase/firestore'
import { geohashQueryBounds, geohashForLocation } from 'geofire-common'
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { ConsoleLogger } from '@aws-amplify/core';
import { createJobPostApplicationList } from './JobPostingApplicationListApi';
import { dismissBrowser } from 'expo-web-browser';



/** ============================ EMPLOYER JOB API ================================== */

// add a new job post
export async function addNewJobPostAPI(uid, post, callback) {
    try {
        // add new job post to firestore
        if (!post.isInternship) {
            await setDoc(doc(firestore, "jobPosts", post.id), {
                post
            })
            // add job post id to employer profile data
            await updateDoc(doc(firestore, "employerProfile", uid), {
                "profile.jobPostIds": arrayUnion(post.id)
            });
        } else {
        // OR
        // add new internship post to firebase
            await setDoc(doc(firestore, "internshipPosts", post.id), {
                post
            })
            // add internship post id to employer profile data
            await updateDoc(doc(firestore, "employerProfile", uid), {
                "profile.internPostIds": arrayUnion(post.id)
            });
        }

        // await setDoc(doc(firestore, "jobPosts", post.id), {
        //     post
        // })

        // add job post id to employer profile data
        // await updateDoc(doc(firestore, "employerProfile", uid), {
        //     "profile.jobPostIds": arrayUnion(post.id)
        // });

        // add new job post application list in jobPostApplications
        await createJobPostApplicationList(post.id);
      
        console.log('Add new job post succesfully!');
        callback(null)
    } catch (err) {
        console.log('Add new job post failed');
        callback(err)
    }
}

// add a new link post
export async function addNewLinkPostAPI(uid, post) {
    // console.log('uid: ', uid);
    // console.log('post: ', post);
    try {
        // add new job post to firestore
        await setDoc(doc(firestore, "linkPosts", post.id), {
            post
        })

        // add job post id to employer profile data
        await updateDoc(doc(firestore, "employerProfile", uid), {
            "profile.linkPostIds": arrayUnion(post.id)
        });
      
        console.log('Add new out of app post succesfully!');
    } catch (err) {
        console.log('Add new out of app post failed');
        console.log(err);
    }
}

// fetch all job posts
export async function getAllJobPostAPI (callback) {
    try {
        const ref = collection(firestore, 'jobPosts');
        const querySnapshot = await getDocs(ref);
        let postList = [];
        if (querySnapshot) {
            await querySnapshot.forEach((doc) => {
                const data = doc.data();
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

// fetch job posts that are posted by an employer
export async function getPostedJobPostAPI (postId, callback) {
    try {
        let postList = [];
        for (let id of postId) {
            const ref = doc(firestore, "jobPosts", id);
            const docSnap = await getDoc(ref);

            if (docSnap.exists()) {
                let jobPostData = docSnap.data()
                if (jobPostData.post.status != "DELETED") {
                    if (jobPostData.post.latestDateBumped == null) {
                        jobPostData.post.latestDateBumped = jobPostData.post.datePosted
                    }
                    postList.push(jobPostData);
                }
            }
        }
        if (callback) {callback(postList);}
        console.log('get posted job posts successfully!');
    } catch (err) {
        console.log('failed to get posted job posts');
        console.log(err);
    }
}

// fetch link posts 
export async function getLinkPostAPI (postId, callback) {
    try {
        let postList = [];
        for (let id of postId) {
            const ref = doc(firestore, "linkPosts", id);
            const docSnap = await getDoc(ref);

            if (docSnap.exists()) {
                let linkPostData = docSnap.data()
                if (linkPostData.post.status != "DELETED") {
                    if (linkPostData.post.latestDateBumped == null) {
                        linkPostData.post.latestDateBumped = linkPostData.post.datePosted
                    }
                    postList.push(linkPostData);
                }
            }
        }
        if (callback) {callback(postList);}
        console.log('get out of app posts successfully!');
    } catch (err) {
        console.log('failed to get out of app posts');
        console.log(err);
    }
}

// fetch internship posts 
export async function getInternPostAPI (postId, callback) {
    try {
        let postList = [];
        for (let id of postId) {
            const ref = doc(firestore, "internshipPosts", id);
            const docSnap = await getDoc(ref);

            if (docSnap.exists()) {
                let linkPostData = docSnap.data()
                if (linkPostData.post.status != "DELETED") {
                    if (linkPostData.post.latestDateBumped == null) {
                        linkPostData.post.latestDateBumped = linkPostData.post.datePosted
                    }
                    postList.push(linkPostData);
                }
            }
        }
        if (callback) {callback(postList);}
        console.log('get internship posts successfully!');
    } catch (err) {
        console.log('failed to get internship posts');
        console.log(err);
    }
}

export async function deactivateJobPostAPI(jobPostData, callback) {
    try {
        await updateDoc(doc(firestore, "jobPosts", jobPostData.id),{
            post: jobPostData
        })
        callback(null)
    } catch(err) {
        callback(err)
    }
}

export async function deactivateLinkPostAPI(linkPostData, callback) {
    try {
        await updateDoc(doc(firestore, "linkPosts", linkPostData.id),{
            post: linkPostData
        })
        callback(null)
    } catch(err) {
        callback(err)
    }
}

export async function deactivateInternPostAPI(jobPostData, callback) {
    try {
        await updateDoc(doc(firestore, "internshipPosts", jobPostData.id),{
            post: jobPostData
        })
        callback(null)
    } catch(err) {
        callback(err)
    }
}

// delete a job post
export async function deleteJobPostAPI (jobPostData, callback) {
    // We do not want to completely delete because applicant will need to access still
    try {
        await updateDoc(doc(firestore, "jobPosts", jobPostData.id),{
            post: jobPostData
        })

        callback(null)
    } catch(err) {
        callback(err)
    }
    // try {
    //     // delete job post document
    //     await deleteDoc(doc(firestore, "jobPosts", postId));

    //     // delete job post id in employer profile data (update postedJobs) TODO
    //     await updateDoc(doc(firestore, "employerProfile", uid), {
    //         "profile.jobPostIds": arrayRemove(postId)
    //     });
    //     console.log('delete job post successfully!');
    // } catch (err) {
    //     console.log('delete job post failed');
    //     console.log(err);
    // }
}

// delete a link post
export async function deleteLinkPostAPI (linkPostData, callback) {
    try {
        await updateDoc(doc(firestore, "linkPosts", linkPostData.id),{
            post: linkPostData
        })
        callback(null)
    } catch(err) {
        callback(err)
    }
}

// delete a job post
export async function deleteInternPostAPI (jobPostData, callback) {
    // We do not want to completely delete because applicant will need to access still
    try {
        await updateDoc(doc(firestore, "internshipPosts", jobPostData.id),{
            post: jobPostData
        })

        callback(null)
    } catch(err) {
        callback(err)
    }
}

// update a job post
export async function updateJobPost(post, postId, callback) {
    try {
        const ref = doc(firestore, "jobPosts", postId);
        await updateDoc(ref, {
            post: post
        });
        console.log('update job post successfully!');
        callback(null)
    } catch (err) {
        console.log('failed to update job post');
        callback(err)
    }
}

export async function getApplicationIds(postId: string, callback) {
    try {
        const ref = doc(firestore, "jobPostApplications", postId);
        const snapshot = await getDoc(ref);
    
        let applicationIds = [];
        if (snapshot.data()) {
            for (let a of snapshot.data().jobApplicationIds) {
                applicationIds.push(a);
            }
            callback(null, applicationIds)
        } else {
            console.log('No applications for this job post yet!');
            return
        }
    } catch(err) {
        callback(err, null)
    }   
}

// get applications for a job post 
export async function getJobApplicationsAPI (postId: string, callback) {
    try {
        // get app ids for this job post
        getApplicationIds(postId, async (err: string, applicationIds) => {
            if (err != null) {
                callback(err, null)
                return
            }

            try {
                let appData = [];
                for await (const id of applicationIds) {
                    const app = await getDoc(doc(firestore, "jobApplications", id));
                    if (!app.exists()) {
                        continue
                    }

                    let applicationData = app.data()
                    appData.push(applicationData);
                }

                if (callback) {callback(null, appData);}
            } catch(err) {
                callback(err, null)
            }
        })

        // get application data in jobApplications table

    } catch (err) {
        console.log('Failed to get applications for this job post');
        callback(err, null)
    }
}

export async function updateApplicationData(newApplicationData, callback) {
    try {
        await updateDoc(doc(firestore, "jobApplications", newApplicationData.id), {
            app: newApplicationData
        });
        callback(null)
    } catch (e) {
        callback(e)
    }
}

export async function bumpJobPostAPI(postId, date: string, callback) {
    try {
        const ref = doc(firestore, "jobPosts", postId);
        await updateDoc(ref, {
            "post.latestDateBumped": date
        });
        console.log('bump job post successfully!');
        callback(null)
    } catch (err) {
        console.log('failed to bump job post');
        console.log(err);
        callback(err)
    }
}

export async function bumpLinkPostAPI(postId, date: string, callback) {
    try {
        const ref = doc(firestore, "linkPosts", postId);
        await updateDoc(ref, {
            "post.latestDateBumped": date
        });
        console.log('bump job post successfully!');
        callback(null)
    } catch (err) {
        console.log('failed to bump job post');
        console.log(err);
        callback(err)
    }
}

// bump internship post
export async function bumpInternPostAPI(postId, date: string, callback) {
    try {
        const ref = doc(firestore, "internshipPosts", postId);
        await updateDoc(ref, {
            "post.latestDateBumped": date
        });
        console.log('bump job post successfully!');
        callback(null)
    } catch (err) {
        console.log('failed to bump job post');
        console.log(err);
        callback(err)
    }
}

