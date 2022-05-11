import React, { Children, CSSProperties, MouseEvent } from 'react'
import { BsFillFileEarmarkFill } from "react-icons/bs";
import { connect, ConnectedProps } from 'react-redux'

import { encodeQueryData } from '../common/ajax';
import { RootState } from '../store';
import { color_set, landmark_set } from '../store/modules/annoDuck';
import { file_setpos } from '../store/modules/dirDuck';

const mapStateToProps = (state: RootState) => {
    return {
        cur_dir: state.dir.cur_dir,
        cur_file: state.dir.cur_file,
        files: state.dir.files,
        landmark_order: state.anno.landmark_order,
        marks: state.anno.marks,
        image: state.image.image
    }
}

const mapDispatchToProps = {
    file_setpos,
    landmark_set
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface AnnotateImageProp extends PropsFromRedux {
    imgRef: any
}

const onClickHandle = ({ landmark_set, landmark_order }: AnnotateImageProp) => (e: MouseEvent) => {
    const rect = (e.target as HTMLImageElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    landmark_set(landmark_order, 0, x, y);
}

const onRightClickHandle = ({ landmark_set, landmark_order }: AnnotateImageProp) => (e: MouseEvent) => {
    const rect = (e.target as HTMLImageElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    landmark_set(landmark_order, 1, x, y);
    e.preventDefault();
}

const render_marks = (props: AnnotateImageProp) => {
    let elem = [];
    if (props.marks !== undefined && props.image !== undefined) {
        const marks = props.marks;
        const marks_keys: string[] = Object.keys(marks);
        for (let i in marks_keys) {
            const order = marks[+marks_keys[i]];
            const order_keys = Object.keys(order);
            for (let j in order_keys) {
                const colors = color_set[Object.keys(color_set)[+marks_keys[i]]];
                for (let k in order[+order_keys[j]]) {
                    const mark = order[+order_keys[j]][k];
                    let mark_style: CSSProperties = {
                        width: '9px',
                        height: '9px',
                        backgroundColor: colors[parseInt(order_keys[j]) + 1],
                        position: 'absolute',
                        top: (props.image.top + mark.y - 4) + 'px',
                        left: (props.image.left + mark.x - 4) + 'px',
                        borderStyle: 'solid'
                    }
                    elem.push(
                        <div style={ mark_style }></div>
                    )
                }
            }
        }
        return (
            <>
                { Children.toArray(elem) }
            </>
        )
    }
    return (
        <></>
    )
}

const render_bbox = (props: AnnotateImageProp) => {
    return (
        <></>
    )
}

const onClickSearch = (props: AnnotateImageProp) => (e: MouseEvent<HTMLInputElement>) => {
    let value = prompt("검색할 파일을 입력하세요", (e.target as HTMLInputElement).value);
    if (value) {
        const pos = (props.files || []).indexOf(value);
        if (pos >= 0)
            props.file_setpos(pos);
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
                <p style={{ fontWeight: 700 }}><BsFillFileEarmarkFill></BsFillFileEarmarkFill> 파일명 :&nbsp; 
                    <input style={{ border: '2px solid #ced4da', padding: '1px 2px', borderRadius: '3px' }}
                        type='text' value={file} onClick={onClickSearch(props)} onChange={(e) => { }}></input>
                </p>
                <div>
                    <img alt='annotation target' ref={ props.imgRef } draggable='false'
                        src={'/img?' + encodeQueryData({ 'path': '' + props.cur_dir, 'name': '' + file })}
                            onClick={ onClickHandle(props) }
                            onContextMenu={ onRightClickHandle(props) }></img>
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

export default connector(AnnotateImage)