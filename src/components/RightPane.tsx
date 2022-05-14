import React, { ChangeEventHandler } from 'react';
import { Row } from 'react-bootstrap';
import { BsStopFill } from 'react-icons/bs';
import { connect, ConnectedProps } from 'react-redux';
import { image_auto_next } from '../store/modules/annoDuck';
import { RootState } from '../store/store';
import BBox from './BBox';
import ClothType from './ClothType';
import ClothVaried from './ClothVaried';
import Landmark from './Landmark';

const mapStateToProps = (state: RootState) => ({
    auto_next: state.anno.auto_next
})

const mapDispatchToProps = {
    image_auto_next
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface RightPanceProps extends PropsFromRedux {

}

const onChangeAutoNext = ({ image_auto_next, auto_next }: RightPanceProps): ChangeEventHandler<HTMLInputElement> => (e) => {
    image_auto_next(auto_next === 1 ? 0 : 1);
}

const RightPane = (props: RightPanceProps) => {
    return (
        <>
            <Row>
                <label>
                    <input type='checkbox' checked={ props.auto_next === 1 } onChange={ onChangeAutoNext(props) }></input> 저장하면 다음으로 (move next when save)
                </label>
            </Row>
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
}

export default connector(RightPane);