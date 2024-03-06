import { ENDPOINT_GOOGLE_RECAPTCHA_VERIFY } from '../../configs/constants';
import { apiService } from '../../services/api';

/**
 * Verify Google ReCaptcha token
 *
 * @param token
 * @returns {boolean} whether token is valid or not
 */
export const verifyRecaptcha = async (token: string) => {
  let success = false;

  try {
    const { data } = await apiService
      .getAxiosInstance()
      .post<{ success: boolean }>(ENDPOINT_GOOGLE_RECAPTCHA_VERIFY, {
        token,
      });
    success = data.success;
  } catch (err) {
    return false;
  }

  return success;
};
