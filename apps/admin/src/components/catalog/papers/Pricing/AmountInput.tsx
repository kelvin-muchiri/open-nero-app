import { InputNumber } from 'antd';

export interface AmountInputProps {
  value?: string | number;
  onChange: (value: string | number) => void;
  style?: React.CSSProperties;
}

const AmountInput: React.FC<AmountInputProps> = (props: AmountInputProps) => {
  const { value, onChange, style } = props;

  return (
    <InputNumber value={value} prefix="$" step="1.00" min={1} style={style} onChange={onChange} />
  );
};

export { AmountInput };
