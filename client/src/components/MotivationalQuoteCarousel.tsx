import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';

interface Quote {
  text: string;
  author: string;
}

interface MotivationalQuoteCarouselProps {
  quotes: Quote[];
}

const MotivationalQuoteCarousel = ({ quotes }: MotivationalQuoteCarouselProps) => {
  if (!quotes || quotes.length === 0) {
    return null;
  }

  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      loop={true}
    >
      {quotes.map((quote, index) => (
        <SwiperSlide key={index}>
          <blockquote className="text-2xl md:text-3xl font-serif italic mb-4">
            "{quote.text}"
          </blockquote>
          <p className="text-lg">- {quote.author}</p>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MotivationalQuoteCarousel; 