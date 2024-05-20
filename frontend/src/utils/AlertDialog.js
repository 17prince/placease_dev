import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({
  mssgButton,
  btn1Text,
  btn2Text,
  dialogTitle,
  dialogText,
  onClickYes,
  index,
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleAction = (e) => {
    onClickYes(e);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        sx={{ backgroundColor: "#176b87" }}
        onClick={handleClickOpen}
      >
        {mssgButton}
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {dialogText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{ backgroundColor: "#176b87" }}
          >
            {btn1Text}{" "}
          </Button>
          <Button
            onClick={handleAction}
            variant="contained"
            index={index}
            sx={{ backgroundColor: "#176b87" }}
          >
            {btn2Text}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
