import { Helmet } from 'react-helmet-async';
import { LevelList } from '../components/catalog/levels/LevelList';
import { LEVELS } from '../configs/lang';

const LevelListPage = () => {
  return (
    <>
      <Helmet>
        <title>{LEVELS}</title>
      </Helmet>
      <LevelList />
    </>
  );
};

export { LevelListPage };
