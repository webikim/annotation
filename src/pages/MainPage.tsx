import React, { useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Cookies } from 'react-cookie';
import { connect } from 'react-redux';
import AnnotateImage from '../components/AnnotateImage';

import SelectDir from '../components/SelectDir'
import { RootState } from '../store/store';

type MainPageProps = {
    cookies: Cookies
}

const MainPage = (props : MainPageProps) => {
    const imgRef = useRef();
    var right = (<></>);
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

const mapStateToProps = (state: RootState) => {
    return {}
}

export default connect(mapStateToProps, { })(MainPage);