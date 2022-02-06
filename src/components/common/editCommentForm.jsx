import { useEffect } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Avatar from "@mui/material/Avatar";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const schema = Yup.object().shape({
  body: Yup.string().max(1000).required(),
});

const EditCommentForm = (props) => {
  const { open, handleClose, body, avatarUrl, username, onSubmit, ...other } =
    props;
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      body: "",
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue("body", body);
  }, [body]);

  return (
    <Dialog
      fullWidth={true}
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      {...other}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        noValidate
      >
        <DialogTitle>Edit comment</DialogTitle>
        <DialogContent>
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
                  avatarUrl ||
                  `${process.env.PUBLIC_URL}/assets/images/unknown.png`
                }
              />
            </Box>
            <Box sx={{ width: "100%", mr: 3, mb: 1 }}>
              <TextareaAutosize
                {...register("body")}
                aria-label="comment"
                minRows={5}
                style={{ width: "100%" }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Edit</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default EditCommentForm;
