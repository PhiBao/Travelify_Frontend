import { useEffect, useState } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

const srcset = (image, size) => {
  return {
    src: `${image}?w=${size}&h=${size}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size}&h=${size}&fit=crop&auto=format&dpr=2 2x`,
  };
};

const HotTags = ({ list = [] }) => {
  const getColumns = (width) => {
    return width < 767 ? 3 : 6;
  };

  const [columns, setColumns] = useState(getColumns(window.innerWidth));
  const updateDimensions = () => {
    setColumns(getColumns(window.innerWidth));
  };

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <ImageList sx={{ ml: 3, my: 3 }} cols={columns}>
      <ImageListItem key="Subheader" cols={6}>
        <Typography variant="h4" component="div">
          Hot Tags
        </Typography>
      </ImageListItem>
      {list.slice(0, columns).map((tag) => (
        <ImageListItem key={tag.value}>
          <img
            {...srcset(tag.illustrationUrl, 248)}
            alt={tag.label}
            loading="lazy"
          />
          <ImageListItemBar
            title={
              <Typography
                sx={{ color: "white !important", fontWeight: "600" }}
                variant="body1"
                component={Link}
                to={`/tours?type=tags&uid=${tag.value}`}
              >
                {tag.label}
              </Typography>
            }
            subtitle={`${tag.toursCount} tours`}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default HotTags;
