import { createMarkup } from '@nero/utils';
import { Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { URL_ORDER_HISTORY } from '../../../configs/constants';
import { PAYMENT_INSTRUCTIONS_HEADING, TAKE_ME_HOME } from '../../../configs/lang';

export interface PaymentInstructionsProps {
  instructions: string;
}

const PaymentInstructions: React.FC<PaymentInstructionsProps> = (
  props: PaymentInstructionsProps
) => {
  const { instructions } = props;
  const navigate = useNavigate();

  return (
    <>
      <h4>{PAYMENT_INSTRUCTIONS_HEADING}</h4>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div
          dangerouslySetInnerHTML={
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
            createMarkup(instructions)
          }
        />
        <Button type="primary" onClick={() => navigate(URL_ORDER_HISTORY)}>
          {TAKE_ME_HOME}
        </Button>
      </Space>
    </>
  );
};

export { PaymentInstructions };
