import { Box, Typography } from "@mui/material";
import Slider from "react-slick";
import TourItem from "./tourItem";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  swipeToSlide: true,
  slidesToScroll: 2,
  responsive: [
    {
      breakpoint: 1280,
      settings: { slidesToShow: 3, slidesToSlide: 1 },
    },
    {
      breakpoint: 1024,
      settings: { slidesToShow: 2, slidesToSlide: 1 },
    },
    {
      breakpoint: 700,
      settings: { slidesToShow: 1, slidesToSlide: 1 },
    },
  ],
};

const TourList = ({ list, title }) => {
  return (
    <Box sx={{ mt: 3, mx: 4 }}>
      <Typography sx={{ mb: 2 }} variant="h4" component="div">
        {title}
      </Typography>
      <Slider {...settings}>
        {list.map((item) => {
          return <TourItem key={item.id} item={item} />;
        })}
      </Slider>
    </Box>
  );
};

export default TourList;
