
import { ChatMessage, serializeGiftedChatMessage, unserializeGiftedChatMessage } from '../../../screens/HomeScreen/Employer/MessageDataModel';
import { getDatabase, ref, onValue, set, orderByKey, query, orderByValue, orderByChild, limitToFirst, limitToLast, onChildChanged } from 'firebase/database';

const realTimeDB = getDatabase();

//chatId = applicationId
// export async function sendMessageAPI(jobApplicationId: string, messageData: ChatMessage, callback) {
//     try {
//         // console.log("debug1", JSON.stringify(messageData))
//         // console.log("debug3: ", `chatMessageData/${jobApplicationId}`)
//         // const chatMessageCollection = collection(firestore, 'chatMessageData')
//         // doc(firestore, 'chatMessageData')
//         collection(firestore, "chatMessageData", jobApplicationId)

//         const chatMessageDataRef = doc(firestore, "chatMessageData/" + jobApplicationId + "/", messageData.id);
//         console.log("debug2")
//         await setDoc(chatMessageDataRef, messageData)
//         callback(null)
//     } catch (err) {
//         callback(err)
//     }
// }

export async function sendNewMessageAPI(jobApplicationId: string, messageData: ChatMessage, isApplicant: boolean, callback) {
    const reference = ref(realTimeDB, `chatMessageData/${jobApplicationId}/` + messageData.id);
    set(reference, messageData).then(
        await markUnreadNewMessages(jobApplicationId, isApplicant).then(
            callback(null)
        )
       
    ).catch((err: string) => {
        callback(err)
    })
}

export async function fetchMessageAPI(jobApplicationId: string, callback) {
    const chatMessagesRef = ref(realTimeDB, `chatMessageData/${jobApplicationId}/`)
    const fetchRecentMessagesQuery = await query(chatMessagesRef, orderByChild('createdAt'))


    onValue(fetchRecentMessagesQuery, (snapshot) => {

        if (snapshot == null) {
            callback("err", null)
            return
        }
        let fetchedMessages = []
        snapshot.forEach((singleSnap) => {
            const snapValue = singleSnap.val()

            const chatMessage: ChatMessage = {
                id: snapValue.id,
                text: snapValue.text,
                createdAt: snapValue.createdAt,
                senderId: snapValue.senderId
            }
            const deserializedMessage = unserializeGiftedChatMessage(chatMessage)
            fetchedMessages.push(deserializedMessage)
        })
       callback(null, fetchedMessages)
    })
}

// export async function fetchMessageAPI(jobApplicationId: string, callback) {
//     try {
        
//         const ref = collection(firestore, "chatMessageData/" + jobApplicationId);
//         const last20MessagesQuery = query(ref, orderBy("createdAt", "desc"), limit(20));
//         const querySnapshot = await getDocs(last20MessagesQuery);

//         let fetchedMessages = []
//         if (querySnapshot) {
//             await querySnapshot.forEach((doc) => {
//                 let messageData = doc.data();
//                 fetchedMessages.push(messageData);
//             })
//             callback(null, fetchMessageAPI)
//         } else {
//             callback("Chat messages for job application do not exist", null)
//         }
//     } catch(err) {
//         callback(err, null)
//     }
// }

// READ STATUS/NOTIFICATION API

export async function fetchChatUnreadStatus(jobApplicationId: string, isApplicant: boolean, callback) {
    const dbRef = isApplicant ? ref(realTimeDB, `chatNotification/${jobApplicationId}/applicant/`) : ref(realTimeDB, `chatNotification/${jobApplicationId}/employer/`)

    
    onValue(dbRef, (snapshot) => {
        callback(snapshot.val())
    })
    onChildChanged(dbRef, (snapshot) => {
        callback(snapshot.val())
    })
}

export async function fetchChatUnreadStatuses(jobApplicationIds: [string], isApplicant: boolean, callback) {

    jobApplicationIds.forEach((jobApplicationId) => {
        fetchChatUnreadStatus(jobApplicationId, isApplicant, (snapshot) => {
            callback(jobApplicationId, snapshot)
        })
    })
}

export async function markUnreadNewMessages(jobApplicationId: string, alertApplicant: boolean) {
    const dbRef = alertApplicant ? ref(realTimeDB, `chatNotification/${jobApplicationId}/applicant/`) : ref(realTimeDB, `chatNotification/${jobApplicationId}/employer/`)
    set(dbRef, {
        count: 1
    }).catch((err) => {
        console.log("Market unread new messages error: " + err)
    })

    return null
}

export async function markReadNewMessages(jobApplicationId: string, isApplicant: boolean) {
    const dbRef = isApplicant ? ref(realTimeDB, `chatNotification/${jobApplicationId}/applicant/`) : ref(realTimeDB, `chatNotification/${jobApplicationId}/employer/`)
    set(dbRef, {
        count: 0
    }).catch((err) => {
        console.log("Market unread new messages error: " + err)
    })
}
