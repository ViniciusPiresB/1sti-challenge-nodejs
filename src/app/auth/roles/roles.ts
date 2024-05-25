import { UserType } from "src/app/user/enum/user-type.enum";

export const UserRole = [UserType.User, UserType.Admin, UserType.Root];
export const AdminRole = [UserType.Admin, UserType.Root];
export const RootRole = [UserType.Root];
