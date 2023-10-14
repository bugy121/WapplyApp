/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateEmployerProfileDataModel = /* GraphQL */ `
  subscription OnCreateEmployerProfileDataModel(
    $id: ID
    $name: String!
    $userType: String
    $email: AWSEmail!
    $phoneNumber: AWSPhone
  ) {
    onCreateEmployerProfileDataModel(
      id: $id
      name: $name
      userType: $userType
      email: $email
      phoneNumber: $phoneNumber
    ) {
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
export const onUpdateEmployerProfileDataModel = /* GraphQL */ `
  subscription OnUpdateEmployerProfileDataModel(
    $id: ID
    $name: String!
    $userType: String
    $email: AWSEmail!
    $phoneNumber: AWSPhone
  ) {
    onUpdateEmployerProfileDataModel(
      id: $id
      name: $name
      userType: $userType
      email: $email
      phoneNumber: $phoneNumber
    ) {
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
export const onDeleteEmployerProfileDataModel = /* GraphQL */ `
  subscription OnDeleteEmployerProfileDataModel(
    $id: ID
    $name: String
    $userType: String
    $email: AWSEmail
    $phoneNumber: AWSPhone
  ) {
    onDeleteEmployerProfileDataModel(
      id: $id
      name: $name
      userType: $userType
      email: $email
      phoneNumber: $phoneNumber
    ) {
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
export const onCreateJobPostingData = /* GraphQL */ `
  subscription OnCreateJobPostingData(
    $id: String
    $datePosted: String
    $roleName: String
    $description: String
    $salaryRangeLow: Int
  ) {
    onCreateJobPostingData(
      id: $id
      datePosted: $datePosted
      roleName: $roleName
      description: $description
      salaryRangeLow: $salaryRangeLow
    ) {
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
export const onUpdateJobPostingData = /* GraphQL */ `
  subscription OnUpdateJobPostingData(
    $id: String
    $datePosted: String
    $roleName: String
    $description: String
    $salaryRangeLow: Int
  ) {
    onUpdateJobPostingData(
      id: $id
      datePosted: $datePosted
      roleName: $roleName
      description: $description
      salaryRangeLow: $salaryRangeLow
    ) {
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
export const onDeleteJobPostingData = /* GraphQL */ `
  subscription OnDeleteJobPostingData(
    $id: String
    $datePosted: String
    $roleName: String
    $description: String
    $salaryRangeLow: Int
  ) {
    onDeleteJobPostingData(
      id: $id
      datePosted: $datePosted
      roleName: $roleName
      description: $description
      salaryRangeLow: $salaryRangeLow
    ) {
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
export const onCreateApplicantProfileDataModel = /* GraphQL */ `
  subscription OnCreateApplicantProfileDataModel(
    $id: ID
    $name: String
    $userType: String
    $email: AWSEmail
    $phoneNumber: AWSPhone
  ) {
    onCreateApplicantProfileDataModel(
      id: $id
      name: $name
      userType: $userType
      email: $email
      phoneNumber: $phoneNumber
    ) {
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
export const onUpdateApplicantProfileDataModel = /* GraphQL */ `
  subscription OnUpdateApplicantProfileDataModel(
    $id: ID
    $name: String
    $userType: String
    $email: AWSEmail
    $phoneNumber: AWSPhone
  ) {
    onUpdateApplicantProfileDataModel(
      id: $id
      name: $name
      userType: $userType
      email: $email
      phoneNumber: $phoneNumber
    ) {
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
export const onDeleteApplicantProfileDataModel = /* GraphQL */ `
  subscription OnDeleteApplicantProfileDataModel(
    $id: ID
    $name: String
    $userType: String
    $email: AWSEmail
    $phoneNumber: AWSPhone
  ) {
    onDeleteApplicantProfileDataModel(
      id: $id
      name: $name
      userType: $userType
      email: $email
      phoneNumber: $phoneNumber
    ) {
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
export const onCreateJobApplicationData = /* GraphQL */ `
  subscription OnCreateJobApplicationData(
    $id: ID
    $name: String
    $userType: String
    $email: String
    $phoneNumber: String
  ) {
    onCreateJobApplicationData(
      id: $id
      name: $name
      userType: $userType
      email: $email
      phoneNumber: $phoneNumber
    ) {
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
export const onUpdateJobApplicationData = /* GraphQL */ `
  subscription OnUpdateJobApplicationData(
    $id: ID
    $name: String
    $userType: String
    $email: String
    $phoneNumber: String
  ) {
    onUpdateJobApplicationData(
      id: $id
      name: $name
      userType: $userType
      email: $email
      phoneNumber: $phoneNumber
    ) {
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
export const onDeleteJobApplicationData = /* GraphQL */ `
  subscription OnDeleteJobApplicationData(
    $id: ID
    $name: String
    $userType: String
    $email: String
    $phoneNumber: String
  ) {
    onDeleteJobApplicationData(
      id: $id
      name: $name
      userType: $userType
      email: $email
      phoneNumber: $phoneNumber
    ) {
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
