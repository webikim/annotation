import React, { ChangeEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

import { cloth_varied_set } from '../store/modules/annoDuck';
import { RootState } from '../store/store';

const mapStateToProps = (state: RootState) => ({
    cloth_varied: state.anno.cloth_varied
})

const mapDispatchToProps = {
   cloth_varied_set 
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface ClothVariedProps extends PropsFromRedux {

}

const onChangeVaried = (set_cloth_varied: typeof cloth_varied_set) => (e: ChangeEvent<HTMLInputElement>) => {
    set_cloth_varied(parseInt(e.target.value));
}

const ClothVaried = ({ cloth_varied, cloth_varied_set }: ClothVariedProps) => {
    return (
        <Row md={5}>
            <Col>
                <input type="radio" name="varied" value="1" checked={ cloth_varied === 1 } onChange={ onChangeVaried(cloth_varied_set)} />
                <label>&nbsp;a. 없음</label>
            </Col>
            <Col>
                <input type="radio" name="varied" value="2" checked={ cloth_varied === 2 } onChange={ onChangeVaried(cloth_varied_set)}  />
                <label>&nbsp;s. 약간</label>
            </Col>
            <Col>
                <input type="radio" name="varied" value="3" checked={ cloth_varied === 3 } onChange={ onChangeVaried(cloth_varied_set)}  />
                <label>&nbsp;d. 많이</label>
            </Col>
            <Col>
                <input type="radio" name="varied" value="4" checked={ cloth_varied === 4 } onChange={ onChangeVaried(cloth_varied_set)}  />
                <label>&nbsp;f. 확대 약간</label>
            </Col>
            <Col>
                <input type="radio" name="varied" value="5" checked={ cloth_varied === 5 } onChange={ onChangeVaried(cloth_varied_set)}  />
                <label>&nbsp;g. 확대 많이</label>
            </Col>
        </Row>
    )
}

export default connector(ClothVaried)