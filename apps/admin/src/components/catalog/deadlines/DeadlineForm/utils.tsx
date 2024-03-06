import { AxiosResponse } from 'axios';
import { ENDPOINT_DEADLINE_EXISTS } from '../../../../configs/constants';
import { DAY, ERROR_EXISTS_SUFFIX, HOUR, PLURAL_SUFFIX } from '../../../../configs/lang';
import { DeadlineType } from '@nero/query-api-service';
import { apiService } from '../../../../services/api';

export interface Response {
  exists: boolean;
}

export const deadlineTypeValidator = async (
  deadlineType: DeadlineType,
  durationValue: number | string
) => {
  if (!deadlineType) {
    return Promise.resolve();
  }

  let res: AxiosResponse<Response>;

  try {
    res = await apiService.getAxiosInstance().post(ENDPOINT_DEADLINE_EXISTS, {
      value: durationValue,
      deadline_type: deadlineType,
    });
  } catch (error) {
    return Promise.resolve();
  }

  if (res.data.exists) {
    const suffix = durationValue > 1 ? PLURAL_SUFFIX : '';
    const durationName = deadlineType == DeadlineType.HOUR ? HOUR : DAY;

    return Promise.reject(
      new Error(`${durationValue} ${durationName}${suffix} ${ERROR_EXISTS_SUFFIX}`)
    );
  }

  return Promise.resolve();
};
