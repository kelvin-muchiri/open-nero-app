import { Empty, Pagination } from 'antd';
import './style.css';

export interface ImageGallerySelectItem {
  id: string;
  image: string;
  name: string;
}

export interface ImageGallerySelectProps {
  items: ImageGallerySelectItem[];
  page: number;
  total: number;
  pageSize: number;
  onSelect: (image: ImageGallerySelectItem) => void;
  onPageChange: (page: number) => void;
}

const ImageGallerySelect: React.FC<ImageGallerySelectProps> = (props: ImageGallerySelectProps) => {
  const { items, page, total, pageSize, onSelect, onPageChange } = props;

  if (!items.length) {
    return <Empty />;
  }

  return (
    <div className="image-gallery-select">
      {items.map((image) => (
        <div
          className="image-gallery-select__image-container"
          key={image.id}
          onClick={() => onSelect(image)}
        >
          <div className="image-gallery-select__list-item">
            <div className="image-gallery-select__list-item-info">
              <div className="image-gallery-select__list-item-span">
                <div className="image-gallery-select__list-item-thumbnail">
                  <img className="" src={image.image} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={(page) => {
          onPageChange(page);
        }}
      />
    </div>
  );
};

export { ImageGallerySelect };
