/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Auth: undefined;
  Version: undefined;
  Splash: undefined;
  Login: LoginData | undefined;
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  AddShift: undefined;
  SignUpRoot: undefined;
  SignUpUserType: SignUpPwd;
  SignUpEmployerRoot: SignUpPwd;
  SignUpEmployerLocation: SignUpAdditional;
  SignUpEmployerAdditionalInfo: SignUpPwd;
  SignUpApplicantRoot: SignUpPwd;
  SignUpApplicantContactInfo: undefined;
  SignUpApplicantLocation: SignUpPwd;
  SignUpApplicantAdditionalInfo: SignUpPwd;
  SignUpApplicantEducation: undefined;
  PostDetails: PostDetailParams | undefined;
  RoleApplicationsDetailView: JobPostData | undefined;
  AppliedJobDetailView: AppliedJobDetailData | undefined;
  ApplicantJobDetailView: ApplicantJobDetailData | undefined;
  ApplicantJobApplicationView: ApplicantJobApplicationData | undefined;
  PhoneAuthScreen: SignUpPwdNPhoneNbr;
  CreationCustomQuestion: NewJobPostData;
  RootNewJobPosting: boolean | undefined;
  ApplicationStatusView: ApplicationStatusData | undefined;
  RootNewJobPostingScreen: NewJobPostingData | boolean | undefined;
  RootApplicantReview: ApplicationReviewData | undefined;
  CreationPostInformation: undefined;
  EmployerOnboarding: undefined;
  ApplicantOnboarding: undefined;
  RootInformationNewPosting: NewJobPostingData | undefined;
  TimeAvailabilityView: undefined;
  LinkPostCreationScreen: undefined;
  LinkPostDetailView: undefined | {data: any};
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Home: undefined;
  EmployerEducation: undefined;
  ApplicantEducation: undefined;
  RootNewJobPostingScreen: undefined;
  TabTwo: undefined;
  AddPost: undefined;
  PostedJob: undefined;
  Profile: undefined;
  AppliedJob: undefined;
  Featured: undefined;
  SplashScreen: undefined;
  RootInformationNewPosting: undefined;
  Root: RootParam | undefined;
};

export type RootParam = {
  showAnimation: boolean
}

export type SignUpPwd = {
  password: string;
};

export type SignUpAdditional = {
  password: string;
  coordinates: any;
};

export type SignUpPwdNPhoneNbr = {
  password: string;
  phoneNumber: string;
  userType: string;
};

export type PostDetailParams = {
  index: number;
};
export type JobPostData = {
  jobPostDataId: any;
  showNotificationBadge: any;
  isInternship: boolean;
}
export type JobPostId = {
  data: any;
}
export type ApplicationReviewData = {
  jobPostId: string;
  applicationId: string;
}
export type ApplicantJobDetailData = {
  data: any;
}
export type AppliedJobDetailData = {
  data: any;
  status: string;
}
export type ApplicantJobDetailView = {
  data: any;
}
export type LoginData = {
  data: any;
}
export type ApplicantJobApplicationData = {
  data: any;
}
export type NewJobPostData = {
  data: any;
}
export type ApplicationStatusData = {
  data: any;
}
export type NewJobPostingData = {
  data: boolean;
}

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
