import { useEffect, useState } from 'react';
import {
  ImageEditor,
  ImageEditorProps,
} from '../../../../../../page_managment/PageEditor/PageEditorBlocks/PageEditorBlock/ImageEditor';
import { PostImageUpload } from '../../../../PostImageUpload';

export type PageImageEditorProps = Omit<ImageEditorProps, 'imageUpload'>;

const PostImageEditor: React.FC<PageImageEditorProps> = (props: PageImageEditorProps) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const { block, onBlockChanged } = props;

  useEffect(() => {
    setImageUrl(block.src);
  }, [block.src]);

  return (
    <ImageEditor
      {...props}
      onBlockChanged={(values) => {
        onBlockChanged({ ...values, src: imageUrl });
      }}
      imageUpload={
        <PostImageUpload
          previewUrl={imageUrl}
          onRemove={() => setImageUrl('')}
          onChange={(image) => setImageUrl(image.image)}
        />
      }
    />
  );
};

export { PostImageEditor };
