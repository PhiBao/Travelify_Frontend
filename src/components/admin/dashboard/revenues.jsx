import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Box from "@mui/material/Box";
import { useForm, Controller } from "react-hook-form";
import ReactSelect from "react-select";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import { yupResolver } from "@hookform/resolvers/yup";
import SimpleAreaChart from "../charts/simpleAreaChart";
import { loadRevenues, searchRevenues } from "../../../store/admin";
import { months, years } from "../../../helpers/dashboardHelper";

const schema = Yup.object().shape({
  month: Yup.object({
    value: Yup.string().required(),
    label: Yup.string().required(),
  }),
  year: Yup.object({
    value: Yup.string().required(),
    label: Yup.string().required(),
  }),
});

const Revenues = (props) => {
  const { data, loadRevenues, searchRevenues } = props;
  const { current = [], other = [] } = data;

  const [iMonth, setMonth] = useState(0);
  const [iYear, setYear] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm({
    defaultValues: {
      year: {},
      month: {},
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data, e) => {
    e.preventDefault();
    setMonth(data.month.value);
    setYear(data.year.value);
    await searchRevenues({ month: data.month.value, year: data.year.value });
  };

  useEffect(async () => {
    await loadRevenues();
    const curMonth = new Date().getMonth();
    const curYear = new Date().getFullYear();
    if (curMonth === 0) {
      setMonth(12);
      setYear(curYear - 1);
    } else {
      setMonth(curMonth);
      setYear(curYear);
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mt: 10,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <SimpleAreaChart
          title="Current Revenues"
          data={current}
          name="revenues"
          grid
        />
      </Box>
      <Box
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        component="form"
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="month"
          control={control}
          render={({ field: { onChange } }) => (
            <ReactSelect
              onChange={(e) => {
                onChange(e);
              }}
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              options={months}
              placeholder="Select a month..."
            />
          )}
        />
        <Controller
          name="year"
          control={control}
          render={({ field: { onChange } }) => (
            <ReactSelect
              onChange={(e) => {
                onChange(e);
              }}
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              options={years}
              placeholder="Select a year..."
            />
          )}
        />
        <Button
          sx={{ ml: 1 }}
          variant="outlined"
          type="submit"
          endIcon={<FindInPageIcon />}
          disabled={!isDirty || !isValid}
        >
          Search
        </Button>
      </Box>
      <Box sx={{ width: "100%" }}>
        <SimpleAreaChart
          title={`Revenues in ${iMonth}/${iYear}`}
          data={other}
          name="revenues"
          grid
        />
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  data: state.entities.admin.data,
});

const mapDispatchToProps = (dispatch) => ({
  loadRevenues: () => dispatch(loadRevenues()),
  searchRevenues: (params) => dispatch(searchRevenues(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Revenues);
