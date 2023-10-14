import { ApplicantProfileData } from "./ReducerAllDataTypes"
import { AppliedJob } from "./ReducerAllDataTypes"

export const UPDATE_APPLICANT_PROFILE = "LeanRecords/Applicant/Profile/UPDATE_APPLICANT_PROFILE"
export const ADD_APPLICANT_APPLIED_JOBS = "LeanRecords/Applicant/Profile/ADD_APPLICANT_APPLIED_JOBS"
export const REMOVE_APPLICANT_APPLIED_JOBS = "LeanRecords/Applicant/Profile/REMOVE_APPLICANT_APPLIED_JOBS"
export const RESET_APPLICANT_PROFILE_INFO = "LeanRecords/Applicant/Profile/RESET_APPLICANT_PROFILE_INFO"
export const UPDATE_PROFILE_IMAGE_URL = "LeanRecords/Applicant/Profile/UPDATE_PROFILE_IMAGE_URL"
export const SHOW_APPLY_JOB_ANIMATION = "LeanRecords/Applicant/Profile/SHOW_APPLY_JOB_ANIMATION"
export const UNSHOW_APPLY_JOB_ANIMATION = "LeanRecords/Applicant/Profile/UNSHOW_APPLY_JOB_ANIMATION"
export const SHOW_FIRST_LOGIN_ANIMATION = "LeanRecords/Applicant/Profile/SHOW_FIRST_LOGIN_ANIMATION"
export const UNSHOW_FIRST_LOGIN_ANIMATION = "LeanRecords/Applicant/Profile/UNSHOW_FIRST_LOGIN_ANIMATIONs"
export const UPDATE_APPLICANT_COINS = "LeanRecords/Applicant/Profile/UPDATE_APPLICANT_COINS"

export const showApplyJobAnimation=() => (
    {
        type: SHOW_APPLY_JOB_ANIMATION
    }
)

export const unshowApplyJobAnimation=() => (
    {
        type: UNSHOW_APPLY_JOB_ANIMATION
    }
)

export const unshowFirstLoginAnimation=() => (
    {
        type: UNSHOW_FIRST_LOGIN_ANIMATION
    }
)

export const showFirstLoginAnimation=() => (
    {
        type: SHOW_FIRST_LOGIN_ANIMATION
    }
)

export const updateApplicantProfileData= (newUser: ApplicantProfileData) => (
    {
        type: UPDATE_APPLICANT_PROFILE,
        data: newUser
    }
);

export const addApplicantAppliedJobs= (newApply: AppliedJob) => (
    {
        type: ADD_APPLICANT_APPLIED_JOBS,
        data: newApply
    }
);

export const removeApplicantAppliedJobs= (withdrawApp: AppliedJob) => (
    {
        type: REMOVE_APPLICANT_APPLIED_JOBS,
        data: withdrawApp
    }
);

export const resetApplicantProfileData = () =>  (
    {
        type: RESET_APPLICANT_PROFILE_INFO,
    }
);

export const updateProfileImageURL = (url :string) => (
    {
        type: UPDATE_PROFILE_IMAGE_URL,
        data: url
    }
);

export const updateApplicantCoins = (coins :int) => (
    {
        type: UPDATE_APPLICANT_COINS,
        data: coins
    }
);

const initialState = {
    profileData: {
        id: "",
        firstName: "",
        lastName: "",
        userType: "",
        email: "",
        phoneNumber: "",
        longitude: 0,
        latitude: 0,
        employmentHistory: [],
        education: "",
        educationLevel: 0,
        age: 0,
        profilePicUrl: "",
        appliedJobs: [],
        availability: {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
        },
        referralCode: "",
        referralNum: 0,
        coins: 0
    },
    applyJobAnimation: false,
    loginAnimation: false,
}

export function ApplicantProfileDataReducer(state = initialState, action) {
    const { type, data } = action
    let newData = state.profileData;
    switch (type) {
        case UPDATE_APPLICANT_PROFILE:
            return {
                ...state,
                profileData: data
            }
        case ADD_APPLICANT_APPLIED_JOBS:
            newData.appliedJobs.push(data);
            return {
                ...state,
                profileData: newData
            }
        case REMOVE_APPLICANT_APPLIED_JOBS:
            let index = 0;
            for (let j of newData.appliedJobs) {
                if (j.postId == data.postId) {
                    break;
                }
                index++;
            }
            if (index < newData.appliedJobs.length) {
                newData.appliedJobs.splice(index, 1);
            }
            return {
                ...state,
                profileData: newData
            }
        case RESET_APPLICANT_PROFILE_INFO:
            console.log("\n resetings applicant profile :))")
            return initialState
        case UPDATE_PROFILE_IMAGE_URL:
            return {
                ...state,
                profileData: {
                    ...state.profileData,
                    profilePicUrl: data
                }
            }
        case SHOW_APPLY_JOB_ANIMATION:
            return {
                ...state,
                applyJobAnimation: true
            }
        case UNSHOW_APPLY_JOB_ANIMATION:
            return {
                ...state,
                applyJobAnimation: false
            }
        case SHOW_FIRST_LOGIN_ANIMATION:
            return {
                ...state,
                loginAnimation: true
            }
        case UNSHOW_FIRST_LOGIN_ANIMATION:
            return {
                ...state,
                loginAnimation: false
            }
        case UPDATE_APPLICANT_COINS:
            return {
                ...state,
                profileData: {
                    ...state.profileData,
                    coins: data
                }
            }
        default:
            return state
    }

}
