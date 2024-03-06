import { Grid } from '@nero/query-api-service';
import { Col, Row } from 'antd';
import React from 'react';
import { ImageDisplay } from './ImageDisplay';
import { createMarkup } from '@nero/utils';
import { CollapseDisplay } from './CollapseDisplay';
import { ButtonDisplay } from './ButtonDisplay';

export interface GridDisplayProps {
  grid: Grid;
}

const GridDisplay: React.FC<GridDisplayProps> = (props: GridDisplayProps) => {
  const { grid } = props;

  return (
    <Row justify="space-between" className="grid-component">
      {grid.children.map((child, childIndex) => (
        <Col key={childIndex} md={11} sm={24} className="grid-component__item">
          {child && child.type == 'text' && (
            <div
              className="nero-content-block__body"
              dangerouslySetInnerHTML={
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
                createMarkup(child.content)
              }
            />
          )}
          {child?.type == 'image' && <ImageDisplay image={child} />}
          {child?.type == 'collapse' && <CollapseDisplay collapse={child} />}
          {child?.type == 'button' && <ButtonDisplay button={child} />}
        </Col>
      ))}
    </Row>
  );
};

export { GridDisplay };
