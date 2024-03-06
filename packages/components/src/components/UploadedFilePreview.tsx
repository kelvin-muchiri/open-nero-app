// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { PaperClipOutlined } from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';

const { Text } = Typography;

export interface UploadedFilePreviewProps {
  onDownload: () => void;
  fileName: string;
  comment?: string;
}

const UploadedFilePreview: React.FC<UploadedFilePreviewProps> = (
  props: UploadedFilePreviewProps
) => {
  const { onDownload, fileName, comment } = props;

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button
        style={{ padding: 0 }}
        icon={<PaperClipOutlined />}
        type="link"
        size="small"
        onClick={onDownload}
      >
        {fileName}
      </Button>

      <Text type="secondary">{comment}</Text>
    </Space>
  );
};

export { UploadedFilePreview };
