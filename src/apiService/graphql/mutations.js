
export const createUser = 
  `mutation createEmployerProfileDataModel(
    $createemployerprofiledatamodelinput: CreateEmployerProfileDataModelInput!
  ) {
  createEmployerProfileDataModel(input: $createemployerprofiledatamodelinput) {
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
  }
}`

// const query listEmployerProfileDataModels {
//   listEmployerProfileDataModels {
//     items {
//       id
//       name
//       userType
//       email
//       phoneNumber
//       location {
//         lon
//         lat
//       }
//       businessName
//       industry
//     }
//   }
// }
