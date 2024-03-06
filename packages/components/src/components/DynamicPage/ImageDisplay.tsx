// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Image as PageImage } from '@nero/query-api-service';
import { Image } from 'antd';

export interface ImageDisplayProps {
  image: PageImage;
}

const ImageDisplay: React.FC<ImageDisplayProps> = (props: ImageDisplayProps) => {
  const { image } = props;
  const { width, height, src, caption, borderRadius, alt } = image;

  return (
    <div className="nero-image-default">
      <Image
        style={{ maxWidth: width || 350, maxHeight: height || 200, borderRadius }}
        src={src}
        alt={alt}
        preview={false}
        loading="lazy"
      />
      <figcaption>{caption}</figcaption>
    </div>
  );
};

export { ImageDisplay };
