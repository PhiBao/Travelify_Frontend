import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";

const schema = Yup.object().shape({
  body: Yup.string().max(1000).required(),
});

const CommentForm = (props) => {
  const { id, username, avatarUrl, label, handleOnSubmit } = props;
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = useForm({
    defaultValues: {
      body: "",
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data, e) => {
    e.preventDefault();
    await handleOnSubmit(id, data);
    reset();
  };

  return (
    <Box
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        mb: 2,
        pl: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <Box mt={1} mr={2}>
          <Avatar
            alt={username}
            src={
              avatarUrl || `${process.env.PUBLIC_URL}/assets/images/unknown.png`
            }
          />
        </Box>
        <Box sx={{ width: "100%", mr: 3, mb: 1 }}>
          <TextareaAutosize
            {...register("body")}
            aria-label="comment"
            minRows={3}
            placeholder="Type your comment here, maximum 1000 characters."
            style={{ width: "100%" }}
          />
        </Box>
      </Box>
      <Box
        mr={2}
        component={Button}
        variant="contained"
        type="submit"
        size="small"
        disabled={!isDirty || !isValid}
      >
        {label}
      </Box>
    </Box>
  );
};

export default CommentForm;
