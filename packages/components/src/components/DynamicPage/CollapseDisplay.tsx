// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Collapse as NeroCollapse } from '@nero/query-api-service';
import { Collapse } from 'antd';
import { createMarkup } from '@nero/utils';

const { Panel } = Collapse;

export interface CollapseProps {
  collapse: NeroCollapse;
}

const CollapseDisplay: React.FC<CollapseProps> = (props: CollapseProps) => {
  const {
    collapse: { header, body },
  } = props;

  return (
    <Collapse bordered={false} expandIconPosition="end">
      <Panel
        key="1"
        header={
          <div
            dangerouslySetInnerHTML={
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
              createMarkup(header)
            }
          />
        }
      >
        <div
          className="nero-content-block__body"
          dangerouslySetInnerHTML={
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
            createMarkup(body)
          }
        />
      </Panel>
    </Collapse>
  );
};

export { CollapseDisplay };
