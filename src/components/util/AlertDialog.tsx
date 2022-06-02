import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface AlertDialogProps {
    open: boolean,
    onClose: (answer: boolean) => void,
    title?: string,
    message: string,
    children?: JSX.Element
}

const AlertDialog: React.FC<AlertDialogProps> = (props: AlertDialogProps) => {
    const { open, onClose, title, message, children } = props

    const handleClose = (answer: boolean) => () =>{
        onClose(answer);
    };

    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                {title && <DialogTitle>{title}</DialogTitle>}
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {message}
                    </DialogContentText>
                    {children || <></>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose(false)}>Cancel</Button>
                    <Button onClick={handleClose(true)}>OK</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AlertDialog;