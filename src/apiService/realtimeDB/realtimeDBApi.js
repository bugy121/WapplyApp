// import { getDatabase, set } from "firebase/database";
// import database from '@react-native-firebase/database';
import { getDatabase, ref, onValue, set } from 'firebase/database';

const db = getDatabase();

/******************           General API           ******************/

// add user object to realtime db with index userId
export function addUserAPI(userId, data, userType) {
  const reference = ref(db, 'users/' + userId);
  set(reference, {
    email: data.email,
    profileImageUrl: data.photoURL,
    displayName: data.displayName,
    phoneNumber: data.phoneNumber,
    userId: data.uid,
    userType: userType,
  }).then(
    console.log('Add new user successfully!')
  );
}

export function addEmployerUserAPI(userId, profile, callback) {
  const reference = ref(db, 'users/' + 'employers/' + userId);
  profile.id = userId;
  set(reference, profile).then(
    // console.log('Add new employer successfully!')
    callback()
  );
}

export function addApplicantUserAPI(userId, profile) {
  const reference = ref(db, 'users/' + 'applicants/' + userId);
  set(reference, profile).then(
    console.log('Add new applicant successfully!')
  );
}

// retrieve user information
export function retrieveUserAPI (userId, callback) {
  const employerRef = ref(db, 'users/' + 'employers/' + userId);
  const applicantRef = ref(db, 'users/' + 'applicants/' + userId);
  var userInfo;

  onValue(employerRef, (snapshot) => {
      userInfo = snapshot.val();
      if (userInfo) {
        callback(userInfo)
      }
  });

  onValue(applicantRef, (snapshot) => {
    userInfo = snapshot.val();
    if (userInfo) {
      callback(userInfo)
    }
});
}

// retrieve all job posts in database
export function retrieveJobPostAPI (callback) {
  const reference = ref(db, 'jobPosts/');
  var jobPosts;

  onValue(reference, (snapshot) => {
    jobPosts = snapshot.val();
    if (callback) {
      callback(jobPosts);
    }
  });
  return jobPosts;
}

// retrieve job posts object for a user
export function retrieveUserJobPostAPI (userId, callback) {
  var jobIdList = [];
  var jobPostList = [];

  const pushJobPosts = (jobPosts) => {
    if (jobIdList && jobPosts) {
      for (let id of jobIdList) {
        if (jobPosts[id]) {
          jobPostList.push(jobPosts[id]);
        }
      }
    }
    callback(jobPostList)
  }

  const pushJobIds = (jobIds) => {
    jobIdList = jobIds
    retrieveJobPostAPI(pushJobPosts);
  }

  retrieveJobPostedIdAPI(userId, pushJobIds)
  // || retrieveJobAppliedIdAPI(userId, pushJobIds)
}

/******************           Employer API Start           ******************/

// Add job id in user struct and add job post object in database
export function addNewJobPostAPI(userId, data) {
  const userRef = ref(db, 'users/employers/' + userId + '/jobPostedList/');
  let jobIds = retrieveJobPostedIdAPI(userId);

  if (!jobIds) {
    jobIds = [];
  }

  if (!jobIds.includes(data.id)) {
    jobIds.push(data.id);
  }

  set(userRef, jobIds)
  .then(
    console.log('Add new job id successfully!')
  );

  const postRef = ref(db, 'jobPosts/' + data.id);
  set(postRef, {
    id: data.id,
    location: "berkeley",
    businessName: data.businessName,
    datePosted: data.datePosted,
    roleName: data.roleName,
    description: data.description,
    salaryRangeLow: data.salaryRangeLow,
    salaryRangeHigh: data.salaryRangeHigh,
    workHourLow: data.workHourLow,
    workHourHigh: data.workHourHigh,
    isInternship: data.isInternship,
    isParttime: data.isParttime,
    isFulltime: data.isFulltime,
    requiredSections: data.requiredSections,
    additionalQuestionTitles: data.additionalQuestionTitles,
    views: data.views,
    applicants: data.applicants,
    status: data.status,
  })
  .then(
    console.log('Add new job post successfully!')
  );
}

// retrieve job post id for a user
export function retrieveJobPostedIdAPI (userId, callback) {
  const reference = ref(db, 'users/employers/' + userId + '/jobPostedList/');
  var jobIds;
  
  onValue(reference, (snapshot) => {
    jobIds = snapshot.val();
    if (callback) {
      callback(jobIds);
    }
  });

  return jobIds;
}

// delete job post
export function deleteJobPostAPI (userId, postId) {
  const userRef = ref(db, 'users/employers/' + userId + '/jobPostedList/');
  const postRef = ref(db, 'jobPosts/');

  // user data
  const jobIds = retrieveJobPostedIdAPI(userId);
  const rmJobIds = jobIds.filter(function(e) { return e !== postId })
  if (rmJobIds) {
    set(userRef, rmJobIds)
    .then(
      console.log('Remove job id successfully!')
    );
  }
  
  // post data
  const jobPosts = retrieveJobPostAPI();
  const rmJobPosts = Object()
  if (Object.keys(jobPosts)) {
    for (let k of Object.keys(jobPosts)) {              
      if (k != postId) {
        rmJobPosts[k] = jobPosts[k]
      }
    }
  }
  if (rmJobPosts) {
    set(postRef, rmJobPosts)
    .then(
      console.log('Remove job post successfully!')
    );
  }
}

/******************           Employer API End            ******************/

/******************           Applicant API Start           ******************/

// Add applied job post id in user struct
export function addNewJobAppliedAPI(userId, postId) {
  const reference = ref(db, 'users/applicants/' + userId + '/jobAppliedList/');
  let jobIds = retrieveJobAppliedIdAPI(userId);

  if (!jobIds) {
    jobIds = [];
  }

  if (!jobIds.includes(postId)) {
    jobIds.push(postId);
  }

  set(reference, jobIds)
  .then(
    console.log('Add new job id successfully!')
  );
}

// retrieve job applied id for a user
export function retrieveJobAppliedIdAPI (userId) {
  const reference = ref(db, 'users/applicants/' + userId + '/jobAppliedList/');
  var jobIds;

  onValue(reference, (snapshot) => {
    jobIds = snapshot.val();
  });
  return jobIds;
}

/******************           Applicant API End           ******************/
