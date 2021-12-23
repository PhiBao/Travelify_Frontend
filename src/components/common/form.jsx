import { Controller } from "react-hook-form";
import ReactSelect from "react-select";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { DateTimePicker, DatePicker } from "@mui/lab";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import CreatableSelect from "react-select/creatable";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";

export const TextInputField = ({
  control,
  name,
  label,
  type = "text",
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          helperText={error?.message}
          id={name}
          error={!!error}
          label={label}
          size="medium"
          margin="normal"
          variant="standard"
          type={type}
          fullWidth
          {...rest}
        />
      )}
    />
  );
};

export const FormButton = ({ label, ...rest }) => {
  return (
    <Button type="submit" variant="contained" {...rest}>
      {label}
    </Button>
  );
};

export const FormCheckbox = ({ control, name, label, ...rest }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={() => (
        <FormControlLabel control={<Checkbox {...rest} />} label={label} />
      )}
    />
  );
};

export const Select = ({
  name,
  handleChange,
  label,
  control,
  error,
  ...rest
}) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Chip label={label} sx={{ borderRadius: 0, fontWeight: 500 }} />
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange } }) => (
          <ReactSelect
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            onChange={(e) => {
              onChange(e);
              if (handleChange) handleChange(e);
            }}
            {...rest}
          />
        )}
      />
      {error && <Alert severity="error">{error.message}</Alert>}
    </Box>
  );
};

export const Creatable = ({
  name,
  handleChange,
  label,
  control,
  error,
  ...rest
}) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Chip label={label} sx={{ borderRadius: 0, fontWeight: 500 }} />
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <CreatableSelect
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            {...field}
            {...rest}
            isMulti
            isClearable
          />
        )}
      />
      {error && <Alert severity="error">{error.message}</Alert>}
    </Box>
  );
};

export const DatePickerField = ({ name, label, control, ...rest }) => {
  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <DatePicker
              value={value}
              onChange={(e) => onChange(e)}
              label={label}
              {...rest}
              renderInput={(params) => (
                <TextField
                  error={!!error}
                  helperText={error?.message}
                  margin="normal"
                  fullWidth
                  {...params}
                />
              )}
            />
          )}
        />
      </LocalizationProvider>
    </Box>
  );
};

export const DateTimePickerField = ({ name, label, control, ...rest }) => {
  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <DateTimePicker
              value={value}
              onChange={(e) => onChange(e)}
              label={label}
              {...rest}
              renderInput={(params) => (
                <TextField
                  error={!!error}
                  helperText={error?.message}
                  margin="normal"
                  fullWidth
                  {...params}
                />
              )}
            />
          )}
        />
      </LocalizationProvider>
    </Box>
  );
};
