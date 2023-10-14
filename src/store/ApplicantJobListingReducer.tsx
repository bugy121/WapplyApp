import { JobPostingData, LinkPostData } from './ReducerAllDataTypes';
import { EmployerProfileData } from './ReducerAllDataTypes';

export const BULK_ADD_JOB_TEMPLATE = "LeanRecords/Applicant/job/BULK_NEW_JOB_POSTING"
export const BULK_ADD_JOB_TEMPLATE_DISTANCE = "LeanRecords/Applicant/job/BULK_NEW_JOB_POSTING_DISTANCE"
export const BULK_ADD_NEW_LINK_POST = "LeanRecords/Applicant/job/BUIK_ADD_NEW_LINK_POST"
export const BULK_ADD_NEW_INTERN_POST = "LeanRecords/Applicant/job/BUIK_ADD_NEW_INTERN_POST"
export const ADD_POSTER_PROFILE_DATA = "LeanRecords/Applicant/job/ADD_POSTER_PROFILE_DATA"
export const CHANGE_POSTINGS_LOADED = "LeanRecords/Applicant/job/CHANGE_POSTINGS_LOADED"
export const CHANGE_INTERN_POSTINGS_LOADED = "LeanRecords/Applicant/job/CHANGE_INTERN_POSTINGS_LOADED"
export const RESET_JOB_POSTING_DATA = "LeanRecords/Applicant/job/RESET_JOB_POSTING_DATA"
export const FIRST_JOBS_FETCH = "LeanRecords/Applicant/job/FIRST_JOBS_FETCH"

export const firstJobsFetch = () => {
    return {
        type: FIRST_JOBS_FETCH
    }
}

export const bulkAddNewJobPosting = ( newPost: [JobPostingData]) => {
    return {
        type: BULK_ADD_JOB_TEMPLATE,
        data: newPost
    }
}

export const bulkAddNewJobPostingInDistanceOrder = ( newPost: [JobPostingData]) => {
    return {
        type: BULK_ADD_JOB_TEMPLATE_DISTANCE,
        data: newPost
    }
}

export const bulkAddNewLinkPost = ( newPost: [LinkPostData]) => {
    return {
        type: BULK_ADD_NEW_LINK_POST,
        data: newPost
    }
}

export const bulkAddNewInternPost = ( newPost: [JobPostingData]) => {
    return {
        type: BULK_ADD_NEW_INTERN_POST,
        data: newPost
    }
}

export const addPosterProfileDataForJob = ( postId: string, profileData: EmployerProfileData ) => {
    return {
        type: ADD_POSTER_PROFILE_DATA,
        data: {
            postId: postId,
            profileData: profileData,
        }
    }
}

export const changePostingsLoaded = (loaded: boolean) => {
    return {
        type: CHANGE_POSTINGS_LOADED,
        data: loaded
    }
}

export const changeInternPostingsLoaded = (loaded: boolean) => {
    return {
        type: CHANGE_INTERN_POSTINGS_LOADED,
        data: loaded
    }
}

export const resetJobListingReducer = () => {
    return {
        type: RESET_JOB_POSTING_DATA,
    }
}

const initialState = {
    // all postings data 
    postings: [],
    // all link post data 
    linkPostings: [],
    // all internship postings
    internPostings: [],
    // contains all postings in the ascending order of distance to applicants
    postingsInDistanceOrder: [],
    // This is used to see if postings are loaded or not in useEffects
    postingsLoaded: false,
    // This is used to see if internship postings are loaded or not in useEffects
    internPostingsLoaded: false,
    //this contains all applications loaded so we don't reload when we don't need to
    postApplicationsLoaded: new Set(),
    // maps post id -> employer profile data
    postingsToEmployer: {},
    // This prevents refetching when there are no jobs nearby
    alreadyFetched: false
};

export function ApplicantJobListingReducer(state = initialState, action) {
    
    const { type, data } = action

    switch (type) {
        case BULK_ADD_JOB_TEMPLATE:
            const newData = data.filter((post) => {
                let notExisting = true;
                state.postings.forEach((posting) => {
                    if (posting.id == post.id) {
                        notExisting = false
                        return
                    }
                })
                return notExisting
            })
            return {
                ...state,
                postings: [...state.postings].concat(newData),
            }
        case BULK_ADD_JOB_TEMPLATE_DISTANCE:
            const newDistanceData = data.filter((post) => {
                let notExisting = true;
                state.postingsInDistanceOrder.forEach((posting) => {
                    if (posting.id == post.id) {
                        notExisting = false
                        return
                    }
                })
                return notExisting
            })
            return {
                ...state,
                postingsInDistanceOrder: [...state.postingsInDistanceOrder].concat(newDistanceData),
            }
        case BULK_ADD_NEW_LINK_POST:
            const linkPostData = data.filter((post) => {
                let notExisting = true;
                state.linkPostings.forEach((posting) => {
                    if (posting.id == post.id) {
                        notExisting = false
                        return
                    }
                })
                return notExisting
            })
            return {
                ...state,
                linkPostings: [...state.linkPostings].concat(linkPostData),
            }
        case BULK_ADD_NEW_INTERN_POST:
            const internPostData = data.filter((post) => {
                let notExisting = true;
                state.internPostings.forEach((posting) => {
                    if (posting.id == post.id) {
                        notExisting = false
                        return
                    }
                })
                return notExisting
            })
            return {
                ...state,
                internPostings: [...state.internPostings].concat(internPostData),
            }
        case ADD_POSTER_PROFILE_DATA:
            return {
                ...state,
                postingsToEmployer: {
                    ...state.postingsToEmployer,
                    [data.postId]: data.profileData
                }
            }
        case CHANGE_POSTINGS_LOADED:
            return {
                ...state,
                postingsLoaded: data
            }
        case CHANGE_INTERN_POSTINGS_LOADED:
            return {
                ...state,
                internPostingsLoaded: data
            }
        case RESET_JOB_POSTING_DATA:
            return initialState;
        case FIRST_JOBS_FETCH:
            return {
                ...state,
                alreadyFetched: true
            }
        default:
            return state
    }
    
}
