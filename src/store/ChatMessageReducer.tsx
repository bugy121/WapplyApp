

export const MARK_CHAT_READ_STATUS = "WAPPLY/CHAT/MARK_CHAT_READ_STATUS"
export const MARK_CHAT_UNREAD_STATUS = "WAPPLY/CHAT/MARK_CHAT_UNREAD_STATUS"

export const markChatRead = (jobApplicationId: string) => (
    {
        type: MARK_CHAT_READ_STATUS,
        data: jobApplicationId
    }
);

export const markChatUnread = (jobApplicationId: string) => (
    {
        type: MARK_CHAT_UNREAD_STATUS,
        data: jobApplicationId
    }
);

// export const populateChatStatuses = () => {

// }

const initialState = {
    // Maps application Id -> num(0 means read 1 means unread messages)
    chatStatuses: {}
}

export function ChatMessageReducer(state = initialState, action) {
    const { type, data } = action
    switch (type) {
        case MARK_CHAT_READ_STATUS:
            return {
                ...state,
                chatStatuses: {
                    ...state.chatStatuses,
                    [data]: 0
                }
            }
        case MARK_CHAT_UNREAD_STATUS:
            return {
                ...state,
                chatStatuses: {
                    ...state.chatStatuses,
                    [data]: 1
                }
            }
        default:
            return state
    }

}
