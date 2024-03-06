import { AxiosResponse } from 'axios';
import { ENDPOINT_CHECK_EMAIL_EXISTS } from '../configs/constants';
import { ERROR_EMAIL_EXISTS } from '../configs/lang';
import { apiService } from '../services/api';

export interface EmailExistsResponse {
  exists: boolean;
}

export const emailExistsValidator = async (value: string) => {
  if (!value) {
    return Promise.resolve();
  }

  let res: AxiosResponse<EmailExistsResponse>;

  try {
    res = await apiService.getAxiosInstance().post(ENDPOINT_CHECK_EMAIL_EXISTS, {
      email: value,
      profile_type: 'CUSTOMER',
    });
  } catch (error) {
    return Promise.resolve();
  }

  if (res.data.exists) {
    return Promise.reject(new Error(ERROR_EMAIL_EXISTS));
  }

  return Promise.resolve();
};
