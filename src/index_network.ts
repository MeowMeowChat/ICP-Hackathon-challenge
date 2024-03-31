import { v4 as uuidv4 } from 'uuid';
import { Server, ic, StableBTreeMap } from 'azle';

class Message {
    id: string;
    title: string;
    body: string;
    attachmentURL: string;
    createdAt: Date;
    updatedAt: Date | null;
    constructor(id: string, title: string, body: string, attachmentURL: string, createdAt: Date, updatedAt: Date | null) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.attachmentURL = attachmentURL;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

const messagesStorage = new StableBTreeMap<string, Message>(0);

// Adapted methods
export function postMessage(title: string, body: string, attachmentURL: string): Message {
    const message = new Message(uuidv4(), title, body, attachmentURL, getCurrentDate(), null);
    messagesStorage.insert(message.id, message);
    return message;
}

export function getMessages(): Message[] {
    return messagesStorage.values();
}

export function getMessageById(id: string): Message | undefined {
    const messageOpt = messagesStorage.get(id);
    if ("None" in messageOpt) {
        return undefined;
    } else {
        return messageOpt.Some;
    }
}

export function updateMessage(id: string, title: string, body: string, attachmentURL: string): Message | undefined {
    const messageOpt = messagesStorage.get(id);
    if ("None" in messageOpt) {
        return undefined;
    } else {
        const message = messageOpt.Some;
        const updatedMessage = new Message(message.id, title, body, attachmentURL, message.createdAt, getCurrentDate());
        messagesStorage.insert(message.id, updatedMessage);
        return updatedMessage;
    }
}

export function deleteMessage(id: string): boolean {
    const deletedMessage = messagesStorage.remove(id);
    return !"None" in deletedMessage;
}

function getCurrentDate(): Date {
    const timestamp = new Number(ic.time());
    return new Date(timestamp.valueOf() / 1000_000);
}
