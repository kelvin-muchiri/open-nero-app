import { Helmet } from 'react-helmet-async';
import { ImageGallery } from '../components/page_managment/ImageGallery';
import { IMAGE_GALLERY } from '../configs/lang';

const PageImageGalleryPage = () => {
  return (
    <>
      <Helmet>
        <title>{IMAGE_GALLERY}</title>
      </Helmet>
      <ImageGallery />
    </>
  );
};
export { PageImageGalleryPage };
