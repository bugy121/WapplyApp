import { EmployerProfileData } from "./ReducerAllDataTypes";

export const CHANGE_PROFILE_INFO = "LeanRecords/Profile/Edit_User_Data"
export const RESET_PROFILE_INFO = "LeanRecords/Profile/RESET_EMPLOYER_PROFILE_DATA"

export const changeEmployerProfileData = (newUser: EmployerProfileData) =>  (
    {
        type: CHANGE_PROFILE_INFO,
        data: newUser
    }
);

export const resetEmployerProfileData = () =>  (
    {
        type: RESET_PROFILE_INFO,
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
        address: {
            streetAddr: "",
            complementAddr: "",
            city: "",
            state: "",
            zip: "",
            country: ""
        },
        location: {
            lon: 0,
            lat: 0,
        },
        businessName: "",
        businessDescription: "",
        industry: "",
        jobPostIds: [],
        linkPostIds: [],
        internPostIds: [],
        profilePicUrl: ""
    }
}

export function EmployerProfileDataReducer(state = initialState, action) {
    const { type, data } = action
    switch (type) {
        case CHANGE_PROFILE_INFO:
            return {
                profileData: data
            }
        case RESET_PROFILE_INFO:
            return initialState
        default:
            return state
    }

}
