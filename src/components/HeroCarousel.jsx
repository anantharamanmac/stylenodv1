import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const HeroCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/hero`)
      .then((res) => res.json())
      .then((data) => setBanners(data))
      .catch((err) => console.error(err));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (_, next) => setCurrentIndex(next),
  };

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  if (!banners.length) return null;

  return (
    <section className="w-full relative h-[50vh] md:h-[70vh]">
      <Slider {...settings}>
        {banners.map((banner, idx) => (
          <div key={banner._id} className="relative h-[50vh] md:h-[70vh]">
            <img
              src={banner.imageUrl}
              alt={banner.heading}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center">
              {currentIndex === idx && (
                <motion.div key={currentIndex} initial="hidden" animate="visible">
                  <motion.h1
                    className="text-3xl md:text-6xl font-bold text-white"
                    variants={variants}
                  >
                    {banner.heading}
                  </motion.h1>
                  <motion.p className="mt-4 text-sm md:text-lg text-white" variants={variants}>
                    {banner.subText}
                  </motion.p>
                  <motion.button
                    className="mt-6 px-4 md:px-6 py-2 bg-white text-black rounded-md font-semibold hover:bg-gray-200"
                    variants={variants}
                  >
                    {banner.buttonText}
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default HeroCarousel;
