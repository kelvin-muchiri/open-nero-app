import React from 'react';
import { Post } from '@nero/query-api-service';
import { renderBlocks } from '../DynamicPage/utils';

export interface DynamicPostProps {
  post: Post;
}

const DynamicPost: React.FC<DynamicPostProps> = (props: DynamicPostProps) => {
  const {
    post: { title, content, featured_image },
  } = props;

  return (
    <>
      <div className="nero-wrapper-960">
        {featured_image && (
          <img className="blog__featured-image" src={featured_image.image} alt={title} />
        )}
      </div>

      {renderBlocks(content)}
    </>
  );
};

export { DynamicPost };
