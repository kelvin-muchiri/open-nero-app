// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Carousel } from 'antd';
import { ReviewDisplayItem } from './ReviewItem';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import { useWindowSize } from '@nero/utils';

interface Review {
  rate: number;
  service: string;
  customerID: string;
  comment: string;
}

const ReviewsDisplay = () => {
  const [width] = useWindowSize();

  const dummyReviews: Review[] = [
    {
      rate: 4.5,
      service: 'Book/Movie Review',
      customerID: '315212',
      comment:
        "One of the longest papers I have ever come across and I couldn't handle but when I contracted this writing essays services which is indeed a cheap essay service I got a very good essay helper who followed all the instructions I gave and amazingly my assignment essay writing assignment was finished 7 days before the due date. Definitely will hire them again since they have cheap essay writing service and very professional essay writers. Thanks again.",
    },
    {
      rate: 5,
      service: 'Case Study',
      customerID: '221121',
      comment:
        'One of the best essay writing services you can go for and this essay writer is one of the professional essay writers that will assist you accordingly with your help do my essay request. The writer spotted some instructions that even I could hardly comprehend in the essay writing assignment and to my surprise, the output was just great. Definitely would order from this essay service again.',
    },
    {
      rate: 5,
      service: 'Essay',
      customerID: '1121251',
      comment:
        'When I was looking for a cheap essay writing service I am glad I found this writing essay service since my work was done as expected and the turnaround time was just perfect.  I will always order here again when I need someone to do my essay for me. Keep up the good work.',
    },
    {
      rate: 4.5,
      service: 'Essay',
      customerID: '211831',
      comment:
        "If you're looking for a professional essay writing service then this is the place to place your order when you need an online essay helper. The essay writer I was assigned by this writing essay service worked diligently on the assignment and I dint even need any revisions. The guidelines and requirements were clearly understood and I would definitely recommend anyone to this cheap essay service.",
    },
    {
      rate: 5,
      service: 'Article Review',
      customerID: '317697',
      comment:
        'When I placed the essay writing assignment job on the dashboard one of their essay writers took up the job and the work was done extremely very well to my satisfaction. The paper writing work was submitted on time and all the changes that I requested were taken into consideration. Their paper writers are just professional assignment helpers and I am grateful.',
    },
    {
      rate: 4.5,
      service: 'Research Paper',
      customerID: '361429',
      comment:
        'The work was delivered on time and everything was on point. When I placed an order on their "write my essay" job board the assignment was instantly assigned to one of their professional essay writers and I am very impressed with the output of the essay writer.  I would recommend this essay writing service to anyone who would be looking for an essay writer service.',
    },
    {
      rate: 5,
      service: 'Essay',
      customerID: '414831',
      comment:
        'I have been looking for someone who can offer professional essay writing services, deliver quality work that\'s error-free, and follows the guidelines that I have issued. I just found out the place and that\'s here.  When you click on the "help with my essay" button then your assigned a writer best suited for your needs and less than the stipulated time you have your essay work already done. Would recommend you anytime to anyone looking for a great essay writing Service Company.',
    },
  ];
  return (
    <div className="nero-reviews">
      <Carousel
        slidesToShow={width <= 767 ? 1 : 3}
        dots={false}
        draggable={true}
        arrows={width <= 991 ? false : true}
        nextArrow={<RightCircleOutlined />}
        prevArrow={<LeftCircleOutlined />}
      >
        {dummyReviews.map((review, index) => (
          <React.Fragment key={index}>
            <ReviewDisplayItem key={index} {...review} />
          </React.Fragment>
        ))}
      </Carousel>
    </div>
  );
};

export { ReviewsDisplay };
