


export type ChatMessage = {
    id: string,
    text: string,
    createdAt: number,
    //just same as profile id
    senderId: string,
}

export function serializeGiftedChatMessage(giftedMessage, senderId: string) {
    const createdDate = new Date(giftedMessage.createdAt)
    const serializedChatMessage: ChatMessage = {
        id: giftedMessage._id,
        text: giftedMessage.text,
        createdAt: createdDate.getTime() / 1000,
        senderId: senderId
    }
    return serializedChatMessage
}

// [{"text":"A",
// "user":{"name":"Joe Biden","avatar":"https://placeimg.com/140/140/any"},
// "createdAt":"2022-02-03T05:51:18.053Z","_id":"908f0115-aaa0-4b99-8526-a6a9fa9d022f"}]
export function unserializeGiftedChatMessage(chatMessage: ChatMessage) {
    const unserializedMessage = {
        text: chatMessage.text,
        createdAt: new Date(chatMessage.createdAt * 1000),
        _id: chatMessage.id,
        senderId: chatMessage.senderId
    }
    return unserializedMessage
}
