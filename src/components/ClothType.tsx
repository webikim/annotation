import React, { ChangeEvent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Row, Col } from 'react-bootstrap';

import { cloth_type_set } from '../store/modules/annoDuck';

const mapStateToProps = (state: RootState) => {
    return {
        cloth_type: state.anno.cloth_type
    }
}

const mapDispatchToProps = {
    cloth_type_set
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface ClothTypeProps extends PropsFromRedux {

}

const onChangeCloth = ({ cloth_type_set }: ClothTypeProps) => (e: ChangeEvent<HTMLInputElement>) => {
    cloth_type_set(e.target.value);
}

const ClothType = (props: ClothTypeProps) => {
    return (
        <Row md={4}>
            <Col>
                <input type="radio" name="cloth_type" value="upper" checked={ props.cloth_type === 'upper' } onChange={ onChangeCloth(props)} />
                <label>&nbsp;1. 상의</label>
            </Col>
            <Col>
                <input type="radio" name="cloth_type" value="lower" checked={ props.cloth_type === 'lower' } onChange={ onChangeCloth(props)}  />
                <label>&nbsp;2. 하의</label>
            </Col>
            <Col>
                <input type="radio" name="cloth_type" value="full" checked={ props.cloth_type === 'full' } onChange={ onChangeCloth(props)}  />
                <label>&nbsp;3. 전체</label>
            </Col>
        </Row>
    )
}

export default connector(ClothType)