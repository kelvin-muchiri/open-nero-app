import { Button, Form, Result, Space, Steps } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useState } from 'react';
import {
  ENDPOINT_COURSES,
  ENDPOINT_PAPERS,
  ENDPOINT_PAPER_FORMATS,
} from '../../../configs/constants';
import {
  BUTTON_LABEL_ADD_CART,
  BUTTON_LABEL_NEXT,
  BUTTON_LABEL_PREVIOUS,
  ERROR_GENERIC,
  ORDER_FORM_STEP_1,
  ORDER_FORM_STEP_2,
} from '../../../configs/lang';
import { CartItemRequestData, PaperListItem } from '@nero/query-api-service';
import {
  useGetCoursesQuery,
  useGetPaperFormatsQuery,
  useGetPapersQuery,
} from '../../../services/api';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { getDeadlineOptions } from '@nero/utils';

export enum Language {
  ENGLISH_UK = 1,
  ENGLISH_US = 2,
}

export interface OrderFormProps {
  initialValues?: OrderFormValues;
  onFinish: (values: CartItemRequestData) => void;
  onCalculatorInputChanged?: (
    pages: string | number,
    paperId?: string,
    levelId?: string,
    deadlineId?: string
  ) => void;
}

export interface OrderFormValues {
  paper: string | undefined;
  level?: string | undefined;
  deadline: string | undefined;
  course: string | undefined;
  pages: string | number;
  quantity: string | number;
  topic: string;
  references: string | number;
  format: string | undefined;
  comment: string;
  language: string | number | undefined;
}

// default form values
const defaultFormValues: OrderFormValues = {
  paper: undefined,
  level: undefined,
  deadline: undefined,
  course: undefined,
  pages: 1,
  quantity: 1,
  topic: '',
  references: '',
  format: undefined,
  comment: '',
  language: 1,
};

const OrderForm: React.FC<OrderFormProps> = (props: OrderFormProps) => {
  const [current, setCurrent] = useState(0);
  const [values, setValues] = useState<Partial<OrderFormValues>>();
  const {
    data: paperList,
    isLoading: paperLoading,
    error: paperError,
  } = useGetPapersQuery({ url: ENDPOINT_PAPERS, params: { service_only: true } });
  const { data: courseList, error: courseError } = useGetCoursesQuery(ENDPOINT_COURSES);
  const { data: formatList, error: formatFetchError } =
    useGetPaperFormatsQuery(ENDPOINT_PAPER_FORMATS);
  const [selectedPaper, setSelectedPaper] = useState<PaperListItem | undefined>(undefined);
  const [selectedLevelId, setSelectedLevelId] = useState<string | undefined>(undefined);
  const [form] = useForm();

  const { initialValues, onFinish, onCalculatorInputChanged } = props;
  const finalInitialValues = initialValues || defaultFormValues;

  useEffect(() => {
    const paper = paperList?.find((paper) => paper.id == finalInitialValues?.paper);
    setSelectedPaper(paper);
  }, [finalInitialValues?.paper, paperList]);

  useEffect(() => {
    setSelectedLevelId(finalInitialValues?.level);
  }, [finalInitialValues?.level]);

  if (paperError || courseError || formatFetchError) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const { Step } = Steps;

  const steps = [
    {
      title: ORDER_FORM_STEP_1,
      content: (
        <Step1
          paperList={paperList || []}
          paperListLoading={paperLoading}
          courseList={courseList || []}
          levelList={selectedPaper?.levels}
          deadlineList={selectedPaper ? getDeadlineOptions(selectedPaper, selectedLevelId) : []}
          onPaperChanged={(value) => {
            const paper = paperList?.find((paper) => paper.id == value);
            setSelectedPaper(paper);
            // papers can have different academic levels & deadlines, so
            // if paper changes, we reset level and deadline fields
            setSelectedLevelId(undefined);
            form.setFields([
              { name: 'level', value: undefined },
              { name: 'deadline', value: undefined },
            ]);
          }}
          onLevelChanged={(value) => {
            setSelectedLevelId(value);
          }}
        />
      ),
    },
    {
      title: ORDER_FORM_STEP_2,
      content: <Step2 formatList={formatList || []} />,
    },
  ];

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={finalInitialValues}
      onValuesChange={(_, allValues: Partial<OrderFormValues>) => {
        if (current == 0 && onCalculatorInputChanged) {
          const { paper, level, deadline, pages } = allValues;
          onCalculatorInputChanged(pages || 0, paper, level, deadline);
        }
      }}
      onFinish={(currentStepValues: Partial<OrderFormValues>) => {
        const updated = {
          ...values,
          ...currentStepValues,
        };

        setValues(updated);

        if (current === steps.length - 1) {
          const allValues = updated as OrderFormValues;
          const {
            topic,
            level,
            course,
            paper,
            format,
            deadline,
            language,
            pages,
            references,
            comment,
            quantity,
          } = allValues;
          onFinish({
            topic,
            level,
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            course: course as string,
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            paper: paper as string,
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            paper_format: format as string,
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            deadline: deadline as string,
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            language: language as string,
            pages,
            references,
            comment,
            quantity,
          });
        } else {
          next();
        }
      }}
    >
      <Steps size="small" current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        <Space>
          <Button type="primary" htmlType="submit">
            {current < steps.length - 1 ? BUTTON_LABEL_NEXT : BUTTON_LABEL_ADD_CART}
          </Button>

          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              {BUTTON_LABEL_PREVIOUS}
            </Button>
          )}
        </Space>
      </div>
    </Form>
  );
};

export { OrderForm };
