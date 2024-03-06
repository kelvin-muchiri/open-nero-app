import { Request } from 'express';
import Axios from 'axios';

export const getAxiosInstance = (req: Request) => {
  return Axios.create({
    baseURL:
      process.env.REACT_APP_NERO_API_BASE_URL ||
      `${req.protocol}://${req.headers.host || ''}/api/v1`,
  });
};
