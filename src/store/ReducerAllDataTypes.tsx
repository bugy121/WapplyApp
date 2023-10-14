
// ============================================ JOB POST AND APPLICATION DATA =================================================

export type JobPostingData = {
    id: string,
    posterId: string, // employer id
    datePosted: string,
    latestDateBumped: string,
    roleName: string,
    roleDescription: string,
    roleBenefits: string,
    salaryRangeLow: number,
    salaryRangeHigh: number,
    workHourLow: number,
    workHourHigh: number,
    isInternship: boolean,
    isParttime: boolean,
    isFulltime: boolean,
    additionalQuestionTitles: string[],
    views: number,
    applicants: number,
    status: string,
    applicationIds: string[],
    logoImgUrl: string,    
    address: string,
    location: Location,
    geoHash: string,
    businessDescription: string,
    businessName: string,
    educationLevel: number,
    isRemote: boolean,

    //only used for when applicant fetches job posting data, doesn't matter what we upload to cloud
    //this is how hard a job is to the applicant that fetches jobs nearby
    distanceToApplicant: number,
}

export type LinkPostData = {
    id: string,
    posterId: string, // employer id
    datePosted: string,
    latestDateBumped: string,
    roleName: string,
    roleDescription: string,
    roleBenefits: string,
    salaryRangeLow: number,
    salaryRangeHigh: number,
    workHourLow: number,
    workHourHigh: number,
    isInternship: boolean,
    isParttime: boolean,
    isFulltime: boolean,
    logoImgUrl: string,    
    address: {
        streetAddr: string,
        complementAddr: string,
        city: string,
        state: string,
        zip: string,
        country: string
    },
    status: string,
    location: Location,
    geoHash: string,
    businessDescription: string,
    businessName: string,
    distanceToApplicant: number,
    externalLink: string,
}

export type AdditionalQuestionData = {
    id: number,
    questionText: string,
    questionType: number,
}
export type Location = {
    lon: number,
    lat: number
}

export type JobApplicationData = {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    longitude: number,
    latitude: number,
    employmentHistory: string[],
    education: string,
    age: number,
    profilePicUrl: string,
    status: string,
    additionalQuestionAnswer: ApplicationAnswerData[],
    dateApplied: string,
    availability: {
        monday: string[],
        tuesday: string[],
        wednesday: string[],
        thursday: string[],
        friday: string[],
        saturday: string[],
        sunday: string[],
    }
}
export type ApplicationAnswerData = {
    questionResponseText: string,
    questionType: number, // 0 - text; 1 - audio
    recordLocation: string | null | undefined,
    duration: string,
    playTime: string,
    audioUri: string | null,
    audioDownloadURL: string | null,
    questionTitle: string | null,
}

export type AppliedJob = {
    postId: string, 
    appId: string
}

// ============================================ APPLICANT DATA =================================================

//This should be synced with reducer initial state, currently we aren't doing it but 
// eventually we should - Felix
export type ApplicantProfileData = {
    id: string,
    firstName: string,
    lastName: string,
    userType: string,
    email: string,
    phoneNumber: string,
    longitude: number,
    latitude: number,
    employmentHistory: string[],
    education: string,
    educationLevel: number,
    age: number,
    profilePicUrl: string,
    appliedJobs: string[],
    availability: {
        monday: string[],
        tuesday: string[],
        wednesday: string[],
        thursday: string[],
        friday: string[],
        saturday: string[],
        sunday: string[],
    },
    referralCode: string,
    referralNum: number,
    coins: number
}

// ============================================ EMPLOYER DATA =================================================

export type EmployerProfileData = {
    id: string,
    firstName: string,
    lastName: string,
    userType: string,
    email: string,
    phoneNumber: string,
    address: {
        streetAddr: string,
        complementAddr: string,
        city: string,
        state: string,
        zip: string,
        country: string
    },
    location: {
        lon: number,
        lat: number,
    },
    businessName: string,
    businessDescription: string,
    industry: string,
    jobPostIds: string[],
    linkPostIds: string[],
    internPostIds: string[],
    profilePicUrl: string,
}