/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateEmployerProfileDataModelInput = {
  id?: string | null,
  name: string,
  userType?: string | null,
  email: string,
  phoneNumber?: string | null,
  location?: LocationInput | null,
  businessName?: string | null,
  industry?: string | null,
  jobPostIds?: Array< string | null > | null,
  profilePicUrl?: string | null,
};

export type LocationInput = {
  lon?: number | null,
  lat?: number | null,
};

export type EmployerProfileDataModel = {
  __typename: "EmployerProfileDataModel",
  id: string,
  name: string,
  userType?: string | null,
  email: string,
  phoneNumber?: string | null,
  location?: Location | null,
  businessName?: string | null,
  industry?: string | null,
  jobPostIds?: Array< string | null > | null,
  profilePicUrl?: string | null,
};

export type Location = {
  __typename: "Location",
  lon?: number | null,
  lat?: number | null,
};

export type UpdateEmployerProfileDataModelInput = {
  id?: string | null,
  name: string,
  userType?: string | null,
  email: string,
  phoneNumber?: string | null,
  location?: LocationInput | null,
  businessName?: string | null,
  industry?: string | null,
  jobPostIds?: Array< string | null > | null,
  profilePicUrl?: string | null,
};

export type DeleteEmployerProfileDataModelInput = {
  id: string,
};

export type CreateJobPostingDataInput = {
  id?: string | null,
  datePosted?: string | null,
  roleName?: string | null,
  businessName?: string | null,
  description?: string | null,
  salaryRangeLow?: number | null,
  salaryRangeHigh?: number | null,
  workHourLow?: number | null,
  workHourHigh?: number | null,
  isInternship?: boolean | null,
  isParttime?: boolean | null,
  isFulltime?: boolean | null,
  requiredSections?: Array< number | null > | null,
  additionalQuestionTitles?: Array< string | null > | null,
  views?: number | null,
  applicants?: number | null,
  isActive?: boolean | null,
  applicationIds?: Array< string | null > | null,
  location?: LocationInput | null,
  geoHash?: string | null,
};

export type JobPostingData = {
  __typename: "JobPostingData",
  id?: string | null,
  datePosted?: string | null,
  roleName?: string | null,
  businessName?: string | null,
  description?: string | null,
  salaryRangeLow?: number | null,
  salaryRangeHigh?: number | null,
  workHourLow?: number | null,
  workHourHigh?: number | null,
  isInternship?: boolean | null,
  isParttime?: boolean | null,
  isFulltime?: boolean | null,
  requiredSections?: Array< number | null > | null,
  additionalQuestionTitles?: Array< string | null > | null,
  views?: number | null,
  applicants?: number | null,
  isActive?: boolean | null,
  applicationIds?: Array< string | null > | null,
  location?: Location | null,
  geoHash?: string | null,
};

export type UpdateJobPostingDataInput = {
  id: string,
  datePosted?: string | null,
  roleName?: string | null,
  businessName?: string | null,
  description?: string | null,
  salaryRangeLow?: number | null,
  salaryRangeHigh?: number | null,
  workHourLow?: number | null,
  workHourHigh?: number | null,
  isInternship?: boolean | null,
  isParttime?: boolean | null,
  isFulltime?: boolean | null,
  requiredSections?: Array< number | null > | null,
  additionalQuestionTitles?: Array< string | null > | null,
  views?: number | null,
  applicants?: number | null,
  isActive?: boolean | null,
  applicationIds?: Array< string | null > | null,
  geoHash?: string | null,
};

export type DeleteJobPostingDataInput = {
  id: string,
};

export type CreateApplicantProfileDataModelInput = {
  id?: string | null,
  name?: string | null,
  userType?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
  longitude?: number | null,
  latitude?: number | null,
  employmentHistory?: Array< string | null > | null,
  education?: string | null,
  age?: number | null,
  profilePicUrl?: string | null,
  appliedJobs?: Array< string | null > | null,
};

export type ApplicantProfileDataModel = {
  __typename: "ApplicantProfileDataModel",
  id?: string | null,
  name?: string | null,
  userType?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
  longitude?: number | null,
  latitude?: number | null,
  employmentHistory?: Array< string | null > | null,
  education?: string | null,
  age?: number | null,
  profilePicUrl?: string | null,
  appliedJobs?: Array< string | null > | null,
};

export type UpdateApplicantProfileDataModelInput = {
  id: string,
  name?: string | null,
  userType?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
  longitude?: number | null,
  latitude?: number | null,
  employmentHistory?: Array< string | null > | null,
  education?: string | null,
  age?: number | null,
  profilePicUrl?: string | null,
  appliedJobs?: Array< string | null > | null,
};

export type DeleteApplicantProfileDataModelInput = {
  id: string,
};

export type CreateJobApplicationDataInput = {
  id?: string | null,
  name?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
  longitude?: number | null,
  latitude?: number | null,
  employmentHistory?: Array< string | null > | null,
  education?: string | null,
  age?: number | null,
  profilePicUrl?: string | null,
  status?: string | null,
  additionalQuestionAnswer?: Array< string | null > | null,
};

export type JobApplicationData = {
  __typename: "JobApplicationData",
  id?: string | null,
  name?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
  longitude?: number | null,
  latitude?: number | null,
  employmentHistory?: Array< string | null > | null,
  education?: string | null,
  age?: number | null,
  profilePicUrl?: string | null,
  status?: string | null,
  additionalQuestionAnswer?: Array< string | null > | null,
};

export type UpdateJobApplicationDataInput = {
  id: string,
  name?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
  longitude?: number | null,
  latitude?: number | null,
  employmentHistory?: Array< string | null > | null,
  education?: string | null,
  age?: number | null,
  profilePicUrl?: string | null,
  status?: string | null,
  additionalQuestionAnswer?: Array< string | null > | null,
};

export type DeleteJobApplicationDataInput = {
  id: string,
};

export type JobPostSearchInput = {
  id?: string | null,
  lon?: number | null,
  lat?: number | null,
  businessName?: string | null,
};

export type JobPostSearchDataModel = {
  __typename: "JobPostSearchDataModel",
  id?: string | null,
  lon?: number | null,
  lat?: number | null,
  businessName?: string | null,
};

export type TableEmployerProfileDataModelFilterInput = {
  id?: string | null,
  name: string,
  userType?: string | null,
  email: string,
  phoneNumber?: string | null,
  location?: LocationInput | null,
  businessName?: string | null,
  industry?: string | null,
  jobPostIds?: Array< string | null > | null,
  profilePicUrl?: string | null,
};

export type EmployerProfileDataModelConnection = {
  __typename: "EmployerProfileDataModelConnection",
  items?:  Array<EmployerProfileDataModel | null > | null,
  nextToken?: string | null,
};

export type TableJobPostingDataFilterInput = {
  id?: TableStringFilterInput | null,
  datePosted?: TableStringFilterInput | null,
  roleName?: TableStringFilterInput | null,
  businessName?: TableStringFilterInput | null,
  description?: TableStringFilterInput | null,
  salaryRangeLow?: TableIntFilterInput | null,
  salaryRangeHigh?: TableIntFilterInput | null,
  workHourLow?: TableIntFilterInput | null,
  workHourHigh?: TableIntFilterInput | null,
  isInternship?: TableBooleanFilterInput | null,
  isParttime?: TableBooleanFilterInput | null,
  isFulltime?: TableBooleanFilterInput | null,
  requiredSections?: TableIntFilterInput | null,
  additionalQuestionTitles?: TableStringFilterInput | null,
  views?: TableIntFilterInput | null,
  applicants?: TableIntFilterInput | null,
  isActive?: TableBooleanFilterInput | null,
  applicationIds?: TableStringFilterInput | null,
  geoHash?: TableStringFilterInput | null,
};

export type TableStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type TableIntFilterInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  contains?: number | null,
  notContains?: number | null,
  between?: Array< number | null > | null,
};

export type TableBooleanFilterInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type JobPostingDataConnection = {
  __typename: "JobPostingDataConnection",
  items?:  Array<JobPostingData | null > | null,
  nextToken?: string | null,
};

export type TableApplicantProfileDataModelFilterInput = {
  id?: TableIDFilterInput | null,
  name?: TableStringFilterInput | null,
  userType?: TableStringFilterInput | null,
  email?: TableStringFilterInput | null,
  phoneNumber?: TableStringFilterInput | null,
  longitude?: TableFloatFilterInput | null,
  latitude?: TableFloatFilterInput | null,
  employmentHistory?: TableStringFilterInput | null,
  education?: TableStringFilterInput | null,
  age?: TableIntFilterInput | null,
};

export type TableIDFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type TableFloatFilterInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  contains?: number | null,
  notContains?: number | null,
  between?: Array< number | null > | null,
};

export type ApplicantProfileDataModelConnection = {
  __typename: "ApplicantProfileDataModelConnection",
  items?:  Array<ApplicantProfileDataModel | null > | null,
  nextToken?: string | null,
};

export type TableJobApplicationDataFilterInput = {
  id?: TableIDFilterInput | null,
  name?: TableStringFilterInput | null,
  email?: TableStringFilterInput | null,
  phoneNumber?: TableStringFilterInput | null,
  longitude?: TableFloatFilterInput | null,
  latitude?: TableFloatFilterInput | null,
  employmentHistory?: TableStringFilterInput | null,
  education?: TableStringFilterInput | null,
  age?: TableIntFilterInput | null,
  profilePicUrl?: TableStringFilterInput | null,
  status?: TableStringFilterInput | null,
  additionalQuestionAnswer?: TableStringFilterInput | null,
};

export type JobApplicationDataConnection = {
  __typename: "JobApplicationDataConnection",
  items?:  Array<JobApplicationData | null > | null,
  nextToken?: string | null,
};

export type CreateEmployerProfileDataModelMutationVariables = {
  input: CreateEmployerProfileDataModelInput,
};

export type CreateEmployerProfileDataModelMutation = {
  createEmployerProfileDataModel?:  {
    __typename: "EmployerProfileDataModel",
    id: string,
    name: string,
    userType?: string | null,
    email: string,
    phoneNumber?: string | null,
    location?:  {
      __typename: "Location",
      lon?: number | null,
      lat?: number | null,
    } | null,
    businessName?: string | null,
    industry?: string | null,
    jobPostIds?: Array< string | null > | null,
    profilePicUrl?: string | null,
  } | null,
};

export type UpdateEmployerProfileDataModelMutationVariables = {
  input: UpdateEmployerProfileDataModelInput,
};

export type UpdateEmployerProfileDataModelMutation = {
  updateEmployerProfileDataModel?:  {
    __typename: "EmployerProfileDataModel",
    id: string,
    name: string,
    userType?: string | null,
    email: string,
    phoneNumber?: string | null,
    location?:  {
      __typename: "Location",
      lon?: number | null,
      lat?: number | null,
    } | null,
    businessName?: string | null,
    industry?: string | null,
    jobPostIds?: Array< string | null > | null,
    profilePicUrl?: string | null,
  } | null,
};

export type DeleteEmployerProfileDataModelMutationVariables = {
  input: DeleteEmployerProfileDataModelInput,
};

export type DeleteEmployerProfileDataModelMutation = {
  deleteEmployerProfileDataModel?:  {
    __typename: "EmployerProfileDataModel",
    id: string,
    name: string,
    userType?: string | null,
    email: string,
    phoneNumber?: string | null,
    location?:  {
      __typename: "Location",
      lon?: number | null,
      lat?: number | null,
    } | null,
    businessName?: string | null,
    industry?: string | null,
    jobPostIds?: Array< string | null > | null,
    profilePicUrl?: string | null,
  } | null,
};

export type CreateJobPostingDataMutationVariables = {
  input: CreateJobPostingDataInput,
};

export type CreateJobPostingDataMutation = {
  createJobPostingData?:  {
    __typename: "JobPostingData",
    id?: string | null,
    datePosted?: string | null,
    roleName?: string | null,
    businessName?: string | null,
    description?: string | null,
    salaryRangeLow?: number | null,
    salaryRangeHigh?: number | null,
    workHourLow?: number | null,
    workHourHigh?: number | null,
    isInternship?: boolean | null,
    isParttime?: boolean | null,
    isFulltime?: boolean | null,
    requiredSections?: Array< number | null > | null,
    additionalQuestionTitles?: Array< string | null > | null,
    views?: number | null,
    applicants?: number | null,
    isActive?: boolean | null,
    applicationIds?: Array< string | null > | null,
    location?:  {
      __typename: "Location",
      lon?: number | null,
      lat?: number | null,
    } | null,
    geoHash?: string | null,
  } | null,
};

export type UpdateJobPostingDataMutationVariables = {
  input: UpdateJobPostingDataInput,
};

export type UpdateJobPostingDataMutation = {
  updateJobPostingData?:  {
    __typename: "JobPostingData",
    id?: string | null,
    datePosted?: string | null,
    roleName?: string | null,
    businessName?: string | null,
    description?: string | null,
    salaryRangeLow?: number | null,
    salaryRangeHigh?: number | null,
    workHourLow?: number | null,
    workHourHigh?: number | null,
    isInternship?: boolean | null,
    isParttime?: boolean | null,
    isFulltime?: boolean | null,
    requiredSections?: Array< number | null > | null,
    additionalQuestionTitles?: Array< string | null > | null,
    views?: number | null,
    applicants?: number | null,
    isActive?: boolean | null,
    applicationIds?: Array< string | null > | null,
    location?:  {
      __typename: "Location",
      lon?: number | null,
      lat?: number | null,
    } | null,
    geoHash?: string | null,
  } | null,
};

export type DeleteJobPostingDataMutationVariables = {
  input: DeleteJobPostingDataInput,
};

export type DeleteJobPostingDataMutation = {
  deleteJobPostingData?:  {
    __typename: "JobPostingData",
    id?: string | null,
    datePosted?: string | null,
    roleName?: string | null,
    businessName?: string | null,
    description?: string | null,
    salaryRangeLow?: number | null,
    salaryRangeHigh?: number | null,
    workHourLow?: number | null,
    workHourHigh?: number | null,
    isInternship?: boolean | null,
    isParttime?: boolean | null,
    isFulltime?: boolean | null,
    requiredSections?: Array< number | null > | null,
    additionalQuestionTitles?: Array< string | null > | null,
    views?: number | null,
    applicants?: number | null,
    isActive?: boolean | null,
    applicationIds?: Array< string | null > | null,
    location?:  {
      __typename: "Location",
      lon?: number | null,
      lat?: number | null,
    } | null,
    geoHash?: string | null,
  } | null,
};

export type CreateApplicantProfileDataModelMutationVariables = {
  input: CreateApplicantProfileDataModelInput,
};

export type CreateApplicantProfileDataModelMutation = {
  createApplicantProfileDataModel?:  {
    __typename: "ApplicantProfileDataModel",
    id?: string | null,
    name?: string | null,
    userType?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    longitude?: number | null,
    latitude?: number | null,
    employmentHistory?: Array< string | null > | null,
    education?: string | null,
    age?: number | null,
    profilePicUrl?: string | null,
    appliedJobs?: Array< string | null > | null,
  } | null,
};

export type UpdateApplicantProfileDataModelMutationVariables = {
  input: UpdateApplicantProfileDataModelInput,
};

export type UpdateApplicantProfileDataModelMutation = {
  updateApplicantProfileDataModel?:  {
    __typename: "ApplicantProfileDataModel",
    id?: string | null,
    name?: string | null,
    userType?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    longitude?: number | null,
    latitude?: number | null,
    employmentHistory?: Array< string | null > | null,
    education?: string | null,
    age?: number | null,
    profilePicUrl?: string | null,
    appliedJobs?: Array< string | null > | null,
  } | null,
};

export type DeleteApplicantProfileDataModelMutationVariables = {
  input: DeleteApplicantProfileDataModelInput,
};

export type DeleteApplicantProfileDataModelMutation = {
  deleteApplicantProfileDataModel?:  {
    __typename: "ApplicantProfileDataModel",
    id?: string | null,
    name?: string | null,
    userType?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    longitude?: number | null,
    latitude?: number | null,
    employmentHistory?: Array< string | null > | null,
    education?: string | null,
    age?: number | null,
    profilePicUrl?: string | null,
    appliedJobs?: Array< string | null > | null,
  } | null,
};

export type CreateJobApplicationDataMutationVariables = {
  input: CreateJobApplicationDataInput,
};

export type CreateJobApplicationDataMutation = {
  createJobApplicationData?:  {
    __typename: "JobApplicationData",
    id?: string | null,
    name?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    longitude?: number | null,
    latitude?: number | null,
    employmentHistory?: Array< string | null > | null,
    education?: string | null,
    age?: number | null,
    profilePicUrl?: string | null,
    status?: string | null,
    additionalQuestionAnswer?: Array< string | null > | null,
  } | null,
};

export type UpdateJobApplicationDataMutationVariables = {
  input: UpdateJobApplicationDataInput,
};

export type UpdateJobApplicationDataMutation = {
  updateJobApplicationData?:  {
    __typename: "JobApplicationData",
    id?: string | null,
    name?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    longitude?: number | null,
    latitude?: number | null,
    employmentHistory?: Array< string | null > | null,
    education?: string | null,
    age?: number | null,
    profilePicUrl?: string | null,
    status?: string | null,
    additionalQuestionAnswer?: Array< string | null > | null,
  } | null,
};

export type DeleteJobApplicationDataMutationVariables = {
  input: DeleteJobApplicationDataInput,
};

export type DeleteJobApplicationDataMutation = {
  deleteJobApplicationData?:  {
    __typename: "JobApplicationData",
    id?: string | null,
    name?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    longitude?: number | null,
    latitude?: number | null,
    employmentHistory?: Array< string | null > | null,
    education?: string | null,
    age?: number | null,
    profilePicUrl?: string | null,
    status?: string | null,
    additionalQuestionAnswer?: Array< string | null > | null,
  } | null,
};

export type CreateJobPostSearchDataMutationVariables = {
  input: JobPostSearchInput,
};

export type CreateJobPostSearchDataMutation = {
  createJobPostSearchData?:  {
    __typename: "JobPostSearchDataModel",
    id?: string | null,
    lon?: number | null,
    lat?: number | null,
    businessName?: string | null,
  } | null,
};

export type GetEmployerProfileDataModelQueryVariables = {
  id: string,
};

export type GetEmployerProfileDataModelQuery = {
  getEmployerProfileDataModel?:  {
    __typename: "EmployerProfileDataModel",
    id: string,
    name: string,
    userType?: string | null,
    email: string,
    phoneNumber?: string | null,
    location?:  {
      __typename: "Location",
      lon?: number | null,
      lat?: number | null,
    } | null,
    businessName?: string | null,
    industry?: string | null,
    jobPostIds?: Array< string | null > | null,
    profilePicUrl?: string | null,
  } | null,
};

export type ListEmployerProfileDataModelsQueryVariables = {
  filter?: TableEmployerProfileDataModelFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListEmployerProfileDataModelsQuery = {
  listEmployerProfileDataModels?:  {
    __typename: "EmployerProfileDataModelConnection",
    items?:  Array< {
      __typename: "EmployerProfileDataModel",
      id: string,
      name: string,
      userType?: string | null,
      email: string,
      phoneNumber?: string | null,
      businessName?: string | null,
      industry?: string | null,
      jobPostIds?: Array< string | null > | null,
      profilePicUrl?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetJobPostingDataQueryVariables = {
  id: string,
};

export type GetJobPostingDataQuery = {
  getJobPostingData?:  {
    __typename: "JobPostingData",
    id?: string | null,
    datePosted?: string | null,
    roleName?: string | null,
    businessName?: string | null,
    description?: string | null,
    salaryRangeLow?: number | null,
    salaryRangeHigh?: number | null,
    workHourLow?: number | null,
    workHourHigh?: number | null,
    isInternship?: boolean | null,
    isParttime?: boolean | null,
    isFulltime?: boolean | null,
    requiredSections?: Array< number | null > | null,
    additionalQuestionTitles?: Array< string | null > | null,
    views?: number | null,
    applicants?: number | null,
    isActive?: boolean | null,
    applicationIds?: Array< string | null > | null,
    location?:  {
      __typename: "Location",
      lon?: number | null,
      lat?: number | null,
    } | null,
    geoHash?: string | null,
  } | null,
};

export type ListJobPostingDataQueryVariables = {
  filter?: TableJobPostingDataFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListJobPostingDataQuery = {
  listJobPostingData?:  {
    __typename: "JobPostingDataConnection",
    items?:  Array< {
      __typename: "JobPostingData",
      id?: string | null,
      datePosted?: string | null,
      roleName?: string | null,
      businessName?: string | null,
      description?: string | null,
      salaryRangeLow?: number | null,
      salaryRangeHigh?: number | null,
      workHourLow?: number | null,
      workHourHigh?: number | null,
      isInternship?: boolean | null,
      isParttime?: boolean | null,
      isFulltime?: boolean | null,
      requiredSections?: Array< number | null > | null,
      additionalQuestionTitles?: Array< string | null > | null,
      views?: number | null,
      applicants?: number | null,
      isActive?: boolean | null,
      applicationIds?: Array< string | null > | null,
      geoHash?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetApplicantProfileDataModelQueryVariables = {
  id: string,
};

export type GetApplicantProfileDataModelQuery = {
  getApplicantProfileDataModel?:  {
    __typename: "ApplicantProfileDataModel",
    id?: string | null,
    name?: string | null,
    userType?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    longitude?: number | null,
    latitude?: number | null,
    employmentHistory?: Array< string | null > | null,
    education?: string | null,
    age?: number | null,
    profilePicUrl?: string | null,
    appliedJobs?: Array< string | null > | null,
  } | null,
};

export type ListApplicantProfileDataModelsQueryVariables = {
  filter?: TableApplicantProfileDataModelFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListApplicantProfileDataModelsQuery = {
  listApplicantProfileDataModels?:  {
    __typename: "ApplicantProfileDataModelConnection",
    items?:  Array< {
      __typename: "ApplicantProfileDataModel",
      id?: string | null,
      name?: string | null,
      userType?: string | null,
      email?: string | null,
      phoneNumber?: string | null,
      longitude?: number | null,
      latitude?: number | null,
      employmentHistory?: Array< string | null > | null,
      education?: string | null,
      age?: number | null,
      profilePicUrl?: string | null,
      appliedJobs?: Array< string | null > | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetJobApplicationDataQueryVariables = {
  id: string,
};

export type GetJobApplicationDataQuery = {
  getJobApplicationData?:  {
    __typename: "JobApplicationData",
    id?: string | null,
    name?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    longitude?: number | null,
    latitude?: number | null,
    employmentHistory?: Array< string | null > | null,
    education?: string | null,
    age?: number | null,
    profilePicUrl?: string | null,
    status?: string | null,
    additionalQuestionAnswer?: Array< string | null > | null,
  } | null,
};

export type ListJobApplicationDataQueryVariables = {
  filter?: TableJobApplicationDataFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListJobApplicationDataQuery = {
  listJobApplicationData?:  {
    __typename: "JobApplicationDataConnection",
    items?:  Array< {
      __typename: "JobApplicationData",
      id?: string | null,
      name?: string | null,
      email?: string | null,
      phoneNumber?: string | null,
      longitude?: number | null,
      latitude?: number | null,
      employmentHistory?: Array< string | null > | null,
      education?: string | null,
      age?: number | null,
      profilePicUrl?: string | null,
      status?: string | null,
      additionalQuestionAnswer?: Array< string | null > | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetNearestJobsQueryVariables = {
  lon?: number | null,
  lat?: number | null,
  range?: number | null,
};

export type GetNearestJobsQuery = {
  getNearestJobs:  Array< {
    __typename: "JobPostSearchDataModel",
    id?: string | null,
    lon?: number | null,
    lat?: number | null,
    businessName?: string | null,
  } | null >,
};

export type OnCreateEmployerProfileDataModelSubscriptionVariables = {
  id?: string | null,
  name: string,
  userType?: string | null,
  email: string,
  phoneNumber?: string | null,
};

export type OnCreateEmployerProfileDataModelSubscription = {
  onCreateEmployerProfileDataModel?:  {
    __typename: "EmployerProfileDataModel",
    id: string,
    name: string,
    userType?: string | null,
    email: string,
    phoneNumber?: string | null,
    location?:  {
      __typename: "Location",
      lon?: number | null,
      lat?: number | null,
    } | null,
    businessName?: string | null,
    industry?: string | null,
    jobPostIds?: Array< string | null > | null,
    profilePicUrl?: string | null,
  } | null,
};

export type OnUpdateEmployerProfileDataModelSubscriptionVariables = {
  id?: string | null,
  name: string,
  userType?: string | null,
  email: string,
  phoneNumber?: string | null,
};

export type OnUpdateEmployerProfileDataModelSubscription = {
  onUpdateEmployerProfileDataModel?:  {
    __typename: "EmployerProfileDataModel",
    id: string,
    name: string,
    userType?: string | null,
    email: string,
    phoneNumber?: string | null,
    location?:  {
      __typename: "Location",
      lon?: number | null,
      lat?: number | null,
    } | null,
    businessName?: string | null,
    industry?: string | null,
    jobPostIds?: Array< string | null > | null,
    profilePicUrl?: string | null,
  } | null,
};

export type OnDeleteEmployerProfileDataModelSubscriptionVariables = {
  id?: string | null,
  name?: string | null,
  userType?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
};

export type OnDeleteEmployerProfileDataModelSubscription = {
  onDeleteEmployerProfileDataModel?:  {
    __typename: "EmployerProfileDataModel",
    id: string,
    name: string,
    userType?: string | null,
    email: string,
    phoneNumber?: string | null,
    location?:  {
      __typename: "Location",
      lon?: number | null,
      lat?: number | null,
    } | null,
    businessName?: string | null,
    industry?: string | null,
    jobPostIds?: Array< string | null > | null,
    profilePicUrl?: string | null,
  } | null,
};

export type OnCreateJobPostingDataSubscriptionVariables = {
  id?: string | null,
  datePosted?: string | null,
  roleName?: string | null,
  description?: string | null,
  salaryRangeLow?: number | null,
};

export type OnCreateJobPostingDataSubscription = {
  onCreateJobPostingData?:  {
    __typename: "JobPostingData",
    id?: string | null,
    datePosted?: string | null,
    roleName?: string | null,
    businessName?: string | null,
    description?: string | null,
    salaryRangeLow?: number | null,
    salaryRangeHigh?: number | null,
    workHourLow?: number | null,
    workHourHigh?: number | null,
    isInternship?: boolean | null,
    isParttime?: boolean | null,
    isFulltime?: boolean | null,
    requiredSections?: Array< number | null > | null,
    additionalQuestionTitles?: Array< string | null > | null,
    views?: number | null,
    applicants?: number | null,
    isActive?: boolean | null,
    applicationIds?: Array< string | null > | null,
    location?:  {
      __typename: "Location",
      lon?: number | null,
      lat?: number | null,
    } | null,
    geoHash?: string | null,
  } | null,
};

export type OnUpdateJobPostingDataSubscriptionVariables = {
  id?: string | null,
  datePosted?: string | null,
  roleName?: string | null,
  description?: string | null,
  salaryRangeLow?: number | null,
};

export type OnUpdateJobPostingDataSubscription = {
  onUpdateJobPostingData?:  {
    __typename: "JobPostingData",
    id?: string | null,
    datePosted?: string | null,
    roleName?: string | null,
    businessName?: string | null,
    description?: string | null,
    salaryRangeLow?: number | null,
    salaryRangeHigh?: number | null,
    workHourLow?: number | null,
    workHourHigh?: number | null,
    isInternship?: boolean | null,
    isParttime?: boolean | null,
    isFulltime?: boolean | null,
    requiredSections?: Array< number | null > | null,
    additionalQuestionTitles?: Array< string | null > | null,
    views?: number | null,
    applicants?: number | null,
    isActive?: boolean | null,
    applicationIds?: Array< string | null > | null,
    location?:  {
      __typename: "Location",
      lon?: number | null,
      lat?: number | null,
    } | null,
    geoHash?: string | null,
  } | null,
};

export type OnDeleteJobPostingDataSubscriptionVariables = {
  id?: string | null,
  datePosted?: string | null,
  roleName?: string | null,
  description?: string | null,
  salaryRangeLow?: number | null,
};

export type OnDeleteJobPostingDataSubscription = {
  onDeleteJobPostingData?:  {
    __typename: "JobPostingData",
    id?: string | null,
    datePosted?: string | null,
    roleName?: string | null,
    businessName?: string | null,
    description?: string | null,
    salaryRangeLow?: number | null,
    salaryRangeHigh?: number | null,
    workHourLow?: number | null,
    workHourHigh?: number | null,
    isInternship?: boolean | null,
    isParttime?: boolean | null,
    isFulltime?: boolean | null,
    requiredSections?: Array< number | null > | null,
    additionalQuestionTitles?: Array< string | null > | null,
    views?: number | null,
    applicants?: number | null,
    isActive?: boolean | null,
    applicationIds?: Array< string | null > | null,
    location?:  {
      __typename: "Location",
      lon?: number | null,
      lat?: number | null,
    } | null,
    geoHash?: string | null,
  } | null,
};

export type OnCreateApplicantProfileDataModelSubscriptionVariables = {
  id?: string | null,
  name?: string | null,
  userType?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
};

export type OnCreateApplicantProfileDataModelSubscription = {
  onCreateApplicantProfileDataModel?:  {
    __typename: "ApplicantProfileDataModel",
    id?: string | null,
    name?: string | null,
    userType?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    longitude?: number | null,
    latitude?: number | null,
    employmentHistory?: Array< string | null > | null,
    education?: string | null,
    age?: number | null,
    profilePicUrl?: string | null,
    appliedJobs?: Array< string | null > | null,
  } | null,
};

export type OnUpdateApplicantProfileDataModelSubscriptionVariables = {
  id?: string | null,
  name?: string | null,
  userType?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
};

export type OnUpdateApplicantProfileDataModelSubscription = {
  onUpdateApplicantProfileDataModel?:  {
    __typename: "ApplicantProfileDataModel",
    id?: string | null,
    name?: string | null,
    userType?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    longitude?: number | null,
    latitude?: number | null,
    employmentHistory?: Array< string | null > | null,
    education?: string | null,
    age?: number | null,
    profilePicUrl?: string | null,
    appliedJobs?: Array< string | null > | null,
  } | null,
};

export type OnDeleteApplicantProfileDataModelSubscriptionVariables = {
  id?: string | null,
  name?: string | null,
  userType?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
};

export type OnDeleteApplicantProfileDataModelSubscription = {
  onDeleteApplicantProfileDataModel?:  {
    __typename: "ApplicantProfileDataModel",
    id?: string | null,
    name?: string | null,
    userType?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    longitude?: number | null,
    latitude?: number | null,
    employmentHistory?: Array< string | null > | null,
    education?: string | null,
    age?: number | null,
    profilePicUrl?: string | null,
    appliedJobs?: Array< string | null > | null,
  } | null,
};

export type OnCreateJobApplicationDataSubscriptionVariables = {
  id?: string | null,
  name?: string | null,
  userType?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
};

export type OnCreateJobApplicationDataSubscription = {
  onCreateJobApplicationData?:  {
    __typename: "JobApplicationData",
    id?: string | null,
    name?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    longitude?: number | null,
    latitude?: number | null,
    employmentHistory?: Array< string | null > | null,
    education?: string | null,
    age?: number | null,
    profilePicUrl?: string | null,
    status?: string | null,
    additionalQuestionAnswer?: Array< string | null > | null,
  } | null,
};

export type OnUpdateJobApplicationDataSubscriptionVariables = {
  id?: string | null,
  name?: string | null,
  userType?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
};

export type OnUpdateJobApplicationDataSubscription = {
  onUpdateJobApplicationData?:  {
    __typename: "JobApplicationData",
    id?: string | null,
    name?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    longitude?: number | null,
    latitude?: number | null,
    employmentHistory?: Array< string | null > | null,
    education?: string | null,
    age?: number | null,
    profilePicUrl?: string | null,
    status?: string | null,
    additionalQuestionAnswer?: Array< string | null > | null,
  } | null,
};

export type OnDeleteJobApplicationDataSubscriptionVariables = {
  id?: string | null,
  name?: string | null,
  userType?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
};

export type OnDeleteJobApplicationDataSubscription = {
  onDeleteJobApplicationData?:  {
    __typename: "JobApplicationData",
    id?: string | null,
    name?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    longitude?: number | null,
    latitude?: number | null,
    employmentHistory?: Array< string | null > | null,
    education?: string | null,
    age?: number | null,
    profilePicUrl?: string | null,
    status?: string | null,
    additionalQuestionAnswer?: Array< string | null > | null,
  } | null,
};
