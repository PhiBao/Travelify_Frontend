import { Box, Typography } from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Slider from "react-slick";
import TourItem from "../tours/tourItem";
import { markTour } from "../../store/home";

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

const List = (props) => {
  const { list, title, link, markTour } = props;
  return (
    <Box sx={{ mt: 3, mx: 4 }}>
      <Box sx={{ display: "flex" }}>
        <Typography sx={{ mb: 2, flexGrow: 1 }} variant="h4" component="div">
          {title}
        </Typography>
        <Button component={Link} to={link}>
          More <DoubleArrowIcon pl={1} />
        </Button>
      </Box>
      <Slider {...settings}>
        {list.map((item) => {
          return <TourItem key={item.id} item={item} markTour={markTour} />;
        })}
      </Slider>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => ({
  markTour: (id) => dispatch(markTour(id)),
});

export default connect(null, mapDispatchToProps)(List);
