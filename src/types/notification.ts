
export interface ApiNotification {
    _id: string;
    userId: string;
    senderId: {
        _id: string;
        fullName: string;
        username: string;
        image?: string;
    };
    type: "like" | "contact" | "reply" | "comment";
    entityId: string;
    entityType: "Post" | string;
    content: string;
    status: "read" | "unread";
    createdAt: string;
    updatedAt: string;
}
