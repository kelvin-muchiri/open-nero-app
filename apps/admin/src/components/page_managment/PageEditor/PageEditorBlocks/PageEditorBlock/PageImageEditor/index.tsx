import { useEffect, useState } from 'react';
import { ImageEditor, ImageEditorProps } from '../ImageEditor';
import { PageImageUpload } from './PageImageUpload';

export type PageImageEditorProps = Omit<ImageEditorProps, 'imageUpload'>;

const PageImageEditor: React.FC<PageImageEditorProps> = (props: PageImageEditorProps) => {
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
        <PageImageUpload
          previewUrl={imageUrl}
          onRemove={() => setImageUrl('')}
          onChange={(url) => setImageUrl(url)}
        />
      }
    />
  );
};

export { PageImageEditor };
