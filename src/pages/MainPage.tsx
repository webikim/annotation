import React, { useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Cookies } from 'react-cookie';
import { BsStopFill } from 'react-icons/bs';
import { connect, ConnectedProps } from 'react-redux';

import AnnotateImage from '../components/AnnotateImage';
import ClothType from '../components/ClothType';
import ClothVaried from '../components/ClothVaried';
import Landmark from '../components/Landmark';
import SelectDir from '../components/SelectDir'
import ImageNav from '../components/ImageNav'

import { image_setpos } from '../store/modules/imageDuck';
import { RootState } from '../store/store';
import BBox from '../components/BBox';

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
    var right = (<></>);
    if (props.cur_dir !== undefined && props.cur_file !== undefined && props.len_files)
        right = (
            <>
                <p></p>
                <Row>
                    <span><BsStopFill></BsStopFill> 옷 종류 (Cloth type)</span>
                    <hr></hr>
                    <ClothType></ClothType>
                </Row>
                <p></p>
                <Row>
                    <span><BsStopFill></BsStopFill> 랜드마크 (Landmark)</span>
                    <hr></hr>
                    <Landmark></Landmark>
                </Row>
                <p></p>
                <Row>
                    <span><BsStopFill></BsStopFill> 바운딩 박스 (Bounding Box)</span>
                    <hr></hr>
                    <BBox></BBox>
                </Row>
                <p></p>
                <Row>
                    <span><BsStopFill></BsStopFill> 자세 변형 정도 (Variation)</span>
                    <hr></hr>
                    <ClothVaried></ClothVaried>
                </Row>
                <p></p>
                <Row>
                    <span><BsStopFill></BsStopFill> AI-Hub 데이터 (base data)</span>
                    <hr></hr>
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
                    {(props.len_files > 0 && props.cur_file !== undefined) && <ImageNav cookies={props.cookies}></ImageNav>}
                </Col>
                <Col>
                    { right }
                </Col>
            </Row>
        </div>
    )
}

export default connector(MainPage);