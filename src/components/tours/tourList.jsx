import { Box, Typography } from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import TourItem from "./tourItem";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1280 },
    items: 3,
    slidesToSlide: 2,
    partialVisibilityGutter: 40,
  },
  tablet: {
    breakpoint: { max: 1280, min: 767 },
    items: 2,
    slidesToSlide: 1,
    partialVisibilityGutter: 30,
  },
  mobile: {
    breakpoint: { max: 767, min: 0 },
    items: 1,
    slidesToSlide: 1,
    partialVisibilityGutter: 30,
  },
};

const TourList = ({ list, title, deviceType }) => {
  return (
    <Box sx={{ mt: 3, ml: 3 }}>
      <Typography sx={{ mb: 2 }} variant="h4" component="div">
        {title}
      </Typography>
      <Carousel
        deviceType={deviceType}
        ssr
        slidesToSlide={1}
        responsive={responsive}
        keyBoardControl={true}
        partialVisible
        infinite
        itemClass="carousel-item-padding-40-px"
      >
        {list.map((item) => {
          return <TourItem key={item.id} item={item} />;
        })}
      </Carousel>
    </Box>
  );
};

export default TourList;
