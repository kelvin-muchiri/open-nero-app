import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { apiService, queryService } from '../../../../services/api';
import { store } from '../../../../store/store';
import { OrderForm } from '../index';
import * as fixtures from './fixtures';

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
  props.onFinish.mockReset();
});

const props = {
  onFinish: jest.fn(),
};

test('step 1 renders correctly', async () => {
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);

  render(
    <Provider store={store}>
      <OrderForm {...props} />
    </Provider>
  );

  await waitFor(() => {
    expect(mock.history.get).toHaveLength(3);
  });

  expect(mock.history.get[0].url).toBe('/catalog/papers/');
  expect(mock.history.get[0].params).toEqual({ service_only: true });
  expect(mock.history.get[1].url).toBe('/catalog/courses/');
  expect(mock.history.get[2].url).toBe('/catalog/formats/');
  // title for the first step 1 is correct
  expect(screen.queryByText(/type of work/i)).toBeInTheDocument();
  // title for the first step 2 is correct
  expect(screen.queryByText(/extra details/i)).toBeInTheDocument();
  expect(screen.queryByLabelText('Paper')).toBeInTheDocument();
  expect(screen.queryByLabelText('Deadline')).toBeInTheDocument();
  // pages has the default value of 1
  expect(screen.queryByLabelText('No. of pages')).toHaveValue('1');
  // quantity has default value of 1
  expect(screen.queryByLabelText('Quantity')).toHaveValue('1');
  expect(screen.queryByLabelText('Course')).toBeInTheDocument();
  expect(screen.queryByText('Next')).toBeInTheDocument();
});

test('submits', async () => {
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
      <OrderForm {...props} />
    </Provider>
  );
  const academicLevelLabel = 'Academic Level';

  await waitFor(async () => {
    // academic level select field is hidden
    expect(screen.queryByLabelText(academicLevelLabel)).not.toBeInTheDocument();
    // deadline select does not have options
    expect(screen.queryByLabelText(deadline.full_name as string)).not.toBeInTheDocument();
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
  expect((screen.getByText(level.name as string) as HTMLOptionElement).selected).toBe(true);
  // deadline options for selected level are now visible
  expect(screen.getByText(deadline.full_name as string)).toBeInTheDocument();
  await user.selectOptions(screen.getByLabelText('Deadline'), deadline.id);
  expect((screen.getByText(deadline.full_name as string) as HTMLOptionElement).selected).toBe(true);
  await user.clear(screen.getByLabelText('No. of pages')); // clear default value
  await user.type(screen.getByLabelText('No. of pages'), pages.toString());
  await user.clear(screen.getByLabelText('Quantity')); // clear default value
  await user.type(screen.getByLabelText('Quantity'), quantity.toString());
  await user.selectOptions(screen.getByLabelText('Course'), course.id);
  expect((screen.getByText(course.name) as HTMLOptionElement).selected).toBe(true);
  await user.click(screen.getByText('Next'));

  // step 2 is now rendered
  expect(screen.queryByLabelText('Topic')).toBeInTheDocument();
  expect(screen.queryByLabelText('No. of references')).toBeInTheDocument();
  expect(screen.queryByLabelText('Paper Format')).toBeInTheDocument();
  expect(screen.queryByLabelText('Language')).toBeInTheDocument();
  expect(screen.queryByLabelText('Instructions')).toBeInTheDocument();
  expect(screen.queryByText('Add to cart')).toBeInTheDocument();
  expect(screen.queryByText('Previous')).toBeInTheDocument();
  expect((screen.getByText('English UK') as HTMLOptionElement).selected).toBe(true);
  expect((screen.getByText('English US') as HTMLOptionElement).selected).toBe(false);
  await user.type(screen.getByLabelText('Topic'), topic);
  await user.type(screen.getByLabelText('No. of references'), references.toString());
  await user.selectOptions(screen.getByLabelText('Paper Format'), paper_format.id);
  expect(
    (screen.getByRole('option', { name: paper_format.name }) as HTMLOptionElement).selected
  ).toBe(true);
  await user.selectOptions(screen.getByLabelText('Language'), '2');
  expect((screen.getByText('English US') as HTMLOptionElement).selected).toBe(true);
  await user.type(screen.getByLabelText('Instructions'), comment);
  await user.click(screen.getByText('Add to cart'));
  expect(props.onFinish).toHaveBeenLastCalledWith({
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
  });
});

test('deadline options for paper with no levels', async () => {
  const user = userEvent.setup();
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);

  render(
    <Provider store={store}>
      <OrderForm {...props} />
    </Provider>
  );
  const paper = fixtures.paperList[2];
  const deadline = paper.deadlines[0];
  const academicLevelLabel = 'Academic Level';

  // select paper (wait for get papers async to finish)
  await waitFor(async () => {
    // academic level select field is hidden
    expect(screen.queryByLabelText(academicLevelLabel)).not.toBeInTheDocument();
    // deadline select does not have options
    expect(screen.queryByLabelText(deadline.full_name)).not.toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Paper'), paper.id);
  });
  expect((screen.getByRole('option', { name: paper.name }) as HTMLOptionElement).selected).toBe(
    true
  );
  // academic level input is still hidden
  expect(screen.queryByLabelText(academicLevelLabel)).not.toBeInTheDocument();
  // deadline options for selected paper are now visible
  expect(screen.getByText(deadline.full_name)).toBeInTheDocument();
});

test('required fields', async () => {
  const user = userEvent.setup();
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);
  mock.onPost('/cart/').reply(200, {});
  const paper = fixtures.paperList[0];
  const level = fixtures.paperList[0].levels[0];
  const deadline = fixtures.paperList[0].levels[0].deadlines[0];
  const course = fixtures.courseList[0];

  render(
    <Provider store={store}>
      <OrderForm {...props} />
    </Provider>
  );

  // step 1
  await waitFor(async () => {
    await user.clear(screen.getByLabelText('No. of pages')); // clear default value
  });
  await user.clear(screen.getByLabelText('Quantity')); // clear default value
  // submit
  await user.click(screen.getByText('Next'));
  await waitFor(() => {
    expect(screen.getByText('Paper required')).toBeInTheDocument();
  });
  expect(screen.getByText('Deadline required')).toBeInTheDocument();
  expect(screen.getByText('No. of pages required')).toBeInTheDocument();
  expect(screen.getByText('Quantity required')).toBeInTheDocument();
  expect(screen.getByText('Course required')).toBeInTheDocument();

  // fill fields in order to go to step 2
  await user.selectOptions(screen.getByLabelText('Paper'), paper.id);
  await user.selectOptions(screen.getByLabelText('Academic Level'), level.id);
  await user.selectOptions(screen.getByLabelText('Deadline'), deadline.id);
  await user.type(screen.getByLabelText('No. of pages'), '1');
  await user.type(screen.getByLabelText('Quantity'), '1');
  await user.selectOptions(screen.getByLabelText('Course'), course.id);
  expect((screen.getByRole('option', { name: course.name }) as HTMLOptionElement).selected).toBe(
    true
  );
  await user.click(screen.getByText('Next'));

  // step 2
  // submit form
  await user.click(screen.getByText('Add to cart'));
  await waitFor(() => {
    expect(screen.getByText('Topic required')).toBeInTheDocument();
    expect(screen.getByText('Paper format required')).toBeInTheDocument();
  });
});

test('pages min is 1', async () => {
  const user = userEvent.setup();
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);

  render(
    <Provider store={store}>
      <OrderForm {...props} />
    </Provider>
  );
  // clear default
  await user.clear(screen.getByLabelText('No. of pages'));
  await user.type(screen.getByLabelText('No. of pages'), '0');
  // submit
  await user.click(screen.getByText('Next'));
  // pages should be reset to 1
  expect(screen.getByLabelText('No. of pages')).toHaveValue('1');
});

test('pages max is 1000', async () => {
  const user = userEvent.setup();
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);

  render(
    <Provider store={store}>
      <OrderForm {...props} />
    </Provider>
  );
  // clear default
  await user.clear(screen.getByLabelText('No. of pages'));
  await user.type(screen.getByLabelText('No. of pages'), '1001');
  // submit
  await user.click(screen.getByText('Next'));
  // pages should be reset to 1000
  expect(screen.getByLabelText('No. of pages')).toHaveValue('1000');
});

test('quantity min is 1', async () => {
  const user = userEvent.setup();
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);

  render(
    <Provider store={store}>
      <OrderForm {...props} />
    </Provider>
  );
  // clear default
  await user.clear(screen.getByLabelText('Quantity'));
  await user.type(screen.getByLabelText('Quantity'), '0');
  // submit
  await user.click(screen.getByText('Next'));
  // pages should be reset to 1
  expect(screen.getByLabelText('Quantity')).toHaveValue('1');
});

test('quantity max is 3', async () => {
  const user = userEvent.setup();
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);

  render(
    <Provider store={store}>
      <OrderForm {...props} />
    </Provider>
  );
  // clear default
  await user.clear(screen.getByLabelText('Quantity'));
  await user.type(screen.getByLabelText('Quantity'), '4');
  // submit
  await user.click(screen.getByText('Next'));
  // quantity should be reset to 3
  expect(screen.getByLabelText('Quantity')).toHaveValue('3');
});

test('references min is 0', async () => {
  const user = userEvent.setup();
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);
  mock.onPost('/cart/').reply(200, {});
  const paper = fixtures.paperList[0];
  const level = fixtures.paperList[0].levels[0];
  const deadline = fixtures.paperList[0].levels[0].deadlines[0];
  const course = fixtures.courseList[0];

  render(
    <Provider store={store}>
      <OrderForm {...props} />
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
  expect((screen.getByText(course.name) as HTMLOptionElement).selected).toBe(true);
  await user.click(screen.getByText('Next'));

  // step 2
  await waitFor(async () => {
    await user.type(screen.getByLabelText('No. of references'), '-1');
  });
  // submit form
  await user.click(screen.getByText('Add to cart'));
  // references should be reset to 0
  expect(screen.getByLabelText('No. of references')).toHaveValue('0');
});

test('topic max length is 255', async () => {
  const user = userEvent.setup();
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);
  const paper = fixtures.paperList[0];
  const level = fixtures.paperList[0].levels[0];
  const deadline = fixtures.paperList[0].levels[0].deadlines[0];
  const course = fixtures.courseList[0];
  const paper_format = fixtures.formatList[0];
  mock.onPost('/cart/').reply(200, {});

  render(
    <Provider store={store}>
      <OrderForm {...props} />
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
  expect((screen.getByText(course.name) as HTMLOptionElement).selected).toBe(true);
  await user.click(screen.getByText('Next'));

  // step 2
  await user.selectOptions(screen.getByLabelText('Paper Format'), paper_format.id);
  const topic =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure doloruit';
  // 256 chars fails
  expect(topic).toHaveLength(256);
  await user.type(screen.getByLabelText('Topic'), topic);
  await user.click(screen.getByText('Add to cart'));
  expect(screen.getByText('Maximum length is 255 characters')).toBeInTheDocument();

  // 255 chars pass
  const topic255 = topic.slice(0, -1);
  expect(topic255).toHaveLength(255);
  await user.clear(screen.getByLabelText('Topic'));
  await user.type(screen.getByLabelText('Topic'), topic255);
  await user.click(screen.getByText('Add to cart'));
  expect(props.onFinish).toHaveBeenCalled();
});

test('instructions max length is 255', async () => {
  jest.setTimeout(40000);
  const user = userEvent.setup();
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);
  const paper = fixtures.paperList[0];
  const level = fixtures.paperList[0].levels[0];
  const deadline = fixtures.paperList[0].levels[0].deadlines[0];
  const course = fixtures.courseList[0];
  const paper_format = fixtures.formatList[0];
  mock.onPost('/cart/').reply(200, {});

  render(
    <Provider store={store}>
      <OrderForm {...props} />
    </Provider>
  );

  // fill fields in order to go to step 2
  await waitFor(async () => {
    await user.selectOptions(screen.getByLabelText('Paper'), paper.id);
  });
  await user.selectOptions(screen.getByLabelText('Academic Level'), level.id);
  await user.selectOptions(screen.getByLabelText('Deadline'), deadline.id);
  user.type(screen.getByLabelText('No. of pages'), '1');
  user.type(screen.getByLabelText('Quantity'), '1');
  await user.selectOptions(screen.getByLabelText('Course'), course.id);
  expect((screen.getByRole('option', { name: course.name }) as HTMLOptionElement).selected).toBe(
    true
  );
  await user.click(screen.getByText('Next'));

  // step 2
  await user.selectOptions(screen.getByLabelText('Paper Format'), paper_format.id);
  await user.type(screen.getByLabelText('Topic'), 'Some crazy topic');
  // 1001 chars fails
  const instructions =
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et';
  expect(instructions).toHaveLength(1001);
  await user.type(screen.getByLabelText('Instructions'), instructions);
  await user.click(screen.getByText('Add to cart'));
  expect(screen.getByText('Maximum length is 1000 characters')).toBeInTheDocument();

  // 1000 chars pass
  const instructions1000 = instructions.slice(0, -1);
  expect(instructions1000).toHaveLength(1000);
  await user.clear(screen.getByLabelText('Instructions'));
  await user.type(screen.getByLabelText('Instructions'), instructions1000);
  await user.click(screen.getByText('Add to cart'));
  expect(props.onFinish).toHaveBeenCalled();
});

test('handles fetch papers server error', async () => {
  mock.onGet('/catalog/papers/').reply(500, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);

  render(
    <Provider store={store}>
      <OrderForm {...props} />
    </Provider>
  );

  await waitFor(() => {
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});

test('handles fetch courses server error', async () => {
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(500, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);

  render(
    <Provider store={store}>
      <OrderForm {...props} />
    </Provider>
  );

  await waitFor(() => {
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});

test('handles fetch formats server error', async () => {
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(500, fixtures.formatList);

  render(
    <Provider store={store}>
      <OrderForm {...props} />
    </Provider>
  );

  await waitFor(() => {
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});

test('initial form values passed as props are applied', async () => {
  const user = userEvent.setup();
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);

  const paper = fixtures.paperList[0];
  const level = paper.levels[0];
  const deadline = level.deadlines[0];
  const course = fixtures.courseList[0];
  const format = fixtures.formatList[0];

  render(
    <Provider store={store}>
      <OrderForm
        {...props}
        initialValues={{
          paper: paper.id,
          level: level.id,
          deadline: deadline.id,
          course: course.id,
          pages: '3',
          quantity: '2',
          topic: 'Initialized topic',
          references: '8',
          format: format.id,
          comment: 'Do a good job',
          language: '2',
        }}
      />
    </Provider>
  );

  await waitFor(() => {
    expect((screen.getByRole('option', { name: paper.name }) as HTMLOptionElement).selected).toBe(
      true
    );
  });
  expect((screen.getByRole('option', { name: level.name }) as HTMLOptionElement).selected).toBe(
    true
  );
  expect(
    (screen.getByRole('option', { name: deadline.full_name }) as HTMLOptionElement).selected
  ).toBe(true);
  expect((screen.getByRole('option', { name: course.name }) as HTMLOptionElement).selected).toBe(
    true
  );
  expect(screen.getByLabelText('No. of pages')).toHaveValue('3');
  expect(screen.getByLabelText('Quantity')).toHaveValue('2');

  // go to step 2
  await user.click(screen.getByText('Next'));
  expect(screen.getByLabelText('Topic')).toHaveValue('Initialized topic');
  expect(screen.getByLabelText('No. of references')).toHaveValue('8');
  expect(screen.getByLabelText('Instructions')).toHaveValue('Do a good job');
  expect((screen.getByRole('option', { name: format.name }) as HTMLOptionElement).selected).toBe(
    true
  );
  expect((screen.getByRole('option', { name: 'English US' }) as HTMLOptionElement).selected).toBe(
    true
  );
});

test('changing paper choice resets level and deadline fields', async () => {
  const user = userEvent.setup();
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);

  const paper = fixtures.paperList[0];
  const level = paper.levels[0];
  const deadline = level.deadlines[0];

  render(
    <Provider store={store}>
      <OrderForm {...props} />
    </Provider>
  );

  await waitFor(async () => {
    await user.selectOptions(screen.getByLabelText('Paper'), paper.id);
  });
  expect((screen.getByRole('option', { name: paper.name }) as HTMLOptionElement).selected).toBe(
    true
  );
  // levels field now visible, select level
  await user.selectOptions(screen.getByLabelText('Academic Level'), level.id);
  expect((screen.getByRole('option', { name: level.name }) as HTMLOptionElement).selected).toBe(
    true
  );
  // deadline field now visible, select deadline
  await user.selectOptions(screen.getByLabelText('Deadline'), deadline.id);
  expect(
    (screen.getByRole('option', { name: deadline.full_name }) as HTMLOptionElement).selected
  ).toBe(true);
  // now we select another paper
  const paper2 = fixtures.paperList[1];
  const paper2_deadline = paper2.levels[0].deadlines[0].full_name as string;

  await user.selectOptions(screen.getByLabelText('Paper'), paper2.id);
  expect((screen.getByRole('option', { name: paper2.name }) as HTMLOptionElement).selected).toBe(
    true
  );
  // deadline options are not available until level is selected again
  expect(screen.queryByText(paper2_deadline)).not.toBeInTheDocument();
  // select level
  await user.selectOptions(screen.getByLabelText('Academic Level'), paper2.levels[0].id);
  // now deadline is selected
  expect(
    (
      screen.getByRole('option', {
        name: paper2_deadline,
      }) as HTMLOptionElement
    ).selected
  ).toBe(true);
});
