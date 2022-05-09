import React, { Children } from 'react'
import { connect } from 'react-redux'
import { Col, Row } from 'react-bootstrap';
import { BsFolder2Open } from "react-icons/bs";

import { dir_list, dir_set } from '../store/modules/dirDuck';

type SelectDirProps = {
    dirs: any,
    cookies: any,
    dir_set: any,
    dir_list: any
}

const onChangeHandle = (props : SelectDirProps) => (e : React.ChangeEvent<HTMLSelectElement>) => {
    props.dir_set(e.target.value, parseInt(props.cookies.get(e.target.value)));
    e.target.blur();
}

const SelectDir = (props: SelectDirProps) => {
    const { dirs } = props;
    if (dirs === undefined) {
        props.dir_list();
        return ( <></> );
    }
    let dir_elem = [];
    dir_elem.push(
        <option data-testid='select-option' value='.'>./ (현재위치)</option>
    )
    for (let i in dirs)
        dir_elem.push(
            <option data-testid='select-option' value={dirs[i]}>./{ dirs[i] }</option>
        )
    return (
        <Row style={{ marginTop: '10px' }}>
            <Col sm={2}>
                <span style={{ fontWeight: 700 }}><BsFolder2Open></BsFolder2Open>&nbsp; 랜드마크 작업 위치 </span>
            </Col>
            <Col sm={10}>
                <select style={{ width: '100%'}} onChange={ onChangeHandle(props) } data-testid='select'>
                    { Children.toArray(dir_elem) }
                </select>
            </Col>
        </Row>
    );
}

const mapStateToProps = (state : any) => {
    return {
        dirs: state.dir.dirs
    }
}

export default connect(mapStateToProps, { dir_list, dir_set })(SelectDir)