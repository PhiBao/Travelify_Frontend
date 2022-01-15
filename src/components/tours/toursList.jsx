import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Pagination from "@mui/material/Pagination";
import Select from "react-select";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { connect } from "react-redux";
import { makeStyles } from "@mui/styles";
import _ from "lodash";
import Typography from "@mui/material/Typography";
import Loading from "../layout/loading";
import TourItem from "./tourItem";
import { loadTours } from "../../store/tours";
import useDocumentTitle from "../../utils/useDocumentTitle";

const useStyles = makeStyles((theme) => ({
  stack: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    [theme.breakpoints.down(900)]: {
      flexDirection: "column",
      "& .MuiPaper-root": {
        width: "100% !important",
        height: "730px !important",
      },
      "& img": {
        height: "400px !important",
      },
    },
    [theme.breakpoints.down(567)]: {
      "& .MuiPaper-root": {
        height: "630px !important",
      },
      "& img": {
        height: "300px !important",
      },
    },
  },
}));

const sortPath = [
  { value: "createdAt", label: "Newest" },
  { value: "price", label: "Price" },
  { value: "rate", label: "Favorite" },
];

const ToursList = (props) => {
  useDocumentTitle("Tours list");
  const { list, meta, loadTours, loading } = props;
  const [searchParams] = useSearchParams();
  const { total } = meta;
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [path, setPath] = useState(sortPath[0]);
  const [order, setOrder] = useState("desc");

  const params = Object.fromEntries(searchParams);

  useEffect(async () => {
    await loadTours(params);
  }, [searchParams]);

  const handlePageChange = async (e, value) => {
    e.preventDefault();
    await loadTours({ ...params, page: value });
    setPage(value);
  };

  const handlePathChange = (data) => {
    setPath(data);
  };

  const handleOrderChange = (e, value) => {
    e.preventDefault();
    setOrder(value);
  };

  const tours = _.orderBy(list, [path.value], [order]);

  return (
    <Container>
      <Box mt={10} mb={1}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Typography mr={1} variant="h6">
            Sort by:
          </Typography>
          <Select onChange={handlePathChange} options={sortPath} value={path} />
          <ToggleButtonGroup
            value={order}
            exclusive
            onChange={handleOrderChange}
            aria-label="order sort"
            size="small"
            color="primary"
          >
            <ToggleButton value="desc" aria-label="descending">
              <ArrowDownwardIcon />
            </ToggleButton>
            <ToggleButton value="asc" aria-label="ascending">
              <ArrowUpwardIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Grid mb={2} container spacing={1}>
        {loading && <Loading />}
        {list.length === 0 && (
          <Typography
            sx={{ height: "50vh", mt: 3 }}
            variant="h3"
            component="h1"
          >
            We can't find what you need, please try another way!
          </Typography>
        )}
        {tours.map((tour) => (
          <Grid className={classes.stack} key={tour.id} item xs={12} md={4}>
            <TourItem item={tour} />
          </Grid>
        ))}
      </Grid>
      {Math.ceil(total / 9) > 1 && (
        <Pagination
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 1,
          }}
          count={Math.ceil(total / 9)}
          page={page}
          onChange={handlePageChange}
        />
      )}
    </Container>
  );
};

const mapStateToProps = (state) => ({
  list: state.entities.tours.list,
  meta: state.entities.tours.meta,
  loading: state.entities.tours.loading,
});

const mapDispatchToProps = (dispatch) => ({
  loadTours: (params) => dispatch(loadTours(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToursList);
