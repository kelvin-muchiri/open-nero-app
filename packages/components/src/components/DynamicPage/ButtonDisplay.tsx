// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Button as NeroButton } from '@nero/query-api-service';
import { Button } from 'antd';

export interface ButtonDisplayProps {
  button: NeroButton;
}

const ButtonDisplay: React.FC<ButtonDisplayProps> = (props: ButtonDisplayProps) => {
  const {
    button: { name, linkTo, size },
  } = props;

  return (
    <Button
      className="nero-btn-cta mtb-10"
      size={size}
      type="primary"
      onClick={() => {
        if (linkTo) {
          window.location.href = linkTo;
        }
      }}
    >
      {name}
    </Button>
  );
};

export { ButtonDisplay };
