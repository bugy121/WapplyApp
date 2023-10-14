import { LinkPostData } from './ReducerAllDataTypes'

export const UPDATE_LINK_POST_DATA = "WAPPLY/JOB/UPDATE_LINK_POST_DATA"
export const RESET_LINK_POST_DATA = "WAPPLY/JOB/RESET_LINK_POST_DATA"

export const saveLinkPostingData = (newData: LinkPostData) =>  (
    {
        type: UPDATE_LINK_POST_DATA,
        data: newData
    }
);

export const resetLinkPostingData = () => (
    {
        type: RESET_LINK_POST_DATA,
    }
);

const initialState: LinkPostData = {
    id: "",
    posterId: "",
    datePosted: "",
    latestDateBumped: "",
    address: {
        streetAddr: '',
        complementAddr: '',
        city: '',
        state: '',
        country: '',
        zip: '',
    },
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
    status: "",
    location: {
        lon: 0.0,
        lat: 0.0
    },
    geoHash: "",
    logoImgUrl: "",
    // only used for when applicant fetches job posting data, doesn't matter what we upload to cloud
    // this is how hard a job is to the applicant that fetches jobs nearby
    distanceToApplicant: 0,
    externalLink: "",
}

export function EmployerLinkPostCreationReducer(state = initialState, action) {
    const { type, data } = action
    switch (type) {
        case UPDATE_LINK_POST_DATA:
            return data
        case RESET_LINK_POST_DATA:
            return initialState
        default:
            return state
    }

}
