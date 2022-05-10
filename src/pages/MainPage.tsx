import React, { useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Cookies } from 'react-cookie';
import { BsStopFill } from 'react-icons/bs';
import { connect, ConnectedProps } from 'react-redux';
import AnnotateImage from '../components/AnnotateImage';
import ClothType from '../components/ClothType';

import SelectDir from '../components/SelectDir'
import { RootState } from '../store';

const mapStateToProps = (state: RootState) => {
    return {
        cur_dir: state.dir.cur_dir,
    }
}

const mapDispatchToProps = {

}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface MainPageProps extends PropsFromRedux {
    cookies: Cookies
}

const MainPage = (props : MainPageProps) => {
    const imgRef = useRef();
    var right = (<></>);
    if (props.cur_dir)
        right = (
            <>
                <p></p>
                <Row>
                    <span><BsStopFill></BsStopFill> 옷 종류(Cloth type)</span>
                    <hr></hr>
                    <ClothType></ClothType>
                </Row>
            </>
        )
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
                </Col>
                <Col>
                    { right }
                </Col>
            </Row>
        </div>
    )
}

export default connector(MainPage);