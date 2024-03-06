import { Modal, Upload } from 'antd';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import { useState } from 'react';

export interface ImagePreviewProps {
  fileList: UploadFile[];
  onRemove: (file: UploadFile) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = (props: ImagePreviewProps) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const { onRemove, fileList } = props;

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(file.name);
  };

  const handleCancel = () => setPreviewVisible(false);

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onPreview={handlePreview}
        onRemove={onRemove}
      />
      <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export { ImagePreview };
