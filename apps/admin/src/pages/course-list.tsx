import { Helmet } from 'react-helmet-async';
import { CourseList } from '../components/catalog/courses/CourseList';
import { COURSES } from '../configs/lang';

const CourseListPage = () => {
  return (
    <>
      <Helmet>
        <title>{COURSES}</title>
      </Helmet>
      <CourseList />
    </>
  );
};

export { CourseListPage };
