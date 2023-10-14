/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createEmployerProfileDataModel = /* GraphQL */ `
  mutation CreateEmployerProfileDataModel(
    $input: CreateEmployerProfileDataModelInput!
  ) {
    createEmployerProfileDataModel(input: $input) {
      id
      name
      userType
      email
      phoneNumber
      location {
        lon
        lat
      }
      businessName
      industry
      jobPostIds
      profilePicUrl
    }
  }
`;
export const updateEmployerProfileDataModel = /* GraphQL */ `
  mutation UpdateEmployerProfileDataModel(
    $input: UpdateEmployerProfileDataModelInput!
  ) {
    updateEmployerProfileDataModel(input: $input) {
      id
      name
      userType
      email
      phoneNumber
      location {
        lon
        lat
      }
      businessName
      industry
      jobPostIds
      profilePicUrl
    }
  }
`;
export const deleteEmployerProfileDataModel = /* GraphQL */ `
  mutation DeleteEmployerProfileDataModel(
    $input: DeleteEmployerProfileDataModelInput!
  ) {
    deleteEmployerProfileDataModel(input: $input) {
      id
      name
      userType
      email
      phoneNumber
      location {
        lon
        lat
      }
      businessName
      industry
      jobPostIds
      profilePicUrl
    }
  }
`;
export const createJobPostingData = /* GraphQL */ `
  mutation CreateJobPostingData($input: CreateJobPostingDataInput!) {
    createJobPostingData(input: $input) {
      id
      datePosted
      roleName
      businessName
      description
      salaryRangeLow
      salaryRangeHigh
      workHourLow
      workHourHigh
      isInternship
      isParttime
      isFulltime
      requiredSections
      additionalQuestionTitles
      views
      applicants
      isActive
      applicationIds
      location {
        lon
        lat
      }
      geoHash
    }
  }
`;
export const updateJobPostingData = /* GraphQL */ `
  mutation UpdateJobPostingData($input: UpdateJobPostingDataInput!) {
    updateJobPostingData(input: $input) {
      id
      datePosted
      roleName
      businessName
      description
      salaryRangeLow
      salaryRangeHigh
      workHourLow
      workHourHigh
      isInternship
      isParttime
      isFulltime
      requiredSections
      additionalQuestionTitles
      views
      applicants
      isActive
      applicationIds
      location {
        lon
        lat
      }
      geoHash
    }
  }
`;
export const deleteJobPostingData = /* GraphQL */ `
  mutation DeleteJobPostingData($input: DeleteJobPostingDataInput!) {
    deleteJobPostingData(input: $input) {
      id
      datePosted
      roleName
      businessName
      description
      salaryRangeLow
      salaryRangeHigh
      workHourLow
      workHourHigh
      isInternship
      isParttime
      isFulltime
      requiredSections
      additionalQuestionTitles
      views
      applicants
      isActive
      applicationIds
      location {
        lon
        lat
      }
      geoHash
    }
  }
`;
export const createApplicantProfileDataModel = /* GraphQL */ `
  mutation CreateApplicantProfileDataModel(
    $input: CreateApplicantProfileDataModelInput!
  ) {
    createApplicantProfileDataModel(input: $input) {
      id
      name
      userType
      email
      phoneNumber
      longitude
      latitude
      employmentHistory
      education
      age
      profilePicUrl
      appliedJobs
    }
  }
`;
export const updateApplicantProfileDataModel = /* GraphQL */ `
  mutation UpdateApplicantProfileDataModel(
    $input: UpdateApplicantProfileDataModelInput!
  ) {
    updateApplicantProfileDataModel(input: $input) {
      id
      name
      userType
      email
      phoneNumber
      longitude
      latitude
      employmentHistory
      education
      age
      profilePicUrl
      appliedJobs
    }
  }
`;
export const deleteApplicantProfileDataModel = /* GraphQL */ `
  mutation DeleteApplicantProfileDataModel(
    $input: DeleteApplicantProfileDataModelInput!
  ) {
    deleteApplicantProfileDataModel(input: $input) {
      id
      name
      userType
      email
      phoneNumber
      longitude
      latitude
      employmentHistory
      education
      age
      profilePicUrl
      appliedJobs
    }
  }
`;
export const createJobApplicationData = /* GraphQL */ `
  mutation CreateJobApplicationData($input: CreateJobApplicationDataInput!) {
    createJobApplicationData(input: $input) {
      id
      name
      email
      phoneNumber
      longitude
      latitude
      employmentHistory
      education
      age
      profilePicUrl
      status
      additionalQuestionAnswer
    }
  }
`;
export const updateJobApplicationData = /* GraphQL */ `
  mutation UpdateJobApplicationData($input: UpdateJobApplicationDataInput!) {
    updateJobApplicationData(input: $input) {
      id
      name
      email
      phoneNumber
      longitude
      latitude
      employmentHistory
      education
      age
      profilePicUrl
      status
      additionalQuestionAnswer
    }
  }
`;
export const deleteJobApplicationData = /* GraphQL */ `
  mutation DeleteJobApplicationData($input: DeleteJobApplicationDataInput!) {
    deleteJobApplicationData(input: $input) {
      id
      name
      email
      phoneNumber
      longitude
      latitude
      employmentHistory
      education
      age
      profilePicUrl
      status
      additionalQuestionAnswer
    }
  }
`;
export const createJobPostSearchData = /* GraphQL */ `
  mutation CreateJobPostSearchData($input: JobPostSearchInput!) {
    createJobPostSearchData(input: $input) {
      id
      lon
      lat
      businessName
    }
  }
`;
