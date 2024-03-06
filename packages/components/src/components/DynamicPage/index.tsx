import { Button, Card, Col, Divider, Row, Spin } from 'antd';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { lazy, Suspense } from 'react';
import { neroAPIQuery, Page } from '@nero/query-api-service';
import { useNavigate } from 'react-router-dom';
import { CALCULATE_PRICE, ORDER_NOW } from '../../lang';
import { renderBlocks } from './utils';

const Calculator = lazy(() => import('../Calculator'));

export interface DynamicPageProps {
  page: Page;
  neroQuery: ReturnType<typeof neroAPIQuery>;
  loginURL: string;
}

const DynamicPage: React.FC<DynamicPageProps> = (props: DynamicPageProps) => {
  const navigate = useNavigate();
  const { page, neroQuery, loginURL } = props;
  const landingPage = page.metadata.landing_page;

  return (
    <>
      {landingPage && page.metadata.is_home && (
        <div
          className="landing-page"
          style={
            landingPage?.backgroundImageUrl
              ? {
                  background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${landingPage.backgroundImageUrl}) no-repeat center center fixed`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: '#F2F7FF',
                }
              : undefined
          }
        >
          {!landingPage?.backgroundImageUrl && <div className="landing-page__overlay"></div>}

          <div className="nero-wrapper-960 pt-30">
            <Row>
              <Col xs={24} md={landingPage?.displayCalculator ? 14 : 24}>
                <h1
                  className="landing-page__title"
                  style={{ color: landingPage?.backgroundImageUrl ? '#F2F7FF' : '' }}
                >
                  {landingPage?.title}
                </h1>

                <p style={{ color: landingPage?.backgroundImageUrl ? '#F2F7FF' : '' }}>
                  {landingPage?.subtitle}
                </p>

                <Button
                  className="nero-btn-cta"
                  size="large"
                  type="primary"
                  onClick={() => {
                    navigate(loginURL);
                  }}
                >
                  {landingPage?.buttonLabel || ORDER_NOW}
                </Button>
              </Col>

              {landingPage?.displayCalculator && (
                <Col xs={24} md={10}>
                  <Card bordered={true} className="landing-page__calculator">
                    <Divider>
                      <span className="landing-page__calculator-title">{CALCULATE_PRICE}</span>
                    </Divider>
                    <Suspense fallback={<Spin />}>
                      <Calculator neroQuery={neroQuery} orderNowURL={loginURL} />
                    </Suspense>
                  </Card>
                </Col>
              )}
            </Row>
          </div>
        </div>
      )}

      {renderBlocks(page.blocks)}
    </>
  );
};

export { DynamicPage };
