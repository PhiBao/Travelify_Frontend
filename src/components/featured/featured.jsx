import FeaturedItem from "./featuredItem";
import Slider from "react-slick";

const Featured = ({ list }) => {
  const settings = {
    dots: true,
    autoplay: true,
    speed: 1500,
    autoplaySpeed: 3500,
    fade: true,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Slider {...settings}>
      {list.map((item) => (
        <FeaturedItem key={item.id} tour={item} />
      ))}
    </Slider>
  );
};

export default Featured;
