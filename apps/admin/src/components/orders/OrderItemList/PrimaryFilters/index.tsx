import { Row, Col, Statistic, Card, Skeleton } from 'antd';
import './style.css';
import {
  COLOR_COMPLETE,
  COLOR_IN_PROGRESS,
  COLOR_VOID,
  ENDPOINT_ORDER_STATS,
} from '../../../../configs/constants';
import { useEffect, useState } from 'react';
import { ALL, COMPLETE, NEW, OVERDUE } from '../../../../configs/lang';
import {
  CheckCircleFilled,
  ExclamationCircleFilled,
  UnorderedListOutlined,
  WarningFilled,
} from '@ant-design/icons';
import { useGetOrderStatsQuery } from '../../../../services/api';

export type PrimaryFilterType = 'new' | 'overdue' | 'complete' | 'all';

export interface PrimaryFiltersProps {
  active?: PrimaryFilterType;
  onFilterSelected: (filterType: PrimaryFilterType) => void;
}

const PrimaryFilters: React.FC<PrimaryFiltersProps> = (props: PrimaryFiltersProps) => {
  const [isFocused, setFocused] = useState<PrimaryFilterType>();
  const [active, setActive] = useState<PrimaryFilterType>();
  const { data, isLoading } = useGetOrderStatsQuery(ENDPOINT_ORDER_STATS);

  const { onFilterSelected } = props;

  useEffect(() => {
    setActive(props.active);
  }, [props.active]);

  if (isLoading) {
    return <Skeleton active />;
  }

  if (!data) {
    return <div></div>;
  }

  const handleClick = (filterType: PrimaryFilterType) => {
    setActive(filterType);

    onFilterSelected(filterType);
  };

  return (
    <div className="order-statistic">
      <Row gutter={15}>
        <Col xs={24} sm={24} md={6}>
          <Card
            size="small"
            className="order-statistic__item-wrapper"
            onMouseEnter={() => setFocused('all')}
            onMouseLeave={() => setFocused(undefined)}
            onClick={() => handleClick('all')}
            style={{ borderColor: isFocused == 'all' || active == 'all' ? '#000' : '' }}
          >
            <Statistic
              className="order-statistic__item"
              title={ALL}
              value={data.all}
              valueStyle={{ color: '#000' }}
              prefix={<UnorderedListOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Card
            size="small"
            className="order-statistic__item-wrapper"
            onMouseEnter={() => setFocused('new')}
            onMouseLeave={() => setFocused(undefined)}
            onClick={() => handleClick('new')}
            style={{ borderColor: isFocused == 'new' || active == 'new' ? COLOR_IN_PROGRESS : '' }}
          >
            <Statistic
              className="order-statistic__item"
              title={NEW}
              value={data.new}
              valueStyle={{ color: COLOR_IN_PROGRESS }}
              prefix={<ExclamationCircleFilled />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Card
            size="small"
            className="order-statistic__item-wrapper"
            onMouseEnter={() => setFocused('overdue')}
            onMouseLeave={() => setFocused(undefined)}
            onClick={() => handleClick('overdue')}
            style={{ borderColor: isFocused == 'overdue' || active == 'overdue' ? COLOR_VOID : '' }}
          >
            <Statistic
              title={OVERDUE}
              value={data.overdue}
              valueStyle={{ color: COLOR_VOID }}
              prefix={<WarningFilled />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Card
            size="small"
            className="order-statistic__item-wrapper"
            onMouseEnter={() => setFocused('complete')}
            onMouseLeave={() => setFocused(undefined)}
            onClick={() => handleClick('complete')}
            style={{
              borderColor: isFocused == 'complete' || active == 'complete' ? COLOR_COMPLETE : '',
            }}
          >
            <Statistic
              title={COMPLETE}
              value={data.complete}
              valueStyle={{ color: COLOR_COMPLETE }}
              prefix={<CheckCircleFilled />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export { PrimaryFilters };
