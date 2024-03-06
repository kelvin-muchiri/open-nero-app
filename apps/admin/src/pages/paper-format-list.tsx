import { Helmet } from 'react-helmet-async';
import { PaperFormatList } from '../components/catalog/paper_formats/PaperFormatList';
import { PAPER_FORMATS } from '../configs/lang';

const PaperFormatListPage = () => {
  return (
    <>
      <Helmet>
        <title>{PAPER_FORMATS}</title>
      </Helmet>
      <PaperFormatList />
    </>
  );
};

export { PaperFormatListPage };
