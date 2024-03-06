import { UploadOutlined } from '@ant-design/icons';
import { Button, Modal, notification, Tabs } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { useState } from 'react';
import { ENDPOINT_BLOG_IMAGES } from '../../../../configs/constants';
import {
  CLICK_TO_UPLOAD,
  ERROR_GENERIC,
  GALLERY,
  IMAGE,
  IMAGE_UPLOAD_CHOICE_TITLE,
  UPLOAD,
} from '../../../../configs/lang';
import { useCreateBlogImageMutation } from '../../../../services/api';
import { ImagePreview } from '../../../ImagePreview';
import { ImageUpload } from '../../../ImageUpload';
import { PostImageSelect } from '../PostImageSelect';

const { TabPane } = Tabs;

export interface PostImageUploadImage {
  id: string;
  image: string;
}

export interface PostImageUploadProps {
  previewUrl?: string;
  onRemove: () => void;
  onChange: (image: PostImageUploadImage) => void;
}

const PostImageUpload: React.FC<PostImageUploadProps> = (props: PostImageUploadProps) => {
  const [uploadChoiceVisible, setUploadChoiceVisible] = useState<boolean>(false);
  const { previewUrl, onRemove, onChange } = props;
  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false);
  const [uploadImage] = useCreateBlogImageMutation();

  const handleCancel = () => setUploadChoiceVisible(false);

  // upload image to api
  const handleImageUpload = (file: RcFile) => {
    setUploadInProgress(true);

    uploadImage({ url: ENDPOINT_BLOG_IMAGES, image: file })
      .unwrap()
      .then((res) => {
        onChange(res);
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
            <p>{IMAGE_UPLOAD_CHOICE_TITLE}</p>
            <Tabs defaultActiveKey="1">
              <TabPane tab={GALLERY} key="1">
                <PostImageSelect onChange={onChange} />
              </TabPane>
              <TabPane tab={UPLOAD} key="2">
                <ImageUpload uploadInProgress={uploadInProgress} handleUpload={handleImageUpload} />
              </TabPane>
            </Tabs>
          </Modal>
        </>
      )}
    </>
  );
};

export { PostImageUpload };
