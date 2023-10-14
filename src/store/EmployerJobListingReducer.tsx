import { JobPostingData, LinkPostData } from './ReducerAllDataTypes';

export const ADD_JOB_TEMPLATE = "LeanRecords/employer/job/NEW_JOB_POSTING"
export const BULK_ADD_JOB_TEMPLATE = "LeanRecords/employer/job/BULK_NEW_JOB_POSTING"
export const BULK_ADD_JOB_TEMPLATE_DISTANCE = "LeanRecords/employer/job/BULK_NEW_JOB_POSTING_DISTANCE"
export const BULK_ADD_LINK_POST = "LeanRecords/employer/job/BULK_ADD_LINK_POST"
export const BULK_ADD_INTERN_POST = "LeanRecords/employer/job/BULK_ADD_INTERN_POST"
export const DELETE_JOB_TEMPLATE = "LeanRecords/employer/job/DELETE_JOB_POSTING"
export const DELETE_LINK_POSTING = "LeanRecords/employer/job/DELETE_LINK_POSTING"
export const DELETE_INTERN_POSTING = "LeanRecords/employer/job/DELETE_INTERN_POSTING"
export const ADD_POST_ID_TO_APPLICATIONS = "LeanRecords/employer/job/ADD_POST_ID_TO_APPLICATION"
export const ADD_POST_ID_APPLICATION_IDS = "LeanRecords/employer/job/ADD_POST_ID_APPLICATION_IDS"
export const CHANGE_POSTINGS_LOADED = "LeanRecords/employer/job/CHANGE_POSTINGS_LOADED"
export const DEACTIVATE_POSTING = "LeanRecords/employer/job/DEACTIVATE_POSTING"
export const DELETE_POSTING = "LeanRecords/employer/job/DELETE_POSTING"
export const RESET_JOB_POSTING_DATA = "LeanRecords/employer/job/RESET_JOB_POSTING_DATA"
export const UPDATE_APPLICATION_DATA = "LeanRecords/employer/job/UPDATE_APPLICATION_DATA"
export const BUMP_JOB_POST = "LeanRecords/employer/job/BUMP_JOB_POST"
export const UPDATE_JOB_POST_INFO = "LeanRecords/employer/job/UPDATE_JOB_POST_INFO"

export const addNewJobPosting = (newPost: JobPostingData) => {
    return {
        type: ADD_JOB_TEMPLATE,
        data: newPost
    }
};

export const updateJobPostingData = (newPost: JobPostingData) => {
    return {
        type: UPDATE_JOB_POST_INFO,
        data: newPost
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

export const bulkAddLinkPost = ( newPost: [LinkPostData]) => {
    return {
        type: BULK_ADD_LINK_POST,
        data: newPost
    }
}

export const bulkAddInternPost = ( newPost: [JobPostingData]) => {
    return {
        type: BULK_ADD_INTERN_POST,
        data: newPost
    }
}

export const deleteJobPosting = (postId: string) => {
    console.log("delete a job post on reducer")
    return {
        type: DELETE_JOB_TEMPLATE,
        data: postId
    }
};

export const addApplicationData = (postId: string, applications) => {
    return {
        type: ADD_POST_ID_TO_APPLICATIONS,
        data: {
            postId: postId,
            applications: applications
        }
    }
}

export const addPostApplicationIdMapping = (postId: string, applicationIds: [string]) => {
    return {
        type: ADD_POST_ID_APPLICATION_IDS,
        data: {
            postId: postId,
            applicationIds: applicationIds
        }
    }
}

export const changePostingsLoaded = (loaded: boolean) => {
    return {
        type: ADD_POST_ID_APPLICATION_IDS,
        data: loaded
    }
}

export const deactivatePosting = (postId: string) => {
    return {
        type: DEACTIVATE_POSTING,
        data: postId
    }
}

export const bumpJobPosting = (postId: string, bumpedDate: string) => {
    return {
        type: BUMP_JOB_POST,
        data: {
            postId: postId,
            bumpedDate: bumpedDate
        }
    }
}

export const deletePosting = (postId: string) => {
    return {
        type: DELETE_POSTING,
        data: postId
    }
}

export const deleteLinkPosting = (postId: string) => {
    return {
        type: DELETE_LINK_POSTING,
        data: postId
    }
}

export const deleteInternPosting = (postId: string) => {
    return {
        type: DELETE_INTERN_POSTING,
        data: postId
    }
}

export const resetJobListingReducer = () => {
    return {
        type: RESET_JOB_POSTING_DATA,
    }
}

export const updateApplicationData = (postId: string, newApplicationData) => {
    return {
        type: UPDATE_APPLICATION_DATA,
        data: {
            postId: postId,
            newApplicationData: newApplicationData
        }
    }
}

const initialState = {
    // post id: [application id1, application id2, ...]
    postingIdsToApplicationIds: {},
    // posting id : JobPostData
    postingIdsToApplications: {},
    // all postings data (posted by current user)
    postings: [],
    // all link posts (posted by current user)
    linkPostings: [],
    // all internship posts (posted by current user)
    internPostings: [],
    // This is used to see if postings are loaded or not in useEffects
    postingsLoaded: false,
    // this contains all applications loaded so we don't reload when we don't need to
    postApplicationsLoaded: new Set(),
    // contains all postings in the ascending order of distance to applicants
    postingsInDistanceOrder: [],
};

export function EmployerJobListingReducer(state = initialState, action) {

    const { type, data } = action

    switch (type) {
        case ADD_JOB_TEMPLATE:
            return {
                ...state,
                postings: [...state.postings, data]
            }
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
        case BULK_ADD_LINK_POST:
            const newPosts = data.filter((post) => {
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
                linkPostings: [...state.linkPostings].concat(newPosts),
            }
        case BULK_ADD_INTERN_POST:
            const internPosts = data.filter((post) => {
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
                internPostings: [...state.internPostings].concat(internPosts),
            }
        case DELETE_JOB_TEMPLATE:
            return {
                ...state,
                postings: state.postings.filter(function(posting){
                     return posting.id != data
                    })
            }
        case ADD_POST_ID_TO_APPLICATIONS:
            state.postApplicationsLoaded.add(data.postId)
            return {
                ...state,
                postingIdsToApplications: {
                    ...state.postingIdsToApplications,
                    [data.postId]: data.applications
                }
            }
        case ADD_POST_ID_APPLICATION_IDS:
            return {
                ...state,
                postingIdsToApplicationIds: {
                    ...state.postingIdsToApplicationIds,
                    [data.postId]: data.applicationIds
                }
            }
        case UPDATE_APPLICATION_DATA:
            return {
                ...state,
                postingIdsToApplications: {
                    ...state.postingIdsToApplications,
                    [data.postId]: data.newApplicationData
                }
            }
        case CHANGE_POSTINGS_LOADED:
            return {
                ...state,
                postingsLoaded: data
            }
        case DELETE_POSTING:
            // dont do anything because we change data in
            const filteredPostings = state.postings.filter((postData) => {
                return postData.id != data
            })
            return {
                ...state,
                postings: filteredPostings
            }
        case DELETE_LINK_POSTING:
            const filteredLinkPostings = state.linkPostings.filter((postData) => {
                return postData.id != data
            })
            return {
                ...state,
                linkPostings: filteredLinkPostings
            }
        case DELETE_LINK_POSTING:
            const filteredInternPostings = state.internPostings.filter((postData) => {
                return postData.id != data
            })
            return {
                ...state,
                internPostings: filteredInternPostings
            }
        case BUMP_JOB_POST:
            const updatedPostings = state.postings.map((postData) => {
                if (data.postId == postData.id) {
                    postData.latestDateBumped = data.bumpedDate
                }
                return postData
            })
            return {
                ...state,
                postings: updatedPostings
            }
        case UPDATE_JOB_POST_INFO:
            const updatedPostingList = state.postings.map((postData) => {
                if (data.id == postData.id) {
                    return data
                }
                return postData
            })
            return {
                ...state,
                postings: updatedPostingList
            }
        case RESET_JOB_POSTING_DATA:
            initialState.postApplicationsLoaded = new Set()
            return initialState;
        default:
            return state
    }

}
