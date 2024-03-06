import { Empty, Result, Skeleton } from 'antd';
import { useState } from 'react';
import { ENDPOINT_BLOG_IMAGES } from '../../../../configs/constants';
import { ERROR_GENERIC } from '../../../../configs/lang';
import { useGetBlogImagesQuery } from '../../../../services/api';
import {
  ImageGallerySelect,
  ImageGallerySelectItem,
  ImageGallerySelectProps,
} from '../../../ImageGallerySelect';

export interface PostImageSelectProps {
  onChange: (image: ImageGallerySelectItem) => void;
}

const PostImageSelect: React.FC<PostImageSelectProps> = (props: PostImageSelectProps) => {
  const [page, setPage] = useState<number>(1);
  const { data, error, isLoading } = useGetBlogImagesQuery({
    url: ENDPOINT_BLOG_IMAGES,
    params: { page },
  });

  if (isLoading) {
    return <Skeleton.Image active />;
  }

  if (error || !data) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  if (!data.results.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const { onChange } = props;

  const selectProps: ImageGallerySelectProps = {
    items: data.results,
    page,
    total: data.count,
    pageSize: data.page_size,
    onSelect: (image) => onChange(image),
    onPageChange: (page) => setPage(page),
  };

  return <ImageGallerySelect {...selectProps} />;
};

export { PostImageSelect };
