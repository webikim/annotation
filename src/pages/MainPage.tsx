import { Box, Container, CssBaseline, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import { connect, ConnectedProps } from 'react-redux';
import AnnotateImage from '../components/anno/AnnotateImage';
import RightPane from '../components/anno/RightPane';
import SelectDir from '../components/anno/SelectDir';

import { cloth_type_set, landmark_order_set, cloth_save, cloth_varied_set, bbox_show_toggle, mark_set, color_key } from '../store/anno/annoDuck';
import { file_prev, file_next } from '../store/anno/dirDuck';
import { RootState } from '../store/store';

const mapStateToProps = (state: RootState) => {
    return {
        bbox_show: state.anno.bbox_show,
        cur_dir: state.dir.cur_dir,
        cur_file: state.dir.cur_file,
        len_files: state.dir.files?.length || 0,
    }
}

const mapDispatchToProps = {
    bbox_show_toggle,
    cloth_save,
    cloth_type_set,
    cloth_varied_set,
    file_prev,
    file_next,
    landmark_order_set,
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface MainPageProps extends PropsFromRedux {
    cookies: Cookies
}

const onKeyPressHandler = (props: MainPageProps) => (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft')
        props.file_prev(props.cookies);
    else if (e.key === 'ArrowRight')
        props.file_next(props.cookies);
    const isType = ['1', '2', '3'].indexOf(e.key);
    if (isType > -1) {
        props.cloth_type_set(Object.keys(mark_set)[isType])
    }
    const landmark = color_key.indexOf(e.key)
    if (landmark > -1) {
        props.landmark_order_set(landmark);
    }
    if (e.key === 's' && (e.altKey || e.ctrlKey))
        props.cloth_save();
    else {
        const isVaried = ['a', 's', 'd', 'f', 'g'].indexOf(e.key);
        if (isVaried > -1)
            props.cloth_varied_set(isVaried + 1)
    }
    const isBbox = ['v', 'b'].indexOf(e.key);
    if (isBbox === 1)
        props.bbox_show_toggle();
    e.preventDefault();
}

const MainPage = (props : MainPageProps) => {
    const [started, setStarted] = useState(false);
    useEffect(() => {
        if (!started) {
            window.onkeydown = onKeyPressHandler(props);
            setStarted(true);
        }
    }, [props, started]);
    return (
        <>
            <CssBaseline />
            <Container maxWidth="lg">
                <Box sx={{ eight: '100vh' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <SelectDir cookies={ props.cookies }></SelectDir>
                        </Grid>
                        <Grid item lg={6} md={6} minWidth={512}>
                            <AnnotateImage cookies={props.cookies}></AnnotateImage>
                        </Grid>
                        <Grid item lg={6} md={6}>
                            { (props.cur_dir !== undefined && props.cur_file !== undefined && props.len_files > 0) && <RightPane cookies={props.cookies}/> }
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    )
}

export default connector(MainPage);