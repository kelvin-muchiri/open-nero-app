// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Form, InputNumber, Select, Space, Typography, Button } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useState } from 'react';
//import './style.css';
import { ENDPOINT_PAPERS } from '../../constants';
import {
  INPUT_HINT_SELECT,
  INPUT_LABEL_DEADLINE,
  INPUT_LABEL_LEVEL,
  INPUT_LABEL_PAGES,
  ORDER_NOW,
  PAPER,
  TOTAL_PRICE,
} from '../../lang';
import { useCalculatorHook } from './hooks';
import { neroAPIQuery, PaperListItem } from '@nero/query-api-service';
import { getDeadlineOptions } from '@nero/utils';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export interface CalculatorProps {
  neroQuery: ReturnType<typeof neroAPIQuery>;
  orderNowURL: string;
}

const Calculator: React.FC<CalculatorProps> = (props: CalculatorProps) => {
  const { neroQuery, orderNowURL } = props;
  const [price, { setPages, setDeadline, setLevel, setPaper }] = useCalculatorHook(neroQuery);
  const { useGetPapersQuery } = neroQuery;
  const { data: paperList, isLoading: paperLoading } = useGetPapersQuery({
    url: ENDPOINT_PAPERS,
    params: { service_only: true },
    withCredentials: false,
    headers: { 'X-Ignore-Credentials': true },
  });
  const [selectedPaper, setSelectedPaper] = useState<PaperListItem | undefined>(undefined);
  const [selectedLevelId, setSelectedLevelId] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const [form] = useForm();

  const deadlineOptions = useCallback(
    () => (selectedPaper ? getDeadlineOptions(selectedPaper, selectedLevelId) : []),
    [selectedPaper, selectedLevelId]
  );

  if (!paperList) {
    return <div></div>;
  }

  const handlePaperChange = (value: string) => {
    const paper = paperList?.find((paper) => paper.id == value);
    setSelectedPaper(paper);
    // papers can have different academic levels & deadlines, so
    // if paper changes, we reset level and deadline fields
    setSelectedLevelId(undefined);
    form.setFields([
      { name: 'level', value: undefined },
      { name: 'deadline', value: undefined },
    ]);
    setPaper(value);
    setLevel(undefined);
    setDeadline(undefined);
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevelId(value);
    setLevel(value);
  };

  const handleDeadlineChange = (value: string) => {
    setDeadline(value);
  };

  const handlePagesChange = (value: number) => {
    setPages(value);
  };

  return (
    <Form form={form} layout="vertical" className="calculator-form">
      <Form.Item name="paper" label={PAPER}>
        <Select placeholder={INPUT_HINT_SELECT} loading={paperLoading} onChange={handlePaperChange}>
          {paperList?.map((paper) => (
            <Select.Option key={paper.id} value={paper.id}>
              {paper.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {!!selectedPaper?.levels?.length && (
        <Form.Item name="level" label={INPUT_LABEL_LEVEL} dependencies={['paper']}>
          <Select placeholder={INPUT_HINT_SELECT} onChange={handleLevelChange}>
            {selectedPaper.levels.map((level) => (
              <Select.Option key={level.id} value={level.id}>
                {level.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}

      <Form.Item name="deadline" label={INPUT_LABEL_DEADLINE} dependencies={['paper']}>
        <Select
          placeholder={INPUT_HINT_SELECT}
          disabled={!deadlineOptions().length}
          onChange={handleDeadlineChange}
        >
          {deadlineOptions().map((option) => (
            <Select.Option key={option.id} value={option.id}>
              {option.full_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="pages" label={INPUT_LABEL_PAGES}>
        <InputNumber min={1} max={1000} onChange={handlePagesChange} />
      </Form.Item>

      {price && (
        <Space direction="vertical" size={2} style={{ width: '100%' }}>
          <div>
            <span className="calculator-form__result">
              {TOTAL_PRICE}: ${price.total}
            </span>{' '}
            {price.coupon_code && (
              <span>
                use coupon <span className="calculator-form__coupon-code">{price.coupon_code}</span>
              </span>
            )}
          </div>

          {price.coupon_code && (
            <Text type="secondary">
              was{' '}
              <Text type="secondary" delete>
                ${price.subtotal}
              </Text>
            </Text>
          )}
          <Button
            type="primary"
            block
            size="large"
            className="nero-btn-cta"
            onClick={() => navigate(orderNowURL)}
          >
            {ORDER_NOW}
          </Button>
        </Space>
      )}
    </Form>
  );
};

export { Calculator as default };
