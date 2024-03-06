import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  Checkbox,
  Input,
  Form,
  FormInstance,
  Row,
  Col,
  InputNumber,
  Typography,
  Tooltip,
} from 'antd';
import { EditorState } from 'draft-js';
import { useEffect, useState } from 'react';
import {
  ALTERNATIVE_TEXT,
  ALTERNATIVE_TEXT_HELP,
  WIDE_WIDTH,
  LINK_TO,
  LINK_TO_HELP,
  CAPTION,
  ERROR_URL_INVALID,
  WIDTH,
  HEIGHT,
  IMAGE_DIMENSIONS,
  BORDER_RADIUS,
  WIDE_WIDTH_HELP,
  TEXT_ON_IMAGE,
} from '../../../../../../../configs/lang';
import { ImageBlock } from '../../../../../pageSlice';
import { convertDraftJsToHTML, convertHTMLToDraftJs } from '../../GenericTextEditor/utils';
import { GenericTextEditor } from '../../GenericTextEditor';

const { Text } = Typography;

interface PageImageFormValues {
  alt: string;
  link_to: string;
  wide_width: boolean;
  caption: string;
  width: number | string;
  height: number | string;
  border_radius: number | string;
}

export interface PageImageFormProps {
  form: FormInstance;
  block: ImageBlock;
  showWideWidthCheck?: boolean;
  onSubmit: (values: ImageBlock) => void;
}

const PageImageForm: React.FC<PageImageFormProps> = (props: PageImageFormProps) => {
  const { onSubmit, form, block, showWideWidthCheck } = props;
  const [isWideWidth, setWideWidth] = useState<boolean>(false);
  const [textEditorState, setTextEditorState] = useState<EditorState>();

  useEffect(() => {
    setWideWidth(!!block.wideWidth);

    if (block.text) {
      setTextEditorState(convertHTMLToDraftJs(block.text));
    }
  }, [block]);

  // handle text editor change
  const handleTextChange = (editorState: EditorState) => {
    setTextEditorState(editorState);
  };

  const initialValues: PageImageFormValues = {
    alt: block.alt || '',
    link_to: block.linkTo || '',
    wide_width: !!block.wideWidth,
    caption: block.caption || '',
    width: block.width || 350,
    height: block.height || 300,
    border_radius: block.borderRadius || '',
  };

  return (
    <Form<PageImageFormValues>
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={(values) => {
        const { alt, link_to, wide_width, caption, width, height, border_radius } = values;

        onSubmit({
          ...block,
          alt,
          linkTo: link_to,
          wideWidth: wide_width,
          caption,
          width,
          height,
          borderRadius: border_radius,
          text: textEditorState ? convertDraftJsToHTML(textEditorState) : undefined,
        });
      }}
    >
      <Form.Item label={ALTERNATIVE_TEXT} name="alt" tooltip={ALTERNATIVE_TEXT_HELP}>
        <Input.TextArea rows={2} />
      </Form.Item>

      <Form.Item label={CAPTION} name="caption">
        <Input.TextArea rows={2} />
      </Form.Item>

      <Form.Item
        label={LINK_TO}
        name="link_to"
        tooltip={LINK_TO_HELP}
        rules={[{ type: 'url', message: ERROR_URL_INVALID }]}
      >
        <Input placeholder="e.g https://mywebsite.com/about-us" />
      </Form.Item>

      {showWideWidthCheck && (
        <Form.Item name="wide_width" valuePropName="checked">
          <Checkbox onChange={(e) => setWideWidth(e.target.checked)}>
            {WIDE_WIDTH}{' '}
            <Tooltip title={WIDE_WIDTH_HELP}>
              <QuestionCircleOutlined />
            </Tooltip>
          </Checkbox>
        </Form.Item>
      )}

      {isWideWidth && (
        <Form.Item label={TEXT_ON_IMAGE}>
          <GenericTextEditor
            editorClassName="image-settings__text-editor"
            editorState={textEditorState}
            onEditorStateChange={handleTextChange}
          />
        </Form.Item>
      )}

      {!isWideWidth && (
        <>
          <Form.Item label={IMAGE_DIMENSIONS}>
            <Row>
              <Col md={12}>
                <Form.Item label={<Text type="secondary">{WIDTH}</Text>} name="width">
                  <InputNumber min={200} />
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item label={<Text type="secondary">{HEIGHT}</Text>} name="height">
                  <InputNumber min={200} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </>
      )}

      <Form.Item label={BORDER_RADIUS} name="border_radius">
        <InputNumber min={0} />
      </Form.Item>
    </Form>
  );
};

export { PageImageForm };
