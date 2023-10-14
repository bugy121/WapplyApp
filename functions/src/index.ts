import * as functions from "firebase-functions";

// The Firebase Admin SDK to access Firestore.
import * as admin from "firebase-admin";
admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// Trigger Events
// https://firebase.google.com/docs/functions/firestore-events
// onCreate, onUpdate, onDelete, onWrite

// Listens for new users
export const createJobPosts = functions.firestore.document('jobPosts/{postId}')
    .onCreate((snap, context) => { 
      // Get an object representing the document
      // e.g. {'name': 'Marie', 'age': 66}
      const newPost = snap.data();

      // access a particular field as you would any JS property
      // const name = newValue.name;

      // perform desired operations ...
      functions.logger.log('A new job post is created: ', newPost);

      // return 
    });


// https://rnfirebase.io/messaging/usage#background--quit-state-messages
export const sendNotification = functions.firestore.document('jobPosts/{postId}')
  .onCreate(async (snap, context) => { 
  // Get an object representing the document
  // e.g. {'name': 'Marie', 'age': 66}
  const newPost = snap.data();

  // access a particular field as you would any JS property
  // const name = newValue.name;

  // perform desired operations ...
  functions.logger.log('A new job post is created: ', newPost);

  const message = {
    data: {
      type: 'warning',
      content: 'A new weather warning has been created!',
    },
    // topic: 'applicant',
    topic: 'unknown'
  };

  await admin.messaging().send(message)
    .then(response => {
      functions.logger.log('Successfully sent message:', response);
    })
    .catch(error => {
      functions.logger.log('Error sending message:', error);
  });
});

// Send notification to employer when there's a new application
export const notifyNewApplication = functions.firestore.document('jobPostApplications/{postId}')
  .onUpdate(async (snap, context) => {
    // Solution B: subscribe to the new application when it's created. Need device's FCM token
    // const beforeApps = snap.before.data().jobApplicationIds;
    // const afterApps = snap.after.data().jobApplicationIds;

    // let targetAppId = '';
    // for (let id of afterApps) {
    //   if (!(id in beforeApps)) {
    //     targetAppId = id;
    //   }
    // }

    // // fetch device token
    // // fetch applicant profile data

    // const ref = doc(, "applicantProfile", uid);
    // const docSnap = await getDoc(ref);

    // if (docSnap.exists()) {
        
    // } else {

    // }

    // const notificationToken = '';
    // await admin.messaging().subscribeToTopic(notificationToken, targetAppId);

    // send message to job post topic
    const postId = context.params.postId;
    const message = {
      notification:{
        title: 'You received a new job application!',
        body: 'Enter the app to view more details',
      },
      topic: postId,
    };

    await admin.messaging().send(message)
      .then(response => {
        functions.logger.log('Successfully sent message:', response);
      })
      .catch(error => {
        functions.logger.log('Error sending message:', error);
    });
});

// Send notification to employer when there's a new message from applicant
export const notifyEmployerAppMessage = functions.database.ref('chatNotification/{appId}/employer')
  .onUpdate(async (change, context) => {
    // send message to job application topic
    const update = change.after.val().count;
    functions.logger.log('update val:', update);
    
    const appId = context.params.appId;
    functions.logger.log('application id:', appId);

    const message = {
      notification:{
        title: 'You received a new message!',
        body: 'Enter the app to view more details',
      },
      topic: appId + '-employer',
    };

    if (update == 1) {
      await admin.messaging().send(message)
        .then(response => {
          functions.logger.log('Successfully sent message:', response);
        })
        .catch(error => {
          functions.logger.log('Error sending message:', error);
      });
    }
});

// Send notification to employer when there's a new message from applicant
export const notifyApplicantAppMessage = functions.database.ref('chatNotification/{appId}/applicant')
  .onUpdate(async (change, context) => {
    // send message to job application topic
    const update = change.after.val().count;
    functions.logger.log('update val:', update);
    
    const appId = context.params.appId;
    functions.logger.log('application id:', appId);

    const message = {
      notification:{
        title: 'You received a new message!',
        body: 'Enter the app to view more details',
      },
      topic: appId + '-applicant',
    };

    if (update == 1) {
      await admin.messaging().send(message)
        .then(response => {
          functions.logger.log('Successfully sent message:', response);
        })
        .catch(error => {
          functions.logger.log('Error sending message:', error);
      });
    }
});

// // Send notification to applicants every day if there are any new job postings
// export const notifyApplicantNewJobPosts = functions.pubsub.schedule('every 6 minute').onRun(async (context) => {

//   // const time = Date();

//   const message = {
//     notification:{
//       title: 'the time is: ',
//       body: 'Enter the app to apply!',
//     },
//     topic: 'test',
//   };

//   await admin.messaging().send(message)
//     .then(response => {
//       functions.logger.log('Successfully sent message:', response);
//     })
//     .catch(error => {
//       functions.logger.log('Error sending message:', error);
//   });

//   return null
// })