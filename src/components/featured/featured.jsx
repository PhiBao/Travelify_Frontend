import FeaturedItem from "./featuredItem";
import Slider from "react-slick";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  slider: {
    "& .slick-slide": { pointerEvents: "none" },
    "& .slick-active": { pointerEvents: "auto" },
  },
});

const Featured = ({ list }) => {
  const classes = useStyles();
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
    <Slider className={classes.slider} {...settings}>
      {list.map((item) => (
        <FeaturedItem key={item.id} tour={item} />
      ))}
    </Slider>
  );
};

export default Featured;
