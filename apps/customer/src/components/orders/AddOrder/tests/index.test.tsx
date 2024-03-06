import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { notification } from 'antd';
import { store } from '../../../../store/store';
import { AddOrder } from '..';
import * as fixtures from './fixtures';
import { apiService, queryService } from '../../../../services/api';

/* eslint-disable  @typescript-eslint/no-unnecessary-type-assertion */

const mock = new MockAdapter(apiService.getAxiosInstance());
const mockUseNavigate = jest.fn();

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');

  const Select = ({ children, onChange, ...otherProps }: any) => {
    return (
      <select {...otherProps} loading={undefined} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    );
  };

  const Option = ({ children, ...otherProps }: any) => {
    return <option {...otherProps}>{children}</option>;
  };

  Select.Option = Option;

  return {
    __esModule: true,
    ...antd,
    Select,
  };
});
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => mockUseNavigate,
  };
});
jest.setTimeout(30000);

afterEach(() => {
  // This is the solution to clear RTK Query cache after each test
  store.dispatch(queryService.util.resetApiState());
  mock.reset();
});

test('adds order', async () => {
  const user = userEvent.setup();
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);
  const topic = 'The evolution of EVs';
  const paper = fixtures.paperList[0];
  const level = fixtures.paperList[0].levels[0];
  const deadline = fixtures.paperList[0].levels[0].deadlines[0];
  const course = fixtures.courseList[0];
  const paper_format = fixtures.formatList[0];
  const pages = 2;
  const references = 8;
  const comment = 'Watch the video';
  const quantity = 2;
  mock.onPost('/cart/').reply(200, {
    id: '4d2619c6-31d1-4fcd-b980-8241ef2258a1',
    total: '40.00',
    items: [
      {
        id: '08c0b8eb-4eb3-4da3-8bfb-f63b45e1db4d',
        topic,
        level,
        course,
        paper,
        paper_format,
        deadline,
        language: {
          id: '2',
          name: 'English US',
        },
        pages,
        references,
        comment,
        quantity,
        price: '10.00',
        total_price: '40.00',
        writer_type: null,
        attachments: [],
      },
    ],
  });

  render(
    <Provider store={store}>
      <AddOrder />
    </Provider>
  );
  const academicLevelLabel = 'Academic Level';
  // select paper (wait for get papers async to finish)
  await waitFor(() => {
    // academic level select field is hidden
    expect(screen.queryByLabelText(academicLevelLabel)).not.toBeInTheDocument();
    // deadline select does not have options
    expect(screen.queryByLabelText(deadline.full_name)).not.toBeInTheDocument();
  });
  await waitFor(async () => {
    // select paper (wait for get papers async to finish)
    await user.selectOptions(screen.getByLabelText('Paper'), paper.id);
  });
  expect((screen.getByRole('option', { name: paper.name }) as HTMLOptionElement).selected).toBe(
    true
  );
  // academic level input is now visible since selected paper has levels
  expect(screen.queryByLabelText(academicLevelLabel)).toBeInTheDocument();
  // select level
  await user.selectOptions(screen.getByLabelText(academicLevelLabel), level.id);
  expect((screen.getByRole('option', { name: level.name }) as HTMLOptionElement).selected).toBe(
    true
  );
  // deadline options for selected level are now visible
  expect(screen.getByText(deadline.full_name)).toBeInTheDocument();
  await user.selectOptions(screen.getByLabelText('Deadline'), deadline.id);
  expect(
    (screen.getByRole('option', { name: deadline.full_name }) as HTMLOptionElement).selected
  ).toBe(true);
  await user.clear(screen.getByLabelText('No. of pages')); // clear default value
  await user.type(screen.getByLabelText('No. of pages'), pages.toString());
  await user.clear(screen.getByLabelText('Quantity')); // clear default value
  await user.type(screen.getByLabelText('Quantity'), quantity.toString());
  await user.selectOptions(screen.getByLabelText('Course'), course.id);
  expect((screen.getByRole('option', { name: course.name }) as HTMLOptionElement).selected).toBe(
    true
  );
  await user.click(screen.getByText('Next'));

  // step 2 is now rendered
  expect((screen.getByRole('option', { name: 'English UK' }) as HTMLOptionElement).selected).toBe(
    true
  );
  expect((screen.getByRole('option', { name: 'English US' }) as HTMLOptionElement).selected).toBe(
    false
  );
  await user.type(screen.getByLabelText('Topic'), topic);
  await user.type(screen.getByLabelText('No. of references'), references.toString());
  await user.selectOptions(screen.getByLabelText('Paper Format'), paper_format.id);
  expect((screen.getByText(paper_format.name) as HTMLOptionElement).selected).toBe(true);
  await user.selectOptions(screen.getByLabelText('Language'), '2');
  expect((screen.getByText('English US') as HTMLOptionElement).selected).toBe(true);
  await user.type(screen.getByLabelText('Instructions'), comment);
  await user.click(screen.getByText('Add to cart'));
  expect(mock.history.post).toHaveLength(1);
  expect(mock.history.post[0].url).toBe('/cart/');
  expect(mock.history.post[0].data).toBe(
    JSON.stringify({
      items: [
        {
          topic,
          level: level.id,
          course: course.id,
          paper: paper.id,
          paper_format: paper_format.id,
          deadline: deadline.id,
          language: '2',
          pages,
          references,
          comment,
          quantity,
        },
      ],
    })
  );
  expect(mockUseNavigate).toHaveBeenCalledWith('/past-orders/cart');
});

test('server errors are handled when submission fails', async () => {
  const user = userEvent.setup();
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);
  const paper = fixtures.paperList[0];
  const level = fixtures.paperList[0].levels[0];
  const deadline = fixtures.paperList[0].levels[0].deadlines[0];
  const course = fixtures.courseList[0];
  const paper_format = fixtures.formatList[0];
  mock.onPost('/cart/').reply(400, {});

  const mockNotificationError = jest.spyOn(notification, 'error');

  render(
    <Provider store={store}>
      <AddOrder />
    </Provider>
  );

  // fill fields in order to go to step 2
  await waitFor(async () => {
    await user.selectOptions(screen.getByLabelText('Paper'), paper.id);
  });
  await user.selectOptions(screen.getByLabelText('Academic Level'), level.id);
  await user.selectOptions(screen.getByLabelText('Deadline'), deadline.id);
  await user.type(screen.getByLabelText('No. of pages'), '1');
  await user.type(screen.getByLabelText('Quantity'), '1');
  await user.selectOptions(screen.getByLabelText('Course'), course.id);
  await user.click(screen.getByText('Next'));

  // step 2
  await user.selectOptions(screen.getByLabelText('Paper Format'), paper_format.id);
  await user.type(screen.getByLabelText('Topic'), 'Some crazy topic');
  await user.click(screen.getByText('Add to cart'));
  expect(mock.history.post).toHaveLength(1);
  expect(mockNotificationError).toHaveBeenCalledWith({ message: 'Something went wrong!' });
});
