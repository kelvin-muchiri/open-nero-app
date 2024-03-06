import React from 'react';

if (typeof document === 'undefined') {
  // eslint-disable-next-line
  React.useLayoutEffect = React.useEffect;
}

import { useLayoutEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 *
 * Parse query string
 *
 * @returns
 */
export const useQueryParams = (): URLSearchParams => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};

/**
 * Listen to screen dimensions
 *
 * @returns
 */
export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};
