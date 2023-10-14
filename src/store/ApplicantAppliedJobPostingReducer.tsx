
import { JobPostingData } from './ReducerAllDataTypes';
import { JobApplicationData } from './ReducerAllDataTypes';

export const ADD_APPLIED_JOB = "LeanRecords/applicant/job/NEW_APPLIED_JOB_POSTING"
export const DELETE_APPLIED_JOB = "LeanRecords/applicant/job/DELETE_APPLIED_JOB_POSTING"
export const ADD_APPLICATION = "LeanRecords/applicant/job/NEW_APPLICATION"
export const DELETE_APPLICATION = "LeanRecords/applicant/job/DELETE_APPLICATION"
export const RESET_APPLICATION_REDUCER = "LeanRecords/applicant/job/RESET_APPLICATION_REDUCER"
export const CHANGE_APPLIED_JOBS_LOADED = "LeanRecords/applicant/job/CHANGE_APPLIED_JOBS_LOADED"
export const BUMP_APPLIED_JOB = "LeanRecords/applicant/job/BUMP_APPLIED_JOB"

export const addNewAppliedJobPosting = (newPost: JobPostingData) => {
    return {
        type: ADD_APPLIED_JOB,
        data: newPost
    }
};

export const deleteJobPosting = (postId: string) => {
    return {
        type: DELETE_APPLIED_JOB,
        data: postId
    }
};

export const addAppliedJobApplication = (postId: string, newApp: JobApplicationData) => {
    return {
        type: ADD_APPLICATION,
        data: {
            postId: postId,
            appData: newApp
        }
    }
};

export const deleteAppliedJobApplication = (postId: string,) => {
    return {
        type: DELETE_APPLICATION,
        data: postId
    }
};

export const changeAppliedJobsLoaded = (loaded: boolean) => {
    return {
        type: CHANGE_APPLIED_JOBS_LOADED,
        data: loaded
    }
}

export const resetApplicantAppliedJobReducer = () => {
    return {
        type: RESET_APPLICATION_REDUCER
    }
}

export const bumpJobApp = (postId: string, priority: boolean) => {
    return {
        type: BUMP_APPLIED_JOB,
        data: {
            postId: postId,
            priority: priority
        }
    }
}

const initialState = {
    // This list contains applied job postings data
    postings: [],
    // This list contains applied job postings' id
    postingIds: [],
    // A map maps job id to application data
    applications: {},
    // This is used to see if postings are loaded or not in useEffects
    postingsLoaded: false,
};

export function ApplicantAppliedJobPostingReducer(state = initialState, action) {

    const { type, data } = action

    switch (type) {
        case ADD_APPLIED_JOB:
            if (state.postingIds.includes(data.id)) {
                return {
                    ...state
                }
            }
            return {
                ...state,
                postings: [...state.postings, data],
                postingIds: [...state.postingIds, data.id],
            }
        case DELETE_APPLIED_JOB:
            return {
                ...state,
                postings: state.postings.filter(function(posting){
                     return posting.id != data
                    })
            }
        case ADD_APPLICATION:
            return {
                ...state,
                applications: {
                    ...state.applications,
                    [data.postId]: data.appData
                }
            }
        case DELETE_APPLICATION:
            return {
                ...state,
                applications: {
                    ...state.applications,
                    [data.postId]: null
                }
            }
        case CHANGE_APPLIED_JOBS_LOADED:
            return {
                ...state,
                postingsLoaded: data
            }
        case RESET_APPLICATION_REDUCER:
            return initialState;
        case BUMP_APPLIED_JOB:
            const updatedApplications = state.applications;
            updatedApplications[data.postId].app.priority = data.priority
            return {
                ...state,
                applications: updatedApplications
            }
        default:
            return state
    }

}
