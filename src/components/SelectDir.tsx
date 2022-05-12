import React, { ChangeEvent, Children } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Col, Row } from 'react-bootstrap';
import { BsFolder2Open } from "react-icons/bs";

import { dir_list, dir_set, file_setpos } from '../store/modules/dirDuck';

const mapStateToProps = (state : RootState) => {
    return {
        dirs: state.dir.dirs
    }
}

const mapDispatchToProps = {
        dir_list,
        dir_set,
        file_setpos 
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface SelectDirProps extends PropsFromRedux {
    cookies: any
}
 
const onChangeHandle = ({ dir_set, file_setpos, cookies }: SelectDirProps) => (e : ChangeEvent<HTMLSelectElement>) => {
    dir_set(e.target.value);
    file_setpos(parseInt(cookies.get(e.target.value) || 0));
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
        <option data-testid='select-option' value='.'>./</option>
    )
    for (let i in dirs)
        dir_elem.push(
            <option data-testid='select-option' value={dirs[i]}>./{ dirs[i] }</option>
        )
    return (
        <Row style={{ marginTop: '10px' }}>
            <Col sm={2}>
                <span style={{ fontWeight: 700 }}><BsFolder2Open></BsFolder2Open>&nbsp; 작업 위치 (Location)</span>
            </Col>
            <Col sm={10}>
                <select style={{ width: '100%'}} onChange={ onChangeHandle(props) } data-testid='select'>
                    { Children.toArray(dir_elem) }
                </select>
            </Col>
        </Row>
    );
}
   
export default connector(SelectDir);