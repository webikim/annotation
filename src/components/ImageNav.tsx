import React, { MouseEventHandler, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";

import { file_set, file_prev, file_next } from '../store/modules/dirDuck';
import { cloth_save, cloth_delete, clear_status } from '../store/modules/annoDuck';
import { Cookies } from 'react-cookie';
import { RootState } from '../store/store';

const mapStateToProps = (state: RootState) => ({
    files: state.dir.files,
    save_result: state.anno.status,
    cur_dir: state.dir.cur_dir,
    cur_file: state.dir.cur_file,
    auto_next: state.anno.auto_next
})

const mapDispatchToProps = {
    clear_status,
    cloth_save,
    cloth_delete,
    file_prev,
    file_next,
    file_set
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface NavProps extends PropsFromRedux {
    cookies: Cookies
}

const onClickPrev = ({ file_prev, cookies }: NavProps): MouseEventHandler<HTMLButtonElement> => (e) => {
    file_prev(cookies);
}

const onClickNext = ({ file_next, cookies }: NavProps): MouseEventHandler<HTMLButtonElement> => (e) => {
    file_next(cookies);
}

const onClickSave = ({ cloth_save }: NavProps): MouseEventHandler<HTMLButtonElement> => (e) => {
    cloth_save();
}

const onClickDelete = ({ cloth_delete }: NavProps): MouseEventHandler<HTMLButtonElement> => (e) => {
    if (window.confirm('삭제하시겠습니까?')) {
        cloth_delete();
    }
}

const onClickValue = ({ files, file_set, cookies, cur_dir }: NavProps): MouseEventHandler<HTMLInputElement> => (e) => {
    if (files && cur_dir) {
        let value = prompt("이동할 번호를 입력하세요:", (e.target as HTMLInputElement).value);
        if (value) {
            const page = parseInt(value) - 1;
            if (page >= 0 && page < files.length) {
                file_set(page);
                cookies.set(cur_dir, page);
            }
        }
    }
    (e.target as HTMLInputElement).blur();
}

const Nav = (props: NavProps) => {
    useEffect(() => {
        if (props.save_result) {
            if (props.save_result === 1) {
                alert('저장되었습니다.');
                props.clear_status();
                if (props.auto_next)
                    props.file_next(props.cookies);
            } else if (props.save_result === -1) {
                alert('정보를 모두 입력하세요!');
                props.clear_status();
            }
        }
    }, [props, props.save_result])
    
    if (props.files) {
        return (
            <>
                <Row>
                    <Col>
                        <Button variant='outline-secondary' size='sm' onClick={ onClickPrev(props) }>
                            <BsArrowLeftShort></BsArrowLeftShort>이전</Button>
                    </Col>
                    <Col>
                        <input style={{ width: '80px', border: '2px solid #ced4da', padding: '1px 2px', borderRadius: '3px' }} type='text' value={ (props.cur_file || 0) + 1 } onClick={ onClickValue(props) } onChange={ (e) => { } }/>
                        <span>/({ (props.files || []).length })</span>
                    </Col>
                    <Col>
                        <Button variant='outline-secondary' size='sm' onClick={ onClickNext(props) }>
                            다음<BsArrowRightShort></BsArrowRightShort></Button>
                    </Col>
                    <Col>
                    </Col>
                </Row>
                <p></p>
                <Row>
                    <Col></Col>
                    <Col></Col>
                    <Col>
                        <Button onClick={ onClickSave(props) }>저장</Button>
                    </Col>
                    <Col>
                        <Button style={{ backgroundColor: 'red' }} onClick={ onClickDelete(props) }>삭제</Button>
                    </Col>
                </Row>
            </>
        )
    } else
        return (
            <></>
        )
}


export default connector(Nav)