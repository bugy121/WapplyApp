import { JobPostingData } from './ReducerAllDataTypes'

export const UPDATE_POSTING_DATA = "LeanRecords/Profile/UPDATE_POSTING_DATA"
export const RESET_POSTING_DATA = "LeanRecords/Profile/RESET_POSTING_DATA"

export const savePostingData = (newData: JobPostingData) =>  (
    {
        type: UPDATE_POSTING_DATA,
        data: newData
    }
);

export const resetPostingData = () => (
    {
        type: RESET_POSTING_DATA,
    }
);

const initialState: JobPostingData = {
    id: "",
    posterId: "",
    datePosted: "",
    latestDateBumped: "",
    address: "",
    roleName: "",
    roleDescription: "",
    roleBenefits:"",
    businessName: "",
    businessDescription: "",
    salaryRangeLow: 0,
    salaryRangeHigh: 0,
    workHourLow: 0,
    workHourHigh: 0,
    isInternship: false,
    isParttime: false,
    isFulltime: false,
    additionalQuestionTitles: [],
    views: 0,
    applicants: 0,
    status: "",
    applicationIds: [],
    location: {
        lon: 0.0,
        lat: 0.0
    },
    geoHash: "",
    logoImgUrl: "",
    educationLevel: 0,
    isRemote: false,
    // only used for when applicant fetches job posting data, doesn't matter what we upload to cloud
    // this is how hard a job is to the applicant that fetches jobs nearby
    distanceToApplicant: 0,
}

export function EmployerPostingCreationReducer(state = initialState, action) {
    const { type, data } = action
    switch (type) {
        case UPDATE_POSTING_DATA:
            return data
        case RESET_POSTING_DATA:
            return {
                ...initialState,
                additionalQuestionTitles: []
            };
        default:
            return state
    }

}
