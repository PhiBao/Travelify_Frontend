import { Box, Typography } from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import TourItem from "./tourItem";

const responsive = {
  desktop: {
    breakpoint: {
      max: 3000,
      min: 1430,
    },
    items: 3,
    slidesToSlide: 2,
    partialVisibilityGutter: 40,
  },
  tablet: {
    breakpoint: {
      max: 1429,
      min: 960,
    },
    items: 2,
    slidesToSlide: 1,
    partialVisibilityGutter: 30,
  },
  mobile: {
    breakpoint: {
      max: 959,
      min: 0,
    },
    items: 1,
    slidesToSlide: 1,
    partialVisibilityGutter: 30,
  },
};

const TourList = ({ title, deviceType }) => {
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
      >
        <TourItem key="1" />
        <TourItem key="2" />
        <TourItem key="3" />
        <TourItem key="4" />
        <TourItem key="5" />
        <TourItem key="6" />
        <TourItem key="7" />
        <TourItem key="8" />
        <TourItem key="9" />
      </Carousel>
    </Box>
  );
};

export default TourList;
