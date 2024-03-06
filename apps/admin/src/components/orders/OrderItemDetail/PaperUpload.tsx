import { UploadOutlined } from '@ant-design/icons';
import { Space, Input, Upload, Button, notification } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { useState } from 'react';
import { ENDPOINT_PAPER_FILES } from '../../../configs/constants';
import {
  ERROR_GENERIC,
  SUCCESS_GENERIC,
  LOADING,
  START_UPLOAD,
  CHOOSE_FILE,
} from '../../../configs/lang';
import { apiService } from '../../../services/api';

export interface PaperUploadProps {
  orderItemId: string | number;
  onUploadSuccess?: () => void;
}

const PaperUpload: React.FC<PaperUploadProps> = (props: PaperUploadProps) => {
  const [comment, setComment] = useState<string>('');
  const [file, setFile] = useState<RcFile>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { orderItemId, onUploadSuccess } = props;

  const handleUpload = () => {
    if (!file) {
      return;
    }

    const fd = new FormData();
    fd.append('paper', file);
    fd.append('order_item', orderItemId.toString());
    fd.append('comment', comment);

    setLoading(true);
    apiService
      .getAxiosInstance()
      .post(ENDPOINT_PAPER_FILES, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        setFile(undefined);
        setComment('');
        notification.success({ message: SUCCESS_GENERIC });

        if (onUploadSuccess) {
          onUploadSuccess();
        }
      })
      .catch(() => {
        notification.error({ message: ERROR_GENERIC });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Upload
        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onRemove={() => setFile(undefined)}
        fileList={file ? [file] : []}
        beforeUpload={(file) => {
          setFile(file);
          return false;
        }}
      >
        <Button icon={<UploadOutlined />}>{CHOOSE_FILE}</Button>
      </Upload>

      <Input.TextArea
        placeholder="Comment (optional)"
        rows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <Button type="primary" onClick={handleUpload} disabled={!file}>
        {isLoading ? LOADING : START_UPLOAD}
      </Button>
    </Space>
  );
};

export { PaperUpload };
