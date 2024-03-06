import { useState } from 'react';
import { useAppDispatch } from '../../../../../../store/hooks';
import { updateBlock } from '../../../../pageSlice';
import { BlockAdd } from '../../../BlockAdd';

export interface GridBlockAddProps {
  parentIndex: number;
  index: number;
}

const GridBlockAdd: React.FC<GridBlockAddProps> = (props: GridBlockAddProps) => {
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { index, parentIndex } = props;

  return (
    <BlockAdd
      options={['text', 'image', 'button', 'collapse']}
      size="small"
      optionsVisible={optionsVisible}
      onVisibleChange={(visible) => {
        setOptionsVisible(visible);
      }}
      onClick={(block) => {
        dispatch(updateBlock({ block, index, parentIndex }));
        setOptionsVisible(false);
      }}
    />
  );
};

export { GridBlockAdd };
