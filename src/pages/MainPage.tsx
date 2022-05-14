import { useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Cookies } from 'react-cookie';
import { connect, ConnectedProps } from 'react-redux';

import AnnotateImage from '../components/AnnotateImage';
import ImageNav from '../components/ImageNav';
import RightPane from '../components/RightPane';
import SelectDir from '../components/SelectDir';

import { image_setpos } from '../store/modules/imageDuck';
import { RootState } from '../store/store';

const mapStateToProps = (state: RootState) => {
    return {
        len_files: state.dir.files?.length || 0,
        cur_dir: state.dir.cur_dir,
        cur_file: state.dir.cur_file,
    }
}

const mapDispatchToProps = {
    image_setpos
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface MainPageProps extends PropsFromRedux {
    cookies: Cookies
}

const MainPage = (props : MainPageProps) => {
    const imgRef = useRef();
    useEffect(() => {
        if (imgRef.current) {
            const bbox = (imgRef.current as HTMLImageElement).getBoundingClientRect();
            props.image_setpos(bbox.top, bbox.left);
        }
    })
    return (
        <div>
            <Row>
                <SelectDir cookies={ props.cookies }></SelectDir>
            </Row>
            <hr></hr>
            <Row>
                <Col>
                    <AnnotateImage imgRef={ imgRef }></AnnotateImage>
                    <p></p>
                    {(props.len_files > 0 && props.cur_file !== undefined) && <ImageNav cookies={props.cookies}/>}
                </Col>
                <Col>
                    { (props.cur_dir !== undefined && props.cur_file !== undefined && props.len_files > 0) && <RightPane/> }
                </Col>
            </Row>
        </div>
    )
}

export default connector(MainPage);