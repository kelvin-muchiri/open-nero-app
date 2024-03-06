import { Result, Row, Col } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { DeadlineEdit } from '../components/catalog/deadlines/DeadlineEdit';
import { PARAM_ID } from '../configs/constants';
import { DEADLINE, EDIT, ERROR_GENERIC } from '../configs/lang';

const DeadlineEditPage = () => {
  const { id } = useParams<typeof PARAM_ID>();

  if (!id) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  return (
    <>
      <Helmet>
        <title>
          {EDIT} {DEADLINE}
        </title>
      </Helmet>
      <Row>
        <Col md={12}>
          <DeadlineEdit deadlineId={id} />
        </Col>
      </Row>
    </>
  );
};

export { DeadlineEditPage };
