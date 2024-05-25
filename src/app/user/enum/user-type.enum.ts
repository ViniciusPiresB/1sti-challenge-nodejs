export enum UserType {
  User = 0,
  Admin = 1,
  Root = 2
}

export const UserRole = [UserType.User, UserType.Admin, UserType.Root];
export const AdminRole = [UserType.Admin, UserType.Root];
export const RootRole = [UserType.Root];
