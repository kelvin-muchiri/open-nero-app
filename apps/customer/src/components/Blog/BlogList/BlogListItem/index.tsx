import { FileWordOutlined } from '@ant-design/icons';
import { PostListItem } from '@nero/query-api-service';
import { Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { useGetURLBlog } from '../../../../helpers/hooks';

export interface BlogListItemProps {
  item: PostListItem;
}

const BlogListItem: React.FC<BlogListItemProps> = (props: BlogListItemProps) => {
  const urlBlog = useGetURLBlog();

  const {
    item: { featured_image, title, seo_description, slug },
  } = props;

  return (
    <Row gutter={20}>
      <Col className="nero-image-default" xs={6} md={5}>
        {featured_image ? (
          <Link to={`${urlBlog}/${slug}`}>
            <img className="blog-list__item-image" src={featured_image.image} alt={title} />
          </Link>
        ) : (
          <Link to={`${urlBlog}/${slug}`}>
            <div className="blog-list__item-image blog-list__item-image-placeholder nero-content-bg">
              <FileWordOutlined />
            </div>
          </Link>
        )}
      </Col>

      <Col xs={18} md={19}>
        <Link to={`${urlBlog}/${slug}`}>
          <h2 className="blog-list__item-title">{title}</h2>
        </Link>
        <p>{seo_description}</p>
      </Col>
    </Row>
  );
};

export { BlogListItem };
