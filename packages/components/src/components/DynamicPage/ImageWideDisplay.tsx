// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Image as PageImage } from '@nero/query-api-service';
import { createMarkup } from '@nero/utils';

export interface ImageWideDisplayProps {
  image: PageImage;
}

const ImageWideDisplay: React.FC<ImageWideDisplayProps> = (props: ImageWideDisplayProps) => {
  const {
    image: { src, text },
  } = props;

  return (
    <div className="nero-image-wide" style={{ backgroundImage: `url(${src})` }}>
      <div className="nero-image-wide-overlay"></div>
      <div className="nero-image-wide-text">
        <div className="nero-wrapper-960">
          {text && (
            <div
              dangerouslySetInnerHTML={
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
                createMarkup(text)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export { ImageWideDisplay };
