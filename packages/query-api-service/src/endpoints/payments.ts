import { AxiosBaseQueryBuilderType } from '../axios-base-query';

export enum PaymentMethodCode {
  PAYPAL = 'PAYPAL',
  INSTRUCTIONS = 'INSTRUCTIONS',
  TWOCHECKOUT = 'TWOCHECKOUT',
}

export interface PaymentMethod {
  title: string;
  code: PaymentMethodCode;
  is_active: boolean;
  meta: { [key: string]: string };
  instructions: string | null;
}

export interface PaymentMethodParams {
  is_active?: boolean;
  code?: PaymentMethodCode;
}

export const getPaymentMethods = (build: AxiosBaseQueryBuilderType) =>
  build.query<PaymentMethod[], { params?: PaymentMethodParams; url: string }>({
    query: (arg) => {
      const { params, url } = arg;

      return {
        url,
        method: 'get',
        params,
      };
    },
  });
