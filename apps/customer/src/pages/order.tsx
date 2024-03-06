import { Row, Col, Statistic } from 'antd';
import { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useCalculatorHook } from '@nero/components';
import { AddOrder } from '../components/orders/AddOrder';
import { EditOrder } from '../components/orders/EditOrder';
import { PARAM_CART_ITEM_ID } from '../configs/constants';
import { PLACE_ORDER } from '../configs/lang';
import { queryService } from '../services/api';

const OrderPage = () => {
  const { itemId } = useParams<typeof PARAM_CART_ITEM_ID>();
  const [price, { setPages, setDeadline, setLevel, setPaper }] = useCalculatorHook(queryService);

  const onCalculatorInputChanged = useCallback(
    (pages: string | number, paperId?: string, levelId?: string, deadlineId?: string) => {
      setLevel(levelId);
      setDeadline(deadlineId);
      setPaper(paperId);
      setPages(pages);
    },
    [setDeadline, setLevel, setPaper, setPages]
  );

  return (
    <>
      <Helmet>
        <title>{PLACE_ORDER}</title>
      </Helmet>
      <Row justify="space-between">
        <Col md={8} xs={24}>
          {itemId ? (
            <EditOrder id={itemId} onCalculatorInputChanged={onCalculatorInputChanged} />
          ) : (
            <AddOrder onCalculatorInputChanged={onCalculatorInputChanged} />
          )}
        </Col>
        {price && (
          <Col md={8} xs={24}>
            <Statistic title="Price" value={`$${price.subtotal}`} />
          </Col>
        )}
      </Row>
    </>
  );
};

export { OrderPage as default };
