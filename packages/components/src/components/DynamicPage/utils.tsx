// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Content } from '@nero/query-api-service';
import { createMarkup } from '@nero/utils';
import { ImageDisplay } from './ImageDisplay';
import { CollapseDisplay } from './CollapseDisplay';
import { GridDisplay } from './GridDisplay';
import { ButtonDisplay } from './ButtonDisplay';
import { Col, Row } from 'antd';
import { ImageWideDisplay } from './ImageWideDisplay';
import { ReviewsDisplay } from './ReviewsDisplay';

export const renderBlocks = (blocks: Content) => {
  return blocks.map((block, index) => (
    <div className="nero-content-block" key={index}>
      {block.type == 'text' && (
        <div className="nero-wrapper-960">
          <div
            className="nero-content-block__body"
            dangerouslySetInnerHTML={
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
              createMarkup(block.content)
            }
          />
        </div>
      )}
      {block.type == 'image' && block.wideWidth && <ImageWideDisplay image={block} />}
      {block.type == 'image' && !block.wideWidth && (
        <div className="nero-wrapper-960">
          <ImageDisplay image={block} />
        </div>
      )}
      {block.type == 'collapse' && (
        <div className="nero-wrapper-960">
          <CollapseDisplay collapse={block} />
        </div>
      )}
      {block.type == 'grid' && (
        <div className="nero-wrapper-960">
          <GridDisplay grid={block} />
        </div>
      )}
      {block.type == 'button' && (
        <Row justify="center">
          <Col sm={24} md={6}>
            <ButtonDisplay button={block} />
          </Col>
        </Row>
      )}
      {block.type == 'review' && (
        <div className="nero-wrapper-960">
          <ReviewsDisplay />
        </div>
      )}
    </div>
  ));
};
