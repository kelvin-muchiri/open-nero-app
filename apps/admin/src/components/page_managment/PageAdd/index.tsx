import { Button, Form, notification, Space, Steps } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_PAGES, URL_EDIT_PAGE } from '../../../configs/constants';
import {
  PROCEED_TO_ADD_CONTENT,
  TITLE,
  SEO,
  LAYOUT,
  BUTTON_LABEL_NEXT,
  BUTTON_LABEL_PREVIOUS,
  ERROR_GENERIC,
} from '../../../configs/lang';
import { PageRequestData } from '@nero/query-api-service';
import { PageSettingsFormValues } from '../PageSettings';
import { Layout } from '../PageSettings/layout';
import { Seo } from '../PageSettings/seo';
import { Title } from '../PageSettings/title';
import { reset } from '../pageSlice';
import { useCreatePageMutation } from '../../../services/api';
import { useAppDispatch } from '../../../store/hooks';

export type AddPageFormValues = Omit<PageSettingsFormValues, 'is_public'>;

const AddPage = () => {
  const [createPage] = useCreatePageMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<Partial<AddPageFormValues>>();
  const [isHome, setHome] = useState<boolean>(false);
  const [displayLandingPage, setDisplayLandingPage] = useState<boolean>(false);
  const [landingPageBgImageUrl, setLandingPageBgmageUrl] = useState<string>();

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
    (data: PageRequestData) => {
      createPage({
        url: ENDPOINT_PAGES,
        data,
      })
        .unwrap()
        .then((page) => {
          navigate(`${URL_EDIT_PAGE}/${page.id}`);
        })
        .catch(() => {
          notification.error({ message: ERROR_GENERIC });
        });
    },
    [createPage, navigate]
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
        <Layout
          isHome={isHome}
          displayLandingPage={displayLandingPage}
          onIsHomeChange={(value) => setHome(value)}
          onDisplayLandingPageChange={(value) => setDisplayLandingPage(value)}
          onLandingPageBgImageChange={(url) => setLandingPageBgmageUrl(url)}
          landingPageBgImageUrl={landingPageBgImageUrl}
        />
      ),
    },
  ];

  const initialValues: AddPageFormValues = {
    slug: '',
    title: '',
    seo_title: '',
    seo_description: '',
    is_home: false,
    display_landing_page: false,
    landing_page_title: '',
    landing_page_subtitle: '',
    landing_page_button_label: '',
    landing_page_display_calculator: false,
  };

  return (
    <Form
      layout="vertical"
      initialValues={initialValues}
      onFinish={(currentStepValues: Partial<AddPageFormValues>) => {
        const updated = {
          ...values,
          ...currentStepValues,
        };
        setValues(updated);

        if (currentStep === steps.length - 1) {
          const final = updated as AddPageFormValues;
          const {
            title,
            seo_title,
            seo_description,
            slug,
            is_home,
            landing_page_title,
            landing_page_subtitle,
            landing_page_button_label,
            landing_page_display_calculator,
            display_landing_page,
          } = final;

          add({
            title,
            seo_title,
            seo_description,
            slug,
            is_public: false,
            metadata: {
              is_home,
              landing_page:
                is_home && display_landing_page
                  ? {
                      title: landing_page_title,
                      subtitle: landing_page_subtitle,
                      buttonLabel: landing_page_button_label,
                      displayCalculator: landing_page_display_calculator,
                      backgroundImageUrl: landingPageBgImageUrl,
                    }
                  : null,
            },
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

export { AddPage };
