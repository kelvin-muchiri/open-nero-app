import Axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import axiosRetry, { exponentialDelay } from 'axios-retry';

abstract class HttpClient {
  protected readonly instance: AxiosInstance;
  private _isRefreshing = false;
  private _onRefreshFailedCalled = false;

  public constructor(
    baseURL: string,
    refreshTokenEndpoint: string,
    onRefreshFailed: () => void,
    handle403?: (error: AxiosError) => void
  ) {
    this.instance = Axios.create({
      baseURL,
      withCredentials: true,
    });
    this._handle401Retry(baseURL, refreshTokenEndpoint, onRefreshFailed);
    this._initializeResponseInterceptor(handle403);
  }

  /**
   * Handle retrying a 401 response to try and refresh token
   *
   * @param baseURL
   * @param refreshTokenEndpoint
   */
  private _handle401Retry(
    baseURL: string,
    refreshTokenEndpoint: string,
    onRefreshFailed: () => void
  ) {
    axiosRetry(this.instance, {
      retries: 4,
      retryCondition(error) {
        return error.response?.status == 401;
      },
      retryDelay: exponentialDelay,
      onRetry: (retryCount, error) => {
        // when we get the first retry for a request, we refresh token as long
        // as another request is not refreshing the token
        if (retryCount == 1 && !this._isRefreshing && error.response?.status == 401) {
          this._handleRefreshToken(baseURL, refreshTokenEndpoint, onRefreshFailed);
        }
      },
    });
  }

  /**
   * Handle refreshing of token. Logouts out user if refresh fails
   *
   * @param baseURL
   * @param refreshTokenEndpoint
   */
  private _handleRefreshToken(
    baseURL: string,
    refreshTokenEndpoint: string,
    onRefreshFailed: () => void
  ) {
    // we create a new instance since we do not want to use the class instance to avoid
    // an infinite loop because of the retries
    const axios = Axios.create({
      baseURL,
      withCredentials: true,
    });
    this._isRefreshing = true;

    axios
      .post(refreshTokenEndpoint)
      .catch(() => {
        if (!this._onRefreshFailedCalled) {
          this._onRefreshFailedCalled = true;
          onRefreshFailed();
        }
      })
      .finally(() => {
        this._isRefreshing = false;
      });
  }

  private _initializeResponseInterceptor = (handle403?: (error: AxiosError) => void) => {
    this.instance.interceptors.response.use(this._handleResponse, async (error: AxiosError) => {
      await this._handleError(error, handle403);
    });
  };

  private _handleResponse = (response: AxiosResponse) => response;

  protected _handleError = (error: AxiosError, handle403?: (error: AxiosError) => void) => {
    if (error.response?.status == 403 && handle403) {
      handle403(error);
    } else {
      return Promise.reject(error);
    }
  };
}

/**
 * Nero API service class. Imeplemented using the Singleton pattern to ensure
 * we  only have one instance of the class
 */
export class NeroAPIService extends HttpClient {
  private static classInstance?: NeroAPIService;

  private constructor(
    baseURL: string,
    refreshTokenEndpoint: string,
    onRefreshFailed: () => void,
    handle403?: (error: AxiosError) => void
  ) {
    super(baseURL, refreshTokenEndpoint, onRefreshFailed, handle403);
  }

  public static getInstance(
    baseURL: string,
    refreshTokenEndpoint: string,
    onRefreshFailed: () => void,
    handle403?: (error: AxiosError) => void
  ) {
    if (!this.classInstance) {
      this.classInstance = new NeroAPIService(
        baseURL,
        refreshTokenEndpoint,
        onRefreshFailed,
        handle403
      );
    }

    return this.classInstance;
  }

  public getAxiosInstance() {
    return this.instance;
  }
}
