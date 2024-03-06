import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import { ENDPOINT_NAVBAR_LINKS, ENDPOINT_VERIFY_EMAIL } from '../configs/constants';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { apiService } from '../services/api';
import { NavbarLink } from '@nero/query-api-service';
import { addNavbarLinks } from '../pages/reducer/pages';

interface ServerValidationErrors {
  non_field_errors?: string[];
}

export const useVerifyEmail = (uidb64: string, token: string) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isSuccess, setSuccess] = useState<boolean>(false);
  const [isInvalid, setInvalid] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    apiService
      .getAxiosInstance()
      .post(ENDPOINT_VERIFY_EMAIL, { uidb64, token })
      .then(() => {
        setSuccess(true);
      })
      .catch((err: AxiosError) => {
        if (err.response?.status == 400) {
          const validationErrors = err.response.data as ServerValidationErrors;

          if (
            validationErrors.non_field_errors &&
            validationErrors.non_field_errors[0] == 'Invalid activation credentials'
          ) {
            setInvalid(true);
          } else {
            setError(err);
          }
        } else {
          setError(err);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [uidb64, token]);

  return [isLoading, isSuccess, isInvalid, error];
};

export enum Themes {
  DEFAULT_1 = 'default-1',
  DEFAULT_2 = 'default-2',
}

export const useSetThemeColors = () => {
  const config = useAppSelector((state) => state.config);

  const getPrimaryColor = useCallback(() => {
    if (config.theme == 'default-2') {
      return '#492540';
    }

    if (config.theme == 'default-3') {
      return '#22d1ee';
    }

    if (config.theme == 'default-4') {
      return '#3f3b3b';
    }

    return '#00a6ed';
  }, [config.theme]);
  const primaryColor = getPrimaryColor();

  useEffect(() => {
    // customize theme with configs
    if (primaryColor) {
      ConfigProvider.config({
        theme: {
          primaryColor: primaryColor,
        },
      });
    }
  }, [primaryColor]);
};

export const useGetURLBlog = () => {
  const navLinks = useGetNavbarLinks();
  const getUrl = useCallback(() => {
    const link = navLinks.find((link) => link.link_to?.metadata?.is_blog);

    if (!link || !link.link_to?.slug) {
      return '/';
    }

    return `/${link.link_to.slug}`;
  }, [navLinks]);

  return getUrl();
};

export const useGetURLSignIn = () => {
  const navLinks = useGetNavbarLinks();
  const getUrl = useCallback(() => {
    const link = navLinks.find((link) => link.link_to?.metadata?.is_sign_in);

    if (!link || !link.link_to?.slug) {
      return '/';
    }

    return `/${link.link_to.slug}`;
  }, [navLinks]);

  return getUrl();
};

export const useGetURLSignUp = () => {
  const navLinks = useGetNavbarLinks();
  const getUrl = useCallback(() => {
    const link = navLinks.find((link) => link.link_to?.metadata?.is_sign_up);

    if (!link || !link.link_to?.slug) {
      return '/';
    }

    return `/${link.link_to.slug}`;
  }, [navLinks]);

  return getUrl();
};

export const useGetNavbarLinks = () => {
  const navbarLinks = useAppSelector((state) => state.dynamicPages.navbarLinks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!navbarLinks.length) {
      apiService
        .getAxiosInstance()
        .get<NavbarLink[]>(ENDPOINT_NAVBAR_LINKS, {
          withCredentials: false,
          headers: { 'X-Ignore-Credentials': true },
        })
        .then((res) => {
          dispatch(addNavbarLinks(res.data));
        })
        .catch(() => {
          dispatch(addNavbarLinks([]));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return navbarLinks;
};
