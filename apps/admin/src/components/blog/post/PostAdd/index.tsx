import { PostMutationRequestData } from '@nero/query-api-service';
import { Button, Form, notification, Space, Steps } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_BLOG_POSTS, URL_EDIT_BLOG_POST } from '../../../../configs/constants';
import {
  LAYOUT,
  ERROR_GENERIC,
  BUTTON_LABEL_NEXT,
  PROCEED_TO_ADD_CONTENT,
  BUTTON_LABEL_PREVIOUS,
  TITLE,
  SEO,
} from '../../../../configs/lang';
import { useCreatePostMutation } from '../../../../services/api';
import { useAppDispatch } from '../../../../store/hooks';
import { reset } from '../../blogSlice';
import { PostFormValues } from '../PostForm';
import { Seo } from '../PostForm/Seo';
import { Title } from '../PostForm/Title';
import { Visibility } from '../PostForm/Visibility';
import { PostImageUploadImage } from '../PostImageUpload';

export type PostAddFormValues = Pick<
  PostFormValues,
  'title' | 'slug' | 'seo_title' | 'seo_description' | 'is_featured' | 'is_pinned'
>;

const PostAdd = () => {
  const [createPost] = useCreatePostMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<Partial<PostAddFormValues>>();
  const [featuredImage, setFeaturedImage] = useState<PostImageUploadImage | null>(null);

  useEffect(() => {
    // reset state if there is data
    dispatch(reset());
  }, [dispatch]);

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  // save to backend and redirect to edit page
  const add = useCallback(
    (data: PostMutationRequestData) => {
      createPost({
        url: ENDPOINT_BLOG_POSTS,
        data,
      })
        .unwrap()
        .then((post) => {
          navigate(`${URL_EDIT_BLOG_POST}/${post.slug}`);
        })
        .catch(() => {
          notification.error({ message: ERROR_GENERIC });
        });
    },
    [createPost, navigate]
  );

  const { Step } = Steps;
  const steps = [
    {
      title: TITLE,
      content: <Title />,
    },
    {
      title: SEO,
      content: <Seo />,
    },
    {
      title: LAYOUT,
      content: (
        <Visibility
          featuredImageUrl={featuredImage?.image}
          onFeaturedImageChange={(image) => {
            setFeaturedImage(image);
          }}
          onFeaturedImageRemove={() => {
            setFeaturedImage(null);
          }}
        />
      ),
    },
  ];
  const initialValues: PostAddFormValues = {
    slug: '',
    title: '',
    seo_title: '',
    seo_description: '',
    is_featured: false,
    is_pinned: false,
  };

  return (
    <Form<PostAddFormValues>
      layout="vertical"
      initialValues={initialValues}
      onFinish={(currentStepValues: Partial<PostAddFormValues>) => {
        const updated = {
          ...values,
          ...currentStepValues,
        };
        setValues(updated);

        if (currentStep === steps.length - 1) {
          const final = updated as PostAddFormValues;

          add({
            ...final,
            featured_image: featuredImage?.id,
            draft: [],
          });
        } else {
          next();
        }
      }}
    >
      <Steps size="small" current={currentStep}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[currentStep].content}</div>
      <div className="steps-action">
        <Space>
          <Button type="primary" htmlType="submit">
            {currentStep < steps.length - 1 ? BUTTON_LABEL_NEXT : PROCEED_TO_ADD_CONTENT}
          </Button>

          {currentStep > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              {BUTTON_LABEL_PREVIOUS}
            </Button>
          )}
        </Space>
      </div>
    </Form>
  );
};

export { PostAdd };
