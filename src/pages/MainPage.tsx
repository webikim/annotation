import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Cookies } from 'react-cookie';
import { connect, ConnectedProps } from 'react-redux';

import AnnotateImage from '../components/AnnotateImage';
import ImageNav from '../components/ImageNav';
import RightPane from '../components/RightPane';
import SelectDir from '../components/SelectDir';
import { cloth_type_set, landmark_order_set, cloth_save, cloth_varied_set, bbox_show_toggle, mark_set, color_key } from '../store/modules/annoDuck';
import { file_prev, file_next } from '../store/modules/dirDuck';
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
        <div>
            <Row>
                <SelectDir cookies={ props.cookies }></SelectDir>
            </Row>
            <hr></hr>
            <Row>
                <Col>
                    <AnnotateImage></AnnotateImage>
                    <p></p>
                    { (props.len_files > 0 && props.cur_file !== undefined) && <ImageNav cookies={props.cookies} /> }
                </Col>
                <Col>
                    { (props.cur_dir !== undefined && props.cur_file !== undefined && props.len_files > 0) && <RightPane/> }
                </Col>
            </Row>
        </div>
    )
}

export default connector(MainPage);