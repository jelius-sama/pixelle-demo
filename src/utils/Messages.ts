const ErrorMessages = {
    noCredentials: "All fields are required to be filled.",
    invalidInputType: ({ requiredType }: { requiredType: "string" | "number" | "void" | "File"; }) => `Invalid input type: Input should be of type ${requiredType}`
};

export enum ServerMessageStatus {
    success = 'success',
    error = 'error',
    info = 'info'
}

export type ServerMessage = {
    msg: string;
    status: ServerMessageStatus;
};

export default ErrorMessages;