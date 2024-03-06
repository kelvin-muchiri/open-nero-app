import { AxiosBaseQueryBuilderType } from '../axios-base-query';

/* eslint-disable sonarjs/no-identical-functions */

export enum UserTagTypes {
  PROFILE = 'profile',
}

export type ProfileType = 'CUSTOMER' | 'STAFF';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  is_email_verified: boolean;
  profile_type: ProfileType;
}

export interface UpdateProfileData {
  first_name: string;
  last_name: string;
  email: string;
}

export const getProfile = (build: AxiosBaseQueryBuilderType) =>
  build.query<User, string>({
    query: (url) => {
      return {
        url,
        method: 'get',
      };
    },
    providesTags: [UserTagTypes.PROFILE],
  });

export const updateProfile = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<User, { url: string; data: Partial<UpdateProfileData> }>({
    query: (arg) => {
      const { url, data } = arg;
      return {
        url,
        method: 'patch',
        data: data,
      };
    },
    invalidatesTags: [UserTagTypes.PROFILE],
  });
