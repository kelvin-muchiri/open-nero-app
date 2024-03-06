import {
  Row,
  Col,
  Radio,
  Result,
  Skeleton,
  Typography,
  Button,
  Space,
  Alert,
  notification,
  Popconfirm,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ENDPOINT_DEADLINES,
  ENDPOINT_LEVELS,
  ENDPOINT_PAPERS,
  ENDPOINT_SERVICES,
  ENDPOINT_SERVICES_CREATE_BULK,
  ENDPOINT_SERVICES_DELETE_BULK,
  URL_PAPERS,
} from '../../../../configs/constants';
import {
  DELETE,
  ERROR_GENERIC,
  LOADING,
  NO,
  PAPER_HAS_LEVELS,
  POPUP_CANCEL,
  POPUP_DELETE,
  POPUP_OK,
  PRICING_HEADER_PREFIX,
  PRICING_INFO,
  SAVE,
  SUCCESS_GENERIC,
  YES,
} from '../../../../configs/lang';
import { PaperListItem } from '@nero/query-api-service';
import { AmountInput } from './AmountInput';
import {
  apiService,
  useGetDeadlinesQuery,
  useGetLevelsQuery,
  useGetPapersQuery,
} from '../../../../services/api';

const { Title } = Typography;

export interface PricingProps {
  paperId: string;
}

export interface Price {
  deadlineId: string;
  levelId?: string | null;
  amount: string | number;
}

interface ServiceListItem {
  level?: string | null;
  deadline: string;
  paper: string;
  amount: string;
}

const Pricing: React.FC<PricingProps> = (props: PricingProps) => {
  const {
    data: paperList,
    isLoading: papersLoading,
    refetch: refetchPapers,
  } = useGetPapersQuery({
    url: `${ENDPOINT_PAPERS}no-cache/`,
  });
  const { data: levelList, isLoading: levelsLoading } = useGetLevelsQuery(ENDPOINT_LEVELS);
  const { data: deadlineList, isLoading: deadlinesLoading } = useGetDeadlinesQuery({
    url: ENDPOINT_DEADLINES,
  });
  const [prices, setPrices] = useState<Price[]>();
  const [paper, setPaper] = useState<PaperListItem>();
  const [hasLevels, setHasLevels] = useState<boolean>();
  const [enableEdit, setEnableEdit] = useState<boolean>(false);
  const [servicesFailed, setServicesFailed] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);
  const [isDeleting, setDeleting] = useState<boolean>(false);
  const navigate = useNavigate();

  const { paperId } = props;

  useEffect(() => {
    if (!paperList) {
      return;
    }

    const paper = paperList.find((paper) => paper.id == paperId);

    setPaper(paper);
  }, [paperId, paperList]);

  useEffect(() => {
    if (paper && paper.levels.length) {
      setHasLevels(true);
    }

    if (paper && (paper.deadlines.length || paper.levels.length)) {
      setEnableEdit(true);

      apiService
        .getAxiosInstance()
        .get<ServiceListItem[]>(ENDPOINT_SERVICES, { params: { paper: paper.id } })
        .then((res) => {
          setPrices(
            res.data.map((item) => {
              return {
                deadlineId: item.deadline,
                levelId: item.level,
                amount: item.amount,
              };
            })
          );
        })
        .catch(() => {
          setServicesFailed(true);
        });
    }
  }, [paper]);

  if (papersLoading) {
    return <Skeleton active />;
  } else if (!paperList) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  if (levelsLoading) {
    return <Skeleton active />;
  } else if (!levelList) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  if (deadlinesLoading) {
    return <Skeleton active />;
  } else if (!deadlineList) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  if (!paper || servicesFailed) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  if (!enableEdit) {
    return (
      <div className="orphan-form-item">
        <Title level={3}> Set pricing for {paper.name}</Title>
        <label>
          <span>{PAPER_HAS_LEVELS}</span>
          <Radio.Group
            onChange={(e) => {
              setHasLevels(e.target.value as boolean);
              setEnableEdit(true);
            }}
            value={hasLevels}
          >
            <Radio.Button value={true}>{YES}</Radio.Button>
            <Radio.Button value={false}>{NO}</Radio.Button>
          </Radio.Group>
        </label>
      </div>
    );
  }

  const getPrice = (deadlineId: string, levelId?: string | null): string | number | undefined => {
    const price = prices?.find(
      (price) => price.levelId == levelId && price.deadlineId == deadlineId
    );

    return price?.amount;
  };

  const setPrice = (deadlineId: string, amount: string | number, levelId?: string | null): void => {
    const updated = prices ? [...prices] : [];

    const price = updated.find(
      (price) => price.levelId == levelId && price.deadlineId == deadlineId
    );

    if (!price) {
      updated.push({
        deadlineId,
        levelId,
        amount,
      });
    } else {
      price.amount = amount;
    }

    setPrices(updated);
  };

  const handleSave = () => {
    setSaving(true);

    apiService
      .getAxiosInstance()
      .post(ENDPOINT_SERVICES_CREATE_BULK, {
        paper_id: paper.id,
        prices: prices
          ?.filter((price) => price.amount) // we do filter where prices are null
          .map((price) => {
            return {
              deadline_id: price.deadlineId,
              level_id: price.levelId,
              amount: price.amount,
            };
          }),
      })
      .then(() => {
        handleSuccess();
      })
      .catch(() => {
        notification.error({ message: ERROR_GENERIC });
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleSuccess = () => {
    refetchPapers();
    notification.success({ message: SUCCESS_GENERIC });
    navigate(URL_PAPERS);
  };

  const handleDelete = () => {
    setDeleting(true);

    apiService
      .getAxiosInstance()
      .post(ENDPOINT_SERVICES_DELETE_BULK, {
        paper_id: paper.id,
      })
      .then(() => {
        handleSuccess();
      })
      .catch(() => {
        notification.error({ message: ERROR_GENERIC });
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  return (
    <div className="pricing">
      <Row justify="space-between" className="admin-table-header">
        <Col span={24} md={20}>
          <Title level={3}>
            {PRICING_HEADER_PREFIX} {paper.name}
          </Title>
        </Col>
        <Col xs={24} md={4}>
          <Space size="small" className="admin-table-header-actions">
            <Button disabled={!prices || isSaving} type="primary" onClick={handleSave}>
              {isSaving ? LOADING : SAVE}
            </Button>

            <Popconfirm
              title={POPUP_DELETE}
              onConfirm={handleDelete}
              okText={POPUP_OK}
              cancelText={POPUP_CANCEL}
              placement="bottomLeft"
              disabled={isDeleting}
            >
              <Button danger type="default">
                {isDeleting ? LOADING : DELETE}
              </Button>
            </Popconfirm>
          </Space>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Alert type="info" message={PRICING_INFO} closable />
        </Col>
      </Row>

      {hasLevels && (
        <div className="nero-table-responsive">
          <table className="pricing__table">
            <tr>
              <th></th>
              {levelList.map((level) => (
                <th key={level.id}>{level.name}</th>
              ))}
            </tr>

            {deadlineList.map((deadline) => (
              <tr key={deadline.id}>
                <th>{deadline.full_name}</th>

                {levelList.map((level) => (
                  <td key={level.id}>
                    <AmountInput
                      value={getPrice(deadline.id, level.id)}
                      onChange={(value) => setPrice(deadline.id, value, level.id)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </table>
        </div>
      )}

      {!hasLevels && (
        <div className="pricing__list">
          {deadlineList.map((deadline) => (
            <Row justify="space-between" key={deadline.id} className="pricing__list_item">
              <Col md={6}>
                <label>{deadline.full_name}</label>
              </Col>
              <Col md={6}>
                <AmountInput
                  value={getPrice(deadline.id)}
                  onChange={(value) => setPrice(deadline.id, value)}
                />
              </Col>
            </Row>
          ))}
        </div>
      )}
    </div>
  );
};

export { Pricing };
