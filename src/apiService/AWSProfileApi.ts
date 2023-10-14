import { API, graphqlOperation } from "@aws-amplify/api";
import { createEmployerProfileDataModel, updateEmployerProfileDataModel, createApplicantProfileDataModel, updateApplicantProfileDataModel, createJobPostingData, updateJobPostingData, createJobApplicationData} from "../graphql/mutations";
import { getEmployerProfileDataModel, getJobPostingData, getApplicantProfileDataModel, listJobPostingData, getJobApplicationData, listJobApplicationData } from "../graphql/queries";
import { encodeEmployerProfileData, decodeEmployerProfileData, encodeApplicantProfileData, decodeApplicantProfileData, decodeJobListing, encodeJobListing } from "./AWSUtils";
import { deleteJobPostingData } from "../graphql/mutations";

/** ============================ EMPLOYER USER API ================================== */
export async function fetchEmployerProfileDataAPI(uid, callback) {
    try {
        const retrievedProfile = await API.graphql(graphqlOperation(getEmployerProfileDataModel, {"id": uid}))
        if (callback) {callback(retrievedProfile)}
        return retrievedProfile;
    } catch(err) {
        console.log("get employer profile data failed")
        console.log(err)
    }
}

export async function updateEmployerProfileDataAPI(profile, callback) {
    try {
        const uploadedResult = await API.graphql(graphqlOperation(updateEmployerProfileDataModel, {input: profile}))
        if (callback) {callback(uploadedResult, null)}
    } catch(err) {
        console.log("error uploading employer profile data to AWS")
        console.log(err)
    }
}

export async function createEmployerProfileAPI(profile) {
    try {
        const uploadedResult = await API.graphql(graphqlOperation(createEmployerProfileDataModel, {input: profile}))
        console.log("uploaded result: " + uploadedResult)
    } catch(err) {
        console.log("error uploading to AWS")
        console.log(err)
    }
}

export async function updateEmployerProfilePicAPI(uid, url) {
    // get user profile
    let decodedUser;
    await fetchEmployerProfileDataAPI(uid, (profile) => {
        const decoded = decodeEmployerProfileData(profile.data.getEmployerProfileDataModel)
        decodedUser = decoded;
    })

    // add profile pic url
    decodedUser.profilePicUrl = url;

    // update user profile
    const encodeData = encodeEmployerProfileData(decodedUser);
    updateEmployerProfileDataAPI(encodeData, null);
}



/** ============================ APPLICANT USER API ================================== */
export async function fetchApplicantProfileDataAPI(uid, callback) {
    try {
        const retrievedProfile = await API.graphql(graphqlOperation(getApplicantProfileDataModel, {"id": uid}))
        if (callback) {callback(retrievedProfile)}
        return retrievedProfile;
    } catch(err) {
        console.log("get applicant profile data failed")
        console.log(err)
    }
}

export async function updateApplicantProfileDataAPI(profile, callback) {
    try {
        const uploadedResult = await API.graphql(graphqlOperation(updateApplicantProfileDataModel, {input: profile}))
        if (callback) {callback(uploadedResult, null)}
    } catch(err) {
        console.log("error uploading applicant profile data to AWS")
        console.log(err)
    }
}

export async function createApplicantProfileAPI(profile) {
    try {
        const uploadedResult = await API.graphql(graphqlOperation(createApplicantProfileDataModel, {input: profile}))
    } catch(err) {
        console.log("error creating new applicant in AWS")
        console.log(err)
    }
}

export async function updateApplicantProfilePicAPI(uid, url) {
    // get user profile
    let decodedUser;
    await fetchApplicantProfileDataAPI(uid, (profile) => {
        const decoded = decodeApplicantProfileData(profile.data.getApplicantProfileDataModel)
        decodedUser = decoded;
    })

    // add profile pic url
    decodedUser.profilePicUrl = url;

    // update user profile
    const encodeData = encodeApplicantProfileData(decodedUser);
    updateApplicantProfileDataAPI(encodeData, null);
}



/** ============================ JOB API ================================== */
export async function listAllJobPost(callback) {
    try {
        const result = await API.graphql(graphqlOperation(listJobPostingData));
        callback(result);
    } catch (err) {
        console.log('error getting all job posts')
        console.log(err)
    }
}

export async function fetchJobPostAPI(postId, callback) {
    try {
        let postList = []
        for (let id of postId) {
            const retrievedJobPosts = await API.graphql(graphqlOperation(getJobPostingData, {"id": id}))
            postList.push(retrievedJobPosts)
        }
        if (callback) {callback(postList);}
        return postList;
    } catch(err) {
        console.log('get job posts failed')
        console.log(err)
    }
}

export async function createJobPostAPI(uid, postId, post) {
    try {
        const uploadedResult = await API.graphql(graphqlOperation(createJobPostingData, {input: post}))
        console.log("uploaded result: ", uploadedResult)

        updateEmployerJobPostId(uid, postId)
    } catch(err) {
        console.log('error uploading job post')
        console.log(err)
    }
}

// helper api ^^^
export async function updateEmployerJobPostId(uid, postId) {
    // get user profile
    let decodedUser;
    await fetchEmployerProfileDataAPI(uid, (profile) => {
        const decoded = decodeEmployerProfileData(profile.data.getEmployerProfileDataModel)
        decodedUser = decoded;
    })

    // add job post id
    if (!decodedUser.jobPostIds) {
        const jobPostIds = [postId];
        decodedUser.jobPostIds = jobPostIds;
    } else {
        decodedUser.jobPostIds.push(postId);
    }

    // update user profile
    const encodeData = encodeEmployerProfileData(decodedUser);
    updateEmployerProfileDataAPI(encodeData);
}

export async function updateJobPostAPI(post) {
    try {
        const uploadedResult = API.graphql(graphqlOperation(updateJobPostingData, {input: post}));
    } catch (err) {
        console.log('failed to update job post');
        console.log(err);
    }
}

export async function deleteJobPostAPI(uid, postId) {
    try {
        const encodedId = {
            'id': postId,
        }
        const deleteResult = API.graphql(graphqlOperation(deleteJobPostingData, {input: encodedId}));

        // delete job post id in employer data
        deleteEmployerJobPostId(uid, postId)
    } catch (err) {
        console.log('failed to delete job post');
        console.log(err);
    }
}

// helper api ^^^
export async function deleteEmployerJobPostId(uid, postId) {
    // get user profile
    let decodedUser;
    await fetchEmployerProfileDataAPI(uid, (profile) => {
        const decoded = decodeEmployerProfileData(profile.data.getEmployerProfileDataModel)
        decodedUser = decoded;
    })

    // delete job post id
    const index = decodedUser.jobPostIds.indexOf(postId);
    if (index > -1) {
        decodedUser.jobPostIds.splice(index, 1);
    }

    // update user profile
    const encodeData = encodeEmployerProfileData(decodedUser);
    updateEmployerProfileDataAPI(encodeData);
}

/** ============================ APPLICATION API ================================== */
export async function createJobApplicationAPI(uid, postId, app) {
    try {
        // upload job application
        const uploadedResult = API.graphql(graphqlOperation(createJobApplicationData, {input: app}))
        console.log('submit application successfully!');

        // update applicant applied job list
        const applicantData = await fetchApplicantProfileDataAPI(uid, decodeApplicantProfileData);
        decodedApplicantData = applicantData.data.getApplicantProfileDataModel;

        const appIds = postId + "," + app.id;
        if (!decodedApplicantData.appliedJobs) {
            decodedApplicantData.appliedJobs = [appIds];
        } else if (decodedApplicantData.appliedJobs.indexOf(appIds) > -1) {
            // TODO: change data struct for dup check: appliedJobs.indexOf(postId)
            alert('You have already applied for this position!');
        } else {
            decodedApplicantData.appliedJobs.push(appIds);
        }

        const encodedApplicantData = await encodeApplicantProfileData(decodedApplicantData);
        updateApplicantProfileDataAPI(encodedApplicantData);
        console.log('add job post to applicant profile successfully!');
        
        // update job post
        const jobPost = await fetchJobPostAPI([postId]);
        const decodedJobPost = await decodeJobListing(jobPost[0].data.getJobPostingData);

        if (!decodedJobPost.applicationIds) {
            decodedJobPost.applicationIds = [app.id];
        } else if (decodedJobPost.applicationIds.indexOf(app.id) > -1) {
            alert('You have already applied for this position!');
        } else {
            decodedJobPost.applicationIds.push(app.id);
        }
    
        const encodedJobPost = await encodeJobListing(decodedJobPost);
        updateJobPostAPI(encodedJobPost);
        console.log('add application to job post data successfully!');
    } catch (err) {
        console.log('applied to job failed');
        console.log(err);
    }
}
