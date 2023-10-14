/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getEmployerProfileDataModel = /* GraphQL */ `
  query GetEmployerProfileDataModel($id: ID!) {
    getEmployerProfileDataModel(id: $id) {
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
export const listEmployerProfileDataModels = /* GraphQL */ `
  query ListEmployerProfileDataModels(
    $filter: TableEmployerProfileDataModelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEmployerProfileDataModels(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        userType
        email
        phoneNumber
        businessName
        industry
        jobPostIds
        profilePicUrl
      }
      nextToken
    }
  }
`;
export const getJobPostingData = /* GraphQL */ `
  query GetJobPostingData($id: String!) {
    getJobPostingData(id: $id) {
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
export const listJobPostingData = /* GraphQL */ `
  query ListJobPostingData(
    $filter: TableJobPostingDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listJobPostingData(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        geoHash
      }
      nextToken
    }
  }
`;
export const getApplicantProfileDataModel = /* GraphQL */ `
  query GetApplicantProfileDataModel($id: ID!) {
    getApplicantProfileDataModel(id: $id) {
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
export const listApplicantProfileDataModels = /* GraphQL */ `
  query ListApplicantProfileDataModels(
    $filter: TableApplicantProfileDataModelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApplicantProfileDataModels(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getJobApplicationData = /* GraphQL */ `
  query GetJobApplicationData($id: ID!) {
    getJobApplicationData(id: $id) {
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
export const listJobApplicationData = /* GraphQL */ `
  query ListJobApplicationData(
    $filter: TableJobApplicationDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listJobApplicationData(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getNearestJobs = /* GraphQL */ `
  query GetNearestJobs($lon: Float, $lat: Float, $range: Float) {
    getNearestJobs(lon: $lon, lat: $lat, range: $range) {
      id
      lon
      lat
      businessName
    }
  }
`;
