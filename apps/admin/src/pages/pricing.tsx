import { Result, Row, Col } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Pricing } from '../components/catalog/papers/Pricing';
import { PARAM_ID } from '../configs/constants';
import { ERROR_GENERIC, SET_PRICES } from '../configs/lang';

const PricingPage = () => {
  const { id } = useParams<typeof PARAM_ID>();

  if (!id) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  return (
    <>
      <Helmet>
        <title>{SET_PRICES}</title>
      </Helmet>
      <Row>
        <Col span={24}>
          <Pricing paperId={id} />
        </Col>
      </Row>
    </>
  );
};

export { PricingPage };
