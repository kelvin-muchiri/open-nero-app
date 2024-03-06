import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, notification, Row, Upload, Space } from 'antd';
import { RcFile, UploadFile, UploadListType } from 'antd/lib/upload/interface';
import { ERROR_IMAGE_SIZE, UPLOAD } from '../../configs/lang';

export interface ImageUploadProps {
  handleUpload: (file: RcFile) => void;
  uploadInProgress?: boolean;
  showUploadList?: boolean;
  listType?: UploadListType;
  fileList?: UploadFile[];
  maxCount?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = (props: ImageUploadProps) => {
  const { handleUpload, uploadInProgress, showUploadList, listType, fileList, maxCount } = props;

  const beforeUpload = (file: RcFile) => {
    const isLt1M = file.size / 1024 / 1024 < 1;

    if (!isLt1M) {
      notification.error({ message: ERROR_IMAGE_SIZE });
      return false;
    }

    handleUpload(file);

    return false;
  };

  return (
    <Row justify="space-between">
      <Col span={20}>
        <Upload
          accept="image/*"
          listType={listType ?? 'picture-card'}
          showUploadList={!!showUploadList}
          beforeUpload={beforeUpload}
          fileList={fileList}
          maxCount={maxCount ?? 1}
        >
          <Space direction="vertical">
            {uploadInProgress ? <LoadingOutlined /> : <PlusOutlined />}
            <div>{UPLOAD}</div>
          </Space>
        </Upload>
      </Col>
    </Row>
  );
};

export { ImageUpload };
