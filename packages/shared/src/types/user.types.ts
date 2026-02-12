export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface IUser {
  id: string;          // user_id
  email: string;       // user_email
  name: string;        // user_name
  phone: string;       // user_phone
  role: string;        // user_role
  status: string;      // user_status
  profile?: string | null;    // user_profile
  lastLogin?: string | null;  // last_login
  createdDate?: Date | null;  // created_date
  modifiedDate?: Date | null; // modified_date
}

export interface CreateUserPayload {
  id: string;
  password: string;
  name: string;
  email: string;
  phone: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  profile?: string;
}
