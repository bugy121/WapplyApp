// class JobPostingData {
//     post: any;
//     constructor (post) {
//         this.post = post;
//     }
//     toString() {
//         return this.post;
//     }
// }

// export type AdditionalQuestionData = {
//     id: number,
//     title: string,
//     questionText: string,
//     questionType: number,
// }

// // encoding and decoding for firestore data
// export const jobPostConverter = {
//     toFirestore: (post) => {
//         return post;
//     }, 
//     fromFirestore: (snapshot, options) => {
//         const post = snapshot.data(options).post;
//         const decodedPost: JobPostingData = {
//             id: post.id,
//             datePosted: post.datePosted,
//             latestDateBumped: post.latestDateBumped != null post.latestDateBumped: post.datePosted
//             roleName: post.roleName,
//             roleDescription: post.description,
//             businessName: post.businessName,
//             businessDescription: post.businessDescription,
//             salaryRangeLow: post.salaryRangeLow,
//             salaryRangeHigh: post.salaryRangeHigh,
//             workHourLow: post.workHourLow,
//             workHourHigh: post.workHourHigh,
//             isInternship: post.isInternship,
//             isParttime: post.isParttime,
//             isFulltime: post.isFulltime,
//             requiredSections: post.requiredSections,
//             additionalQuestionTitles: post.additionalQuestionTitles,
//             views: post.views,
//             applicants: post.applicants,
//             isActive: post.isActive,
//             applicationIds: post.applicationIds,
//             location: post.location,
//             geoHash: post.geoHash
//         }
//         return new JobPostingData(decodedPost);
//     }
// }