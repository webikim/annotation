import React, { Children, CSSProperties, DragEventHandler, LegacyRef, MouseEvent, useEffect, useRef, useState } from 'react'
import { BsFillFileEarmarkFill } from "react-icons/bs";
import { connect, ConnectedProps } from 'react-redux'

import { encodeQueryData } from '../common/ajax';
import { API_IMG_GET } from '../common/urls';
import { bbox_set, color_set, landmark_set } from '../store/modules/annoDuck';
import { file_set } from '../store/modules/dirDuck';
import { RootState } from '../store/store';
import { BBoxType, Position } from '../typings';

const mapStateToProps = (state: RootState) => ({
    bbox: state.anno.bbox,
    bbox_show: state.anno.bbox_show,
    bbox_update: state.anno.bbox_update,
    cur_dir: state.dir.cur_dir,
    cur_file: state.dir.cur_file,
    files: state.dir.files,
    landmark_order: state.anno.landmark_order,
    marks: state.anno.marks,
})

const mapDispatchToProps = {
    bbox_set,
    file_set,
    landmark_set
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface AnnotateImageProp extends PropsFromRedux {

}

const onClickHandle = ({ landmark_set, landmark_order }: AnnotateImageProp) => (e: MouseEvent) => {
    const rect = (e.target as HTMLImageElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log('..... rect : ', rect, ', x: ', x, ', y: ', y)
    if (landmark_order !== undefined)
        landmark_set(landmark_order, 0, x, y);
}

const onRightClickHandle = ({ landmark_set, landmark_order }: AnnotateImageProp) => (e: MouseEvent) => {
    const rect = (e.target as HTMLImageElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (landmark_order !== undefined)
        landmark_set(landmark_order, 1, x, y);
    e.preventDefault();
}

const render_marks = (props: AnnotateImageProp, pos: Position) => {
    let elem = [];
    if (props.marks !== undefined) {
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
                        top: (pos.top + mark.y - 4) + 'px',
                        left: (pos.left + mark.x - 4) + 'px',
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

const onClickSearch = (props: AnnotateImageProp) => (e: MouseEvent<HTMLInputElement>) => {
    let value = prompt("검색할 파일을 입력하세요", (e.target as HTMLInputElement).value);
    if (value) {
        const pos = (props.files || []).indexOf(value);
        if (pos >= 0)
            props.file_set(pos);
        else
            alert('파일을 찾을 수 없습니다.')
    }
    e.currentTarget.blur();
}

const onDragTop = (bbox: BBoxType, pos: Position, bbox_set: (bbox: object)=> void): DragEventHandler<HTMLImageElement> => (e) => {
    if (e.pageX !== 0 && e.pageY !== 0) {
        const moveX = bbox.x - (e.pageX - pos.left);
        const moveY = bbox.y - (e.pageY - pos.top);
        bbox_set({x: bbox.x - moveX, y: bbox.y - moveY, width: bbox.width + moveX, height: bbox.height + moveY});
    }
    e.preventDefault();
}

const onDragDown = (bbox: BBoxType, pos: Position, bbox_set: (bbox: object)=> void): DragEventHandler<HTMLImageElement> => (e) => {
    if (e.pageX !== 0 && e.pageY !== 0) {
        const moveX = bbox.x + bbox.width - (e.pageX - pos.left);
        const moveY = bbox.y + bbox.height - (e.pageY -pos.top);
        bbox_set({x: bbox.x, y: bbox.y, width: bbox.width - moveX, height: bbox.height - moveY});
    }
    e.preventDefault();
}

const render_bbox = ({ bbox, bbox_show, bbox_update  }: AnnotateImageProp, pos: Position) => {
    if (bbox !== undefined && Object.keys(bbox).length > 0 && bbox_show) {
        let bbox_style: CSSProperties = {
            border: '2px solid darkgray',
            position: 'absolute',
            top: (pos.top + bbox.y) + 'px',
            left: (pos.left + bbox.x) + 'px',
            width: bbox.width + 'px',
            height: bbox.height + 'px'
        }
        let update_box = (<></>)
        if (bbox_update) {
            const top_update: CSSProperties = {
                width: '9px',
                height: '9px',
                border: '3px solid black',
                position: 'absolute',
                objectFit: 'fill',
                top: (pos.top + bbox.y - 4) + 'px',
                left: (pos.left + bbox.x - 4) + 'px'
            }
            const bottom_update: CSSProperties = {
                width: '9px',
                height: '9px',
                border: '3px solid black',
                position: 'absolute',
                objectFit: 'fill',
                top: (pos.top + bbox.y + bbox.height - 6) + 'px',
                left: (pos.left + bbox.x + bbox.width - 6) + 'px'
            }
            update_box = (
                <>
                    <img alt='top box' style={ top_update } src='static/33.jpg' onDrag={ onDragTop(bbox, pos, bbox_set) }></img>
                    <img alt='bottom box' style={ bottom_update } src='static/33.jpg' onDrag={ onDragDown(bbox, pos, bbox_set) }></img>
                </>
            )
        }
        return (
            <>
                <div data-testid='bbox' style={ bbox_style }></div>
                { update_box }
            </>
        )
    }
    return (
        <></>
    )
}

const AnnotateImage = (props: AnnotateImageProp) => {
    const { files, cur_file } = props;
    const [pos, setPos] = useState({ top: 0, left: 0 })
    const ref = useRef<HTMLElement>();
    useEffect(() => {
        if (ref.current) {
            const bbox = (ref.current as HTMLImageElement).getBoundingClientRect();
            setPos({ top: bbox.top, left: bbox.left });
        }
    }, [props])
    if (files !== undefined && files.length > 0 && cur_file !== undefined) {
        const file = files[cur_file];
        return (
            <>
                <p style={{ fontWeight: 700 }}><BsFillFileEarmarkFill></BsFillFileEarmarkFill> 파일명 (filename) :&nbsp; 
                    <input style={{ border: '2px solid #ced4da', padding: '1px 2px', borderRadius: '3px' }}
                        type='text' value={file} onClick={onClickSearch(props)} onChange={(e) => { }}></input>
                </p>
                <div ref={ ref as LegacyRef<HTMLDivElement> } >
                    <img alt='annotation target' draggable='false'
                        src={API_IMG_GET + '?' + encodeQueryData({ 'path': '' + props.cur_dir, 'name': '' + file })}
                            onClick={ onClickHandle(props) }
                            onContextMenu={ onRightClickHandle(props) }></img>
                </div>
                { render_marks(props, pos) }
                { render_bbox(props, pos) }
            </>
        )
    } else
        return <></>
}

export default connector(AnnotateImage)