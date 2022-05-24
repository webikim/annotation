import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux';

import { Button, IconButton, Stack } from '@mui/material';

import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import { file_prev, file_next } from '../../store/anno/dirDuck';
import { cloth_save, cloth_delete, clear_status } from '../../store/anno/annoDuck';
import { Cookies } from 'react-cookie';
import { RootState } from '../../store/store';
import { red } from '@mui/material/colors';

const mapStateToProps = (state: RootState) => ({
    files: state.dir.files,
    save_result: state.anno.status,
    cur_file: state.dir.cur_file,
    auto_next: state.image.auto_next
})

const mapDispatchToProps = {
    clear_status,
    cloth_save,
    cloth_delete,
    file_prev,
    file_next
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface NavProps extends PropsFromRedux {
    cookies: Cookies
}

const Nav = (props: NavProps) => {
    const { cloth_save, cloth_delete, file_next, file_prev, cookies } = props
    useEffect(() => {
        if (props.save_result) {
            if (props.save_result === 1) {
                alert('저장되었습니다.');
                props.clear_status();
                if (props.auto_next)
                    props.file_next(props.cookies);
            } else if (props.save_result === -1) {
                alert('정보를 모두 입력하세요!');
                props.clear_status();
            }
        }
    }, [props, props.save_result])
    
    if (props.files) {
        return (
            <>
                <Stack direction='row' width='100%' spacing={2} justifyContent='space-evenly'>
                    <IconButton aria-label="left" size="small" sx={{ height: 36 }} onClick={(evt) => { file_prev(cookies) }}>
                        <KeyboardDoubleArrowLeftIcon></KeyboardDoubleArrowLeftIcon>
                    </IconButton>
                    <Button variant="contained" sx={{ width: 100 }} onClick={(evt) => { cloth_save()}}>Save</Button>
                    <Button variant="contained" sx={{ width: 100, backgroundColor: red['A700'] }}
                        onClick={(evt) => {
                            if (window.confirm('삭제하시겠습니까?')) {
                                cloth_delete();
                            }
                        }}>Delete</Button>
                    <IconButton aria-label="right" size="small" sx={{ height: 36 }} onClick={(evt) => { file_next(cookies) }}>
                        <KeyboardDoubleArrowRightIcon></KeyboardDoubleArrowRightIcon>
                    </IconButton>
                </Stack>
                {/* <Row>
                    <Col>
                        <input style={{ width: '80px', border: '2px solid #ced4da', padding: '1px 2px', borderRadius: '3px' }} type='text' value={ (props.cur_file || 0) + 1 } onClick={ onClickValue(props) } onChange={ (e) => { } }/>
                        <span>/({ (props.files || []).length })</span>
                    </Col>
                </Row> */}
            </>
        )
    } else
        return (
            <></>
        )
}


export default connector(Nav)