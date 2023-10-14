
// import { EmployerProfileData } from "../store/ReducerAllDataTypes";
// import { ApplicantProfileData } from "../store/ReducerAllDataTypes";
// import { JobPostingData } from "../store/ReducerAllDataTypes";

// //Need this because JSON.stringify doesnt really work
// export function encodeEmployerProfileData(profile: EmployerProfileData) {
//     const encodedUser = {
//         "id": profile.id,
//         "name": profile.name,
//         "userType": profile.userType,
//         "email": profile.email,
//         "phoneNumber": profile.phoneNumber,
//         "location": {
//             "lon": profile.location.lon,
//             "lat": profile.location.lat
//         },
//         "businessName": profile.businessName,
//         "industry": profile.industry,
//         "jobPostIds": profile.jobPostIds,
//         "profilePicUrl": profile.profilePicUrl,
//     }
//     return encodedUser
// }

// export function decodeEmployerProfileData(profile) {
//     const decodedUser: EmployerProfileData = {
//         id: profile.id,
//         name: profile.name,
//         userType: profile.userType,
//         email: profile.email,
//         phoneNumber: profile.phoneNumber,
//         location: {
//             lon: profile.location.lon,
//             lat: profile.location.lat,
//         },
//         businessName: profile.businessName,
//         industry: profile.industry,
//         jobPostIds: profile.jobPostIds,
//         profilePicUrl: profile.profilePicUrl,
//     }
//     return decodedUser
// }

// export function encodeJobListing(post: JobPostingData) {
//     const encodedPost = {
//         "id": post.id,
//         "datePosted": post.datePosted,
//         "roleName": post.roleName,
//         "businessName": post.businessName,
//         "description": post.description,
//         "salaryRangeLow": post.salaryRangeLow,
//         "salaryRangeHigh": post.salaryRangeHigh,
//         "workHourLow": post.workHourLow,
//         "workHourHigh": post.workHourHigh,
//         "isInternship": post.isInternship,
//         "isParttime": post.isParttime,
//         "isFulltime": post.isFulltime,
//         "requiredSections": post.requiredSections,
//         "additionalQuestionTitles": post.additionalQuestionTitles,
//         "views": post.views,
//         "applicants": post.applicants,
//         "isActive": post.isActive,
//         "applicationIds": post.applicationIds
//     }
//     return encodedPost
// }

// export function decodeJobListing(post) {
//     const decodedPost: JobPostingData = {
//         id: post.id,
//         datePosted: post.datePosted,
//         roleName: post.roleName,
//         businessName: post.businessName,
//         description: post.description,
//         salaryRangeLow: post.salaryRangeLow,
//         salaryRangeHigh: post.salaryRangeHigh,
//         workHourLow: post.workHourLow,
//         workHourHigh: post.workHourHigh,
//         isInternship: post.isInternship,
//         isParttime: post.isParttime,
//         isFulltime: post.isFulltime,
//         requiredSections: post.requiredSections,
//         additionalQuestionTitles: post.additionalQuestionTitles,
//         views: post.views,
//         applicants: post.applicants,
//         isActive: post.isActive,
//         applicationIds: post.applicationIds,
//     }
//     return decodedPost
// }

// export function encodeApplicantProfileData(profile: ApplicantProfileData) {
//     const encodedUser = {
//         "id": profile.id,
//         "name": profile.name,
//         "userType": profile.userType,
//         "email": profile.email,
//         "phoneNumber": profile.phoneNumber,
//         "longitude": profile.longitude,
//         "latitude": profile.latitude,
//         "employmentHistory": profile.employmentHistory,
//         "education": profile.education,
//         "age": profile.age,
//         "profilePicUrl": profile.profilePicUrl,
//         "appliedJobs": profile.appliedJobs
//     }
//     return encodedUser
// }

// export function decodeApplicantProfileData(profile) {
//     const decodedUser: ApplicantProfileData = {
//         id: profile.id,
//         firstName: profile.firstName,
//         lastName: profile.lastName,
//         userType: profile.userType,
//         email: profile.email,
//         phoneNumber: profile.phoneNumber,
//         longitude: profile.longitude,
//         latitude: profile.latitude,
//         employmentHistory: profile.employmentHistory,
//         education: profile.education,
//         age: profile.age,
//         profilePicUrl: profile.profilePicUrl,
//         appliedJobs: profile.appliedJobs
//     }
//     return decodedUser
// }

// export function encodeJobApplicationData(application) {
//     const encodedApp = {
//         'id': application.id,
//         'name': application.name,
//         'email': application.email,
//         'phoneNumber': application.phoneNumber,
//         'longitude': application.longitude,
//         'latitude': application.latitude,
//         'employmentHistory': application.employmentHistory,
//         'education': application.education,
//         'age': application.age,
//         'profilePicUrl': application.profilePicUrl,
//         'status': application.status,
//         'additionalQuestionAnswer': application.additionalQuestionAnswer,
//     }
//     return encodedApp;
// }