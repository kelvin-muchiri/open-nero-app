import { Tabs } from 'antd';
import { GALLERY, IMAGE_UPLOAD_CHOICE_TITLE, UPLOAD } from '../../configs/lang';
import { ImageUpload, ImageUploadProps } from '../ImageUpload';
import { ImageGallerySelect, ImageGallerySelectProps } from '../ImageGallerySelect';

const { TabPane } = Tabs;

export interface ImageUploadChoiceProps {
  uploadChoiceProps: ImageUploadProps;
  galleryChoiceProps: ImageGallerySelectProps;
}

const ImageUploadChoice: React.FC<ImageUploadChoiceProps> = (props: ImageUploadChoiceProps) => {
  const { uploadChoiceProps, galleryChoiceProps } = props;

  return (
    <>
      <p>{IMAGE_UPLOAD_CHOICE_TITLE}</p>
      <Tabs defaultActiveKey="1">
        <TabPane tab={GALLERY} key="1">
          <ImageGallerySelect {...galleryChoiceProps} />
        </TabPane>
        <TabPane tab={UPLOAD} key="2">
          <ImageUpload {...uploadChoiceProps} />
        </TabPane>
      </Tabs>
    </>
  );
};

export { ImageUploadChoice };
