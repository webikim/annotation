import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux';

import { Button, IconButton, Stack } from '@mui/material';

import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import { cloth_save, cloth_delete, CLOTH_SAVE } from '../../store/anno/annoDuck';
import { status_reset } from '../../store/comDuck';
import { file_prev, file_next } from '../../store/anno/dirDuck';
import { Cookies } from 'react-cookie';
import { RootState } from '../../store/store';
import { red } from '@mui/material/colors';
import AlertBar from '../util/AlertBar';
import AlertDialog from '../util/AlertDialog';

const mapStateToProps = (state: RootState) => ({
    files: state.dir.files,
    status: state.com.status,
    cur_file: state.dir.cur_file,
    auto_next: state.image.auto_next
})

const mapDispatchToProps = {
    cloth_save,
    cloth_delete,
    file_prev,
    file_next,
    status_reset
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface NavProps extends PropsFromRedux {
    cookies: Cookies
}

const Nav = (props: NavProps) => {
    const { cloth_save, cloth_delete, file_next, file_prev, status_reset, cookies, files, status } = props
    const [openAlert, setOpenAlert] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [message, setMessage] = useState('');

    if (!openAlert && status[CLOTH_SAVE]) {
        if (status[CLOTH_SAVE] === 1)
            setMessage('저장되었습니다.')
        else
            setMessage('저장되지 않았습니다. 정보를 모두 입력하세요!.')
        setOpenAlert(true);
    }

    const handleAlertClose = () => {
        setOpenAlert(false);
        if (status[CLOTH_SAVE]) {
            status_reset(CLOTH_SAVE);
            if (status[CLOTH_SAVE] === 1 && props.auto_next)
                file_next(cookies);
        }
    }

    const handleDelete = (answer: boolean) => {
        setOpenDialog(false);
        if (answer)
            cloth_delete();
    }
    
    if (files) {
        return (
            <>
                <Stack direction='row' width='100%' spacing={2} justifyContent='space-evenly'>
                    <IconButton aria-label="left" size="small" sx={{ height: 36 }} onClick={(evt) => { file_prev(cookies) }}>
                        <KeyboardDoubleArrowLeftIcon></KeyboardDoubleArrowLeftIcon>
                    </IconButton>
                    <Button variant="contained" sx={{ width: 100 }} onClick={(evt) => { cloth_save()}}>Save</Button>
                    <Button variant="contained" sx={{ width: 100, backgroundColor: red['A700'] }}
                        onClick={(evt) => {
                            setOpenDialog(true);
                        }}>Delete</Button>
                    <IconButton aria-label="right" size="small" sx={{ height: 36 }} onClick={(evt) => { file_next(cookies) }}>
                        <KeyboardDoubleArrowRightIcon></KeyboardDoubleArrowRightIcon>
                    </IconButton>
                </Stack>
                <AlertBar open={openAlert} onClose={handleAlertClose} message={message}></AlertBar>
                <AlertDialog open={openDialog} onClose={handleDelete} message='삭제하시겠습니까?'></AlertDialog>
            </>
        )
    } else
        return (
            <></>
        )
}

export default connector(Nav)