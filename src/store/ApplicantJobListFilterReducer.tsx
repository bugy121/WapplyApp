import { JS } from "aws-amplify"


export const CHANGE_SALARY_RANGE_LOW = "LeanRecords/Applicant/job/filter/CHANGE_SALARY_RANGE_LOW"
export const CHANGE_SALARY_RANGE_HIGH = "LeanRecords/Applicant/job/filter/CHANGE_SALARY_RANGE_HIGH"
export const SET_PART_TIME_TOGGLE = "LeanRecords/Applicant/job/filter/SET_PART_TIME_TOGGLE"
export const SET_FULL_TIME_TOGGLE = "LeanRecords/Applicant/job/filter/SET_FULL_TIME_TOGGLE"
export const SET_INTERNSHIP_TOGGLE = "LeanRecords/Applicant/job/filter/SET_INTERNSHIP_TOGGLE"
export const SET_INPERSON_TOGGLE = "LeanRecords/Applicant/job/filter/SET_INPERSON_TOGGLE"
export const SET_REMOTE_TOGGLE = "LeanRecords/Applicant/job/filter/SET_REMOTE_TOGGLE"
export const RESET_ALL_FILTERS = "LeanRecords/Applicant/job/filter/RESET_ALL_FILTERS"

export function filterJobs(jobList, filter) {
    if (jobList == null) {
        return null;
    }
    jobList = jobList.filter((job) => {
        if (filter.partTimeToggled && job.isParttime) {
            return true
        }
        else if (filter.fullTimeToggled && job.isFulltime) {
            return true
        }
        else if (filter.internshipToggled && job.isInternship) {
            return true
        } else {
            return false
        }
    })
    jobList = jobList.filter((job) => {
        if (job.salaryRangeLow >= filter.salaryRangeLow && job.salaryRangeLow <= filter.salaryRangeHigh) {
            return true
        } else if (job.salaryRangeHigh <= filter.salaryRangeHigh && job.salaryRangeHigh >= filter.salaryRangeLow) {
            return true
        }
        return false
    })
    jobList = jobList.filter((job) => {
        if (job.status && (job.status ==  "DELETED" || job.status == "DEACTIVATED")) {
            return false
        } 
        return true
    })
    jobList = jobList.filter((job) => {
        if ((job.isRemote && !filter.remoteToggled) || (!job.isRemote && !filter.inpersonToggled)) {
            return false
        } 
        return true
    })
    return jobList
}

export const changeSalaryRangeLow = (val: number) => {
    return {
        type: CHANGE_SALARY_RANGE_LOW,
        data: val
    }
}

export const changeSalaryRangeHigh = (val: number) => {
    return {
        type: CHANGE_SALARY_RANGE_HIGH,
        data: val
    }
}
export const resetAllFilters = () => {
    return {
        type: RESET_ALL_FILTERS,
        data: null
    }
}

export const setFulltimeToggle = (val: boolean) => {
    return {
        type: SET_FULL_TIME_TOGGLE,
        data: val
    }
}

export const setParttimeToggle = (val: boolean) => {
    return {
        type: SET_PART_TIME_TOGGLE,
        data: val
    }
}

export const setInternshipToggle = (val: boolean) => {
    return {
        type: SET_INTERNSHIP_TOGGLE,
        data: val
    }
}

export const setInpersonToggle = (val: boolean) => {
    return {
        type: SET_INPERSON_TOGGLE,
        data: val
    }
}

export const setRemoteToggle = (val: boolean) => {
    return {
        type: SET_REMOTE_TOGGLE,
        data: val
    }
}

const initialState = {
    salaryRangeLow: 0,
    salaryRangeHigh: 999,
    partTimeToggled: true,
    fullTimeToggled: true,
    internshipToggled: true,
    inpersonToggled: true,
    remoteToggled: true,
};

export function ApplicantJobListFilterReducer(state = initialState, action) {
    
    const { type, data } = action

    switch (type) {
        case SET_FULL_TIME_TOGGLE:
            return {
                ...state,
                fullTimeToggled: data
            }
        case SET_PART_TIME_TOGGLE:
            return {
                ...state,
                partTimeToggled: data
            }
        case SET_INTERNSHIP_TOGGLE:
            return {
                ...state,
                internshipToggled: data
            }
        case SET_INPERSON_TOGGLE:
            return {
                ...state,
                inpersonToggle: data
            }
        case SET_REMOTE_TOGGLE: 
            return {
                ...state,
                remoteToggle: data
            }
        case CHANGE_SALARY_RANGE_LOW:
            return {
                ...state,
                salaryRangeLow: data
            }
        case CHANGE_SALARY_RANGE_HIGH:
            return {
                ...state,
                salaryRangeHigh: data
            }
        case RESET_ALL_FILTERS:
            return {
                salaryRangeLow: 0,
                salaryRangeHigh: 999,
                partTimeToggled: true,
                fullTimeToggled: true,
                internshipToggled: true,
                inpersonToggled: true,
                remoteToggled: true,
            }
        default:
            return state
    }
    
}
