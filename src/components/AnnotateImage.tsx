import React from 'react'
import { BsFillFileEarmarkFill } from "react-icons/bs";
import { connect } from 'react-redux'

import { encodeQueryData } from '../common/ajax';
import { file_setpos } from '../store/modules/dirDuck';

type AnnotateImageProp = {
    imgRef: any,
    cur_dir: any,
    cur_file: any,
    files: any[],
    file_set: (pos : number) => void
}

const render_marks = (props: AnnotateImageProp) => {
    return (
        <></>
    )
}

const render_bbox = (props: AnnotateImageProp) => {
    return (
        <></>
    )
}

const onClickSearch = (props: AnnotateImageProp) => (e: React.MouseEvent<HTMLInputElement>) => {
    let value = prompt("검색할 파일을 입력하세요", (e.target as HTMLInputElement).value);
    if (value) {
        const pos = props.files.indexOf(value);
        if (pos >= 0)
            props.file_set(pos);
        else
            alert('파일을 찾을 수 없습니다.')
    }
    e.currentTarget.blur();
}

const AnnotateImage = (props: AnnotateImageProp) => {
    if (props.files !== undefined && props.files.length > 0 && props.cur_file !== undefined) {
        const file = props.files[props.cur_file];
        return (
            <>
                <p style={{ fontWeight: 700 }}><BsFillFileEarmarkFill></BsFillFileEarmarkFill> 파일명 : \
                    <input style={{ border: '2px solid #ced4da', padding: '1px 2px', borderRadius: '3px' }} type='text' value={file} onClick={onClickSearch(props)} onChange={(e) => { }}></input>
                </p>
                <div>
                    <img alt='annotation target' ref={ props.imgRef } draggable='false'
                        src={ '/img?' + encodeQueryData({ 'path': props.cur_dir, 'name': file }) }></img>
                </div>
                { render_marks(props) }
                { render_bbox(props) }
            </>
        )
    } else {
        return (
            <>
                <p> </p>
                <div>
                    <img ref={ props.imgRef } src='static/33.jpg' alt='reference'></img>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state: any) => {
    return {
        cur_dir: state.dir.cur_dir,
        cur_file: state.dir.cur_file,
        files: state.dir.files
    }
}

export default connect(mapStateToProps, { file_set: file_setpos })(AnnotateImage)