import React, { ChangeEvent, Children, MouseEventHandler } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { BsXCircleFill } from "react-icons/bs";

import { mark_set, color_set, color_key, landmark_order_set, landmark_order_clear, landmark_clear } from '../store/modules/annoDuck';
import { RootState } from '../store/store';

const mapStateToProps = (state: RootState) => ({
    cloth_type: state.anno.cloth_type,
    landmark_order: state.anno.landmark_order
})

const mapDispatchToProps = {
    landmark_order_set,
    landmark_order_clear,
    landmark_clear
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface LandmarkProps extends PropsFromRedux {

}

const onChangeColor = ({ landmark_order_set }: LandmarkProps) => (e: ChangeEvent<HTMLInputElement>) => {
    landmark_order_set(parseInt(e.target.value));
}

const onClickClear = ({ landmark_order_clear }: LandmarkProps, colorkey_order: number): MouseEventHandler<SVGElement> => (e) => {
    landmark_order_clear(colorkey_order);
}

const Landmark = (props: LandmarkProps) => {
    let legend = []
    if (props.cloth_type !== undefined) {
        for (let i in mark_set[props.cloth_type]) {
            const color = color_set[mark_set[props.cloth_type][i]];
            let colorkey = color[0];
            let colorkey_order: number = color_key.indexOf(colorkey);
            let color1 = { backgroundColor: color[1], border: 'none' };
            let color2 = { backgroundColor: color[2], border: 'none' };
            legend.push(
                <Row md={4}>
                    <Col>
                        <input type="radio" name="mark" value={ colorkey_order } checked={ props.landmark_order === colorkey_order } onChange={ onChangeColor(props)} />
                        &nbsp;{ colorkey }. { mark_set[props.cloth_type][i] }
                    </Col>
                    <Col>
                        <button style={color1}>visible&nbsp;</button>
                        <button style={color2}>hidden</button>
                    </Col>
                    <Col>
                        <BsXCircleFill onClick={ onClickClear(props, colorkey_order) }></BsXCircleFill>
                    </Col>
                </Row>
            )
        }
    }
    return (
        <>
            { Children.toArray(legend) }
        </>
    )
}

export default connector(Landmark)