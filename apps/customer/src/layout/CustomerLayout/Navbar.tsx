import { MailOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Row, Col, Badge, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { ENDPOINT_CART, URL_CART, URL_ORDER_HISTORY } from '../../configs/constants';
import { useGetCartQuery } from '../../services/api';
import { useAppSelector } from '../../store/hooks';

const Navbar = () => {
  const { data } = useGetCartQuery(ENDPOINT_CART);
  const navigate = useNavigate();
  const { siteName, contactEmail } = useAppSelector((state) => state.config);

  return (
    <Row justify="space-between">
      <Col span={12}>
        <Row>
          <Col span={12}>
            <div className="logo">
              <Link to={URL_ORDER_HISTORY}>{siteName}</Link>
            </div>
          </Col>
          <Col span={12}>
            <Space>
              <MailOutlined />
              <span>{contactEmail}</span>
            </Space>
          </Col>
        </Row>
      </Col>

      <Col span={2}>
        <Badge
          count={data?.cart?.items.length}
          offset={[4, 3]}
          size="small"
          style={{ float: 'right' }}
        >
          <ShoppingCartOutlined
            style={{ fontSize: 24 }}
            onClick={() => {
              navigate(URL_CART);
            }}
          />
        </Badge>
      </Col>
    </Row>
  );
};

export { Navbar };
