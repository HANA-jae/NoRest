export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export interface IUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateUserPayload {
    email: string;
    password: string;
    name: string;
}
export interface UpdateUserPayload {
    name?: string;
    email?: string;
}
//# sourceMappingURL=user.types.d.ts.map