/* eslint-disable sonarjs/no-duplicate-string */

export const cart = {
  cart: {
    id: 'a84993aa-b905-453d-8a01-3352ce84cb16',
    total: '30.00',
    items: [
      {
        id: '2fe85c65-cd57-47dd-abc6-7d8aa24dcd0d',
        topic: 'Evolution of man',
        level: {
          id: '031ac6b6-35ff-4f5b-933e-e39abb8c2dab',
          name: 'Undergraduate (1-2)',
        },
        course: {
          id: '6986b6d4-4ba2-4518-a61a-a7116ce5850e',
          name: 'Tourism',
        },
        paper: {
          id: '20609343-0580-4b28-b2a1-0622d91cceeb',
          name: 'Case Study',
        },
        paper_format: {
          id: '685b8063-7c57-434b-b87a-bb0a1b6e5d26',
          name: 'MLA',
        },
        deadline: {
          id: 'fae0960c-562b-429a-8dc7-5f5ac807e0bc',
          full_name: '1 Day',
        },
        language: {
          id: 1,
          name: 'English UK',
        },
        pages: 2,
        references: 3,
        comment: 'Do a great job',
        quantity: 1,
        price: '30.00',
        total_price: '30.00',
        writer_type: null,
        attachments: [],
      },
    ],
  },
};

/* eslint-disable sonarjs/no-duplicate-string */

export const paperList = [
  {
    id: '5367fa67-8a88-4b6d-8001-49c60415e50e',
    name: 'Argumentative Essay',
    levels: [
      {
        id: 'ccfeebec-6d3c-4e9b-8745-99014ad1785c',
        name: 'High School',
        deadlines: [
          {
            id: 'fae0960c-562b-429a-8dc7-5f5ac807e0bc',
            full_name: '1 Day',
          },
        ],
      },
    ],
    deadlines: [],
  },
  {
    id: '20609343-0580-4b28-b2a1-0622d91cceeb',
    name: 'Case Study',
    levels: [
      {
        id: '031ac6b6-35ff-4f5b-933e-e39abb8c2dab',
        name: 'Undergraduate (1-2)',
        deadlines: [
          {
            id: 'fae0960c-562b-429a-8dc7-5f5ac807e0bc',
            full_name: '1 Day',
          },
        ],
      },
    ],
    deadlines: [],
  },
  {
    id: 'a939edd7-440f-4858-bb31-4849c094371c',
    name: 'Course Work',
    levels: [
      {
        id: '220bfee9-04cf-4760-8eaf-3d94dbb8663b',
        name: 'Undergraduate(3-4)',
        deadlines: [
          {
            id: 'c3688312-f4d2-43c0-b601-e5dad393f799',
            full_name: '8 Hours',
          },
        ],
      },
    ],
    deadlines: [],
  },
  {
    id: '5586ac78-e448-4112-9d15-5f9e0059e767',
    name: 'Curriculum Vitae',
    levels: [],
    deadlines: [
      {
        id: 'fae0960c-562b-429a-8dc7-5f5ac807e0bc',
        full_name: '1 Day',
      },
    ],
  },
];

export const courseList = [
  {
    id: '29c2e2fe-a122-4ad8-9f9a-6f0c07f73113',
    name: 'Accounting',
  },
  {
    id: 'bbee3bd7-6d02-4d0a-ba84-ee61ed144a68',
    name: 'Aviation',
  },
  {
    id: '6986b6d4-4ba2-4518-a61a-a7116ce5850e',
    name: 'Tourism',
  },
];

export const formatList = [
  {
    id: '92ec727b-d003-4999-8ad1-894253c32627',
    name: 'APA',
  },
  {
    id: 'b051aa81-ea51-47ae-8ca2-860447e9fcf1',
    name: 'Chicago',
  },
  {
    id: '685b8063-7c57-434b-b87a-bb0a1b6e5d26',
    name: 'MLA',
  },
];
