import { Form, InputNumber, Select } from 'antd';
import {
  ERROR_COURSE_REQUIRED,
  ERROR_DEADLINE_REQUIRED,
  ERROR_LEVEL_REQUIRED,
  ERROR_PAGES_REQUIRED,
  ERROR_PAPER_REQUIRED,
  ERROR_QUANTITY_REQUIRED,
  INPUT_HINT_SELECT,
  INPUT_LABEL_COURSE,
  INPUT_LABEL_DEADLINE,
  INPUT_LABEL_LEVEL,
  INPUT_LABEL_PAGES,
  INPUT_LABEL_QUANTITY,
  PAPER,
} from '../../../../configs/lang';
import {
  GenericCatalogListItem,
  PaperListItem,
  PaperListItemDeadline,
  PaperListItemLevel,
} from '@nero/query-api-service';

export interface Step1Props {
  onPaperChanged: (value: string) => void;
  onLevelChanged: (value: string) => void;
  paperList: PaperListItem[];
  paperListLoading?: boolean;
  levelList?: PaperListItemLevel[];
  deadlineList: PaperListItemDeadline[];
  courseList: GenericCatalogListItem[];
}

const Step1: React.FC<Step1Props> = (props: Step1Props) => {
  const {
    onPaperChanged,
    onLevelChanged,
    paperList,
    paperListLoading,
    levelList,
    deadlineList,
    courseList,
  } = props;

  return (
    <>
      <Form.Item
        name="paper"
        label={PAPER}
        rules={[{ required: true, message: ERROR_PAPER_REQUIRED }]}
      >
        <Select
          placeholder={INPUT_HINT_SELECT}
          loading={paperListLoading}
          onChange={(value: string) => {
            onPaperChanged(value);
          }}
        >
          {paperList?.map((paper) => (
            <Select.Option key={paper.id} value={paper.id}>
              {paper.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {!!levelList?.length && (
        <Form.Item
          name="level"
          label={INPUT_LABEL_LEVEL}
          dependencies={['paper']}
          rules={[{ required: true, message: ERROR_LEVEL_REQUIRED }]}
        >
          <Select
            placeholder={INPUT_HINT_SELECT}
            onChange={(value: string) => {
              onLevelChanged(value);
            }}
          >
            {levelList.map((level) => (
              <Select.Option key={level.id} value={level.id}>
                {level.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}

      <Form.Item
        name="deadline"
        label={INPUT_LABEL_DEADLINE}
        dependencies={['paper']}
        rules={[{ required: true, message: ERROR_DEADLINE_REQUIRED }]}
      >
        <Select placeholder={INPUT_HINT_SELECT} disabled={!deadlineList.length}>
          {deadlineList.map((option) => (
            <Select.Option key={option.id} value={option.id}>
              {option.full_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="pages"
        label={INPUT_LABEL_PAGES}
        rules={[{ required: true, message: ERROR_PAGES_REQUIRED }]}
      >
        <InputNumber min={1} max={1000} />
      </Form.Item>

      <Form.Item
        name="quantity"
        label={INPUT_LABEL_QUANTITY}
        rules={[{ required: true, message: ERROR_QUANTITY_REQUIRED }]}
      >
        <InputNumber min={1} max={3} />
      </Form.Item>

      <Form.Item
        name="course"
        label={INPUT_LABEL_COURSE}
        rules={[{ required: true, message: ERROR_COURSE_REQUIRED }]}
      >
        <Select placeholder={INPUT_HINT_SELECT}>
          {courseList?.map((course) => (
            <Select.Option key={course.id} value={course.id}>
              {course.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};

export { Step1 };
