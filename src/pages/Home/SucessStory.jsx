import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const SucessStory = () => {
  const settings = {
    // dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 2,
    slidesToScroll: 2,
    autoplay: true,
    // autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const stories = [
    {
      img: "images/shreya.png",
      name: "Olivia & Ethan",
      text: "I never believed in online matchmaking until I met someone special here. The process felt personal, and the connection was real."
    },
    {
      img: "images/preeti.png",
      name: "Emma & Liam",
      text: "Future SoulMates helped me find someone who shares my values and life goals. It's been a wonderful journey."
    },
    {
      img: "images/noah.png",
      name: "Sophia & Mason",
      text: "FutureSoulmates completely changed the way I looked at finding love"
    },
    {
      img: "images/mason.png",
      name: "Madison & Noah",
      text: "I had almost given up on online dating until I tried FutureSoulmates."
    }
  ];

  return (
    <section className="success-story home-story">
      <div className="success-img-left d-none d-md-block" />
      <div className="container">
        <div className="row">
          <div className="col-md-4 slider-succes1"></div>
          <div className="col-md-8">
            <div className="slider-succes">
              <div className="heading">
                <h3>
                  <span className="digit">6 </span> Million{" "}
                  <span className="text"> Success Stories & Counting</span>
                </h3>
              </div>
              <Slider {...settings}>
                {stories.map((story, index) => (
                  <div className="common-blk" key={index}>
                    <div className="img-blk">
                      <img src={story.img} alt={story.name} />
                    </div>
                    <h3>{story.name}</h3>
                    <p>{story.text}</p>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SucessStory;
