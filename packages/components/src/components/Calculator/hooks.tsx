import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { CalculatorResponse, neroAPIQuery } from '@nero/query-api-service';
import { ENDPOINT_CALCULATOR } from '../../constants';

export const useCalculatorHook = (
  neroQuery: ReturnType<typeof neroAPIQuery>
): [
  CalculatorResponse | undefined,
  {
    setLevel: Dispatch<SetStateAction<string | undefined>>;
    setDeadline: Dispatch<SetStateAction<string | undefined>>;
    setPaper: Dispatch<SetStateAction<string | undefined>>;
    setPages: Dispatch<SetStateAction<string | number>>;
  }
] => {
  const { useCalculatorMutation } = neroQuery;
  const [calculator] = useCalculatorMutation();
  const [level, setLevel] = useState<string | undefined>();
  const [deadline, setDeadline] = useState<string | undefined>();
  const [paper, setPaper] = useState<string | undefined>();
  const [pages, setPages] = useState<string | number>(0);
  const [price, setPrice] = useState<CalculatorResponse | undefined>();

  useEffect(() => {
    if (typeof pages != 'number' && !parseInt(pages)) {
      setPrice(undefined);
      return;
    }

    if (deadline && paper && pages) {
      calculator({
        url: ENDPOINT_CALCULATOR,
        data: { deadline, paper, pages, level },
        withCredentials: false,
        headers: { 'X-Ignore-Credentials': true },
      })
        .unwrap()
        .then((res) => {
          setPrice(res);
        })
        .catch(() => {
          setPrice(undefined);
        });
    } else {
      setPrice(undefined);
    }
  }, [calculator, level, deadline, pages, paper]);

  return [price, { setLevel, setDeadline, setPages, setPaper }];
};
