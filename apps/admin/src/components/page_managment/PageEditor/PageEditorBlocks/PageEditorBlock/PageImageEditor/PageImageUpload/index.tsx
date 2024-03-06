import { UploadOutlined } from '@ant-design/icons';
import { Button, Modal, notification } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { useState } from 'react';
import { ENDPOINT_PAGE_IMAGES } from '../../../../../../../configs/constants';
import { CLICK_TO_UPLOAD, ERROR_GENERIC, IMAGE } from '../../../../../../../configs/lang';
import {
  useCreateUploadedImageMutation,
  useGetUploadedImagesQuery,
} from '../../../../../../../services/api';
import { ImagePreview } from '../../../../../../ImagePreview';
import { ImageUploadChoice } from '../../../../../../ImageUploadChoice';

export interface PageImageUploadProps {
  previewUrl?: string;
  onRemove: () => void;
  onChange: (url: string) => void;
}

const PageImageUpload: React.FC<PageImageUploadProps> = (props: PageImageUploadProps) => {
  const [uploadChoiceVisible, setUploadChoiceVisible] = useState<boolean>(false);
  const { previewUrl, onRemove, onChange } = props;
  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false);
  const [uploadImage] = useCreateUploadedImageMutation();
  const [currentImageGalleryPage, setCurrentImageGalleryPage] = useState<number>(1);
  const { data: images } = useGetUploadedImagesQuery({
    url: ENDPOINT_PAGE_IMAGES,
    params: { page: currentImageGalleryPage },
  });

  const handleCancel = () => setUploadChoiceVisible(false);

  // upload image to api
  const handleImageUpload = (file: RcFile) => {
    setUploadInProgress(true);

    const fd = new FormData();
    fd.append('image', file);

    uploadImage({ url: ENDPOINT_PAGE_IMAGES, data: fd })
      .unwrap()
      .then((res) => {
        onChange(res.image);
      })
      .catch(() => {
        notification.error({ message: ERROR_GENERIC });
      })
      .finally(() => {
        setUploadInProgress(false);
      });
  };

  return (
    <>
      {previewUrl ? (
        <ImagePreview
          fileList={[
            {
              uid: '1',
              url: previewUrl,
              name: previewUrl.substring(previewUrl.lastIndexOf('/') + 1),
            },
          ]}
          onRemove={onRemove}
        />
      ) : (
        <>
          <Button
            icon={<UploadOutlined />}
            onClick={() => {
              setUploadChoiceVisible(true);
            }}
          >
            {CLICK_TO_UPLOAD}
          </Button>
          <Modal visible={uploadChoiceVisible} footer={null} title={IMAGE} onCancel={handleCancel}>
            <ImageUploadChoice
              uploadChoiceProps={{
                uploadInProgress,
                handleUpload: handleImageUpload,
              }}
              galleryChoiceProps={{
                items: images?.results || [],
                page: currentImageGalleryPage,
                total: images?.count || 0,
                pageSize: images?.page_size || 0,
                onPageChange: (page) => setCurrentImageGalleryPage(page),
                onSelect: (image) => {
                  onChange(image.image);
                },
              }}
            />
          </Modal>
        </>
      )}
    </>
  );
};

export { PageImageUpload };
