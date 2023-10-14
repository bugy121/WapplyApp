import { ApplicantProfileData } from "../store/ReducerAllDataTypes";
import { EmployerProfileData } from "../store/ReducerAllDataTypes";
import { JobPostingData } from "../store/ReducerAllDataTypes";
import { JobApplicationData, ApplicationAnswerData } from "../store/ReducerAllDataTypes";

export function validateEmployerProfileData(data: EmployerProfileData) {
    if (data.industry == null || data.industry.length == 0) {
        return "Industry cannot be empty"
    }
    if (data.businessDescription == null || data.businessDescription.length == 0) {
        return "Business description cannot be empty"
    }
    if (data.businessDescription.length > 200) {
        return "Business description should be less than 200 characters"
    }
    return ""
}

export function validateApplicantProfileData(data: ApplicantProfileData) {
    if (data.education == null || data.education.length == 0) {
        return "Please fill out education"
    } else if (data.education.length > 200) {
        return "Please only enter up to 200 characters for education"
    } else if (!(parseInt(data.age))) {
        return "Please enter a valid age"
    } else if (data.age == null || data.age < 14 || data.age > 70) {
        return "Please enter your age"
    } else if (data.age < 14) {
        return "You have to be at least 14 years old to work"
    } else if (data.age > 70) {
        return "Please enter a valid age"
    } else if (!data.firstName || !data.lastName) {
        return "Please fill out your name"
    } else if (data.educationLevel == 1) {
        return "Please enter your education level"
    } else if (data.employmentHistory.length > 0) {
        data.employmentHistory.forEach((history) => {
            if (history.length > 250) {
                return "Please only enter up to 250 characters for each employment history"
            }
        })
    } 
    return ""
}

export function validateJobPostingFirstPage(data: JobPostingData) {
    if (data.roleName.length == 0) {
        return "role name cannot be empty"
    } else if (data.roleName.length < 4) {
        return "role name is too short"
    } else if (data.roleName.length > 50) {
        return "role name is too long"
    } else if (data.salaryRangeLow < 0 || data.salaryRangeLow > 150) {
        return "please enter a valid low end of salary range"
    } else if (data.salaryRangeHigh < data.salaryRangeLow) {
        return "salary range high should not be lower than salary range low"
    } else if (data.salaryRangeHigh < 0 || data.salaryRangeHigh > 150) {
        return "please enter a valid high end of salary range"
    } else if (data.workHourLow <= 0 || data.workHourLow > 60) {
        return "please enter a valid low end of work hour range"
    } else if (data.workHourHigh < data.workHourLow) {
        return "high end of work hours should not be lower than low end of work hours"
    } else if (data.workHourLow <= 0 || data.workHourLow > 60) {
        return "please enter a valid high end of work hour range"
    } else if (!data.isFulltime && !data.isInternship && !data.isParttime) {
        return "please select full-time/part-time/internship for this role"
    } 
    return ""
}

export function validateNewJobPosting(data: JobPostingData) {
    if (data.roleName.length < 3) {
        return "role name too short"
    } else if (data.roleName.length > 50) {
        return "role name too long"
    } else if (data.roleDescription.length < 10) {
        return "description has to be atleast 10 characters"
    } else if (data.roleDescription.length > 2000) {
        return "description has to be less than 2000 characters, see if you can put certain information in other fields?"
    } else if (!data.isFulltime && !data.isInternship && !data.isParttime) {
        return "please select fulltime/parttime/internship for this role"
    } else if (data.salaryRangeLow < 0 || data.salaryRangeLow > 150 || data.salaryRangeLow == NaN) {
        return "please enter a valid low end of salary range"
    } else if (data.salaryRangeHigh < data.salaryRangeLow) {
        return "salary range high should not be lower than salary range low"
    } else if (data.salaryRangeHigh < 0 || data.salaryRangeHigh > 150 || data.salaryRangeHigh == NaN) {
        return "please enter a valid high end of salary range"
    } else if (data.workHourLow <= 0 || data.workHourLow > 60 || data.workHourLow == NaN) {
        return "please enter a valid low end of work hour range"
    } else if (data.workHourHigh < data.workHourLow || data.workHourHigh == NaN) {
        return "high end of work hours should not be lower than low end of work hours"
    } else if (data.workHourLow <= 0 || data.workHourLow > 60) {
        return "please enter a valid high end of work hour range"
    } 
    // else if (data.additionalQuestionTitles.length < 1) {
    //     return "we highly recommend to ask atleast 1 free response question"} 
    else if (data.location.lat == 0 && data.location.lon == 0) {
        return "unable to get the location of job posting(please turn on location services)"
    }
    return ""
}

export function verifyJobApplicationData(data: JobApplicationData) {
    for (let i = 0; i < data.additionalQuestionAnswer.length; i++) {
        const answersData = data.additionalQuestionAnswer[i]
        if (answersData.questionType == 0) {
            // for text additional questions
            if (answersData.questionResponseText.length > 1000) {
                return "Question answers cannot be more than 1000 characters(spaces included)"
            } else if (answersData.questionResponseText.length < 1) {
                return "Question answers cannot be empty"
            }
        } else if (answersData.questionType == 1) {
            // video additional questions
            // already validated when submitting the application
            if (answersData.audioUri == null || answersData.audioUri.length == 0) {
                return `Audio response question ${i + 1} has not been answered yet, please record a response`
            }
        }

    }

    return null
}

export function verifyApplicantProfileFilled(data: ApplicantProfileData) {
    if (data.education == null || data.education.length < 10) {
        return "Education description too short or empty"
    } else if (data.employmentHistory.length == 0) {
        return "Please fill out employment history, if none put 'none'"
    }
    return null
}
