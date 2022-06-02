import React, { Children, CSSProperties, LegacyRef, MouseEvent, MouseEventHandler, useEffect, useRef, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Stack, styled, TextField } from '@mui/material';

import { encodeQueryData } from '../../common/ajax';
import { API_IMG_GET } from '../../common/urls';
import { bbox_set, color_set, landmark_set } from '../../store/anno/annoDuck';
import { file_set } from '../../store/anno/dirDuck';
import { RootState } from '../../store/store';
import { Position } from '../../typings';
import { Cookies } from 'react-cookie';
import AlertDialog from '../util/AlertDialog';

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
    cookies: Cookies,
    redraw?: number
}

const MarkImg = styled('img')(({ theme }) => ({
    '&': {
        width: '9px',
        height: '9px',
        border: '3px solid black',
        position: 'absolute',
        objectFit: 'fill',
    }
}));

const onClickHandle = ({ landmark_set, landmark_order }: AnnotateImageProp) => (e: MouseEvent) => {
    const rect = (e.target as HTMLImageElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // console.log('..... rect : ', rect, ', x: ', x, ', y: ', y)
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

const onClickValue = ({ files, file_set, cookies, cur_dir }: AnnotateImageProp): MouseEventHandler<HTMLInputElement> => (e) => {
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

const AnnotateImage = (props: AnnotateImageProp) => {
    const { bbox, bbox_show, bbox_update, bbox_set, cur_file, files } = props;
    // const [openDialog, setOpenDialog] = useState(false);
    // const [dialog, setDialog] = useState({ type: 0, message: '', label: '' })
    const [offset, setOffset] = useState({ top: 0, left: 0})
    const [moved, setMoved] = useState({ top: 0, left: 0, bottom: 0, right: 0 })
    const ref = useRef<HTMLElement>();

    useEffect(() => {
        if (ref.current) {
            const box = (ref.current as HTMLImageElement).getBoundingClientRect();
            setOffset({ top: box.top, left: box.left });
        }
    }, [props])

    const onDragTop: React.DragEventHandler<HTMLImageElement> = (e) => {
        if (bbox !== undefined && e.pageX !== 0 && e.pageY !== 0) {
            const moveX = e.pageX - offset.left - bbox.x;
            const moveY = e.pageY - offset.top - bbox.y;
            setMoved({ top: moveY, left: moveX, bottom: 0, right: 0 });
        }
        e.preventDefault();
    }

    const onDragDown: React.DragEventHandler<HTMLImageElement> = (e) => {
        if (bbox !== undefined && e.pageX !== 0 && e.pageY !== 0) {
            const moveX = e.pageX - offset.left - bbox.x - bbox.width;
            const moveY = e.pageY - offset.top - bbox.y - bbox.height;
            setMoved({ top: 0, left: 0, bottom: moveY, right: moveX });
        }
        e.preventDefault();
    }

    const onDragEnter: React.DragEventHandler<HTMLImageElement> = (e) => {
        (e.target as HTMLIFrameElement).style.cursor = 'move'
    }

    const onDragLeave : React.DragEventHandler<HTMLImageElement> = (e) => {
        if (bbox !== undefined) {
            bbox_set({
                x: bbox.x + moved.left,
                y: bbox.y + moved.top,
                width: bbox.width + (moved.right - moved.left),
                height: bbox.height + (moved.bottom - moved.top)
            });
            setMoved({ top: 0, left: 0, bottom: 0, right: 0 })
        }
        (e.target as HTMLIFrameElement).style.cursor = 'default'
        e.preventDefault();
    }

    const render_bbox = () => {
        if (bbox !== undefined && Object.keys(bbox).length > 0 && bbox_show) {
            let bbox_style: CSSProperties = {
                border: '2px solid darkgray',
                position: 'absolute',
                top: (offset.top + moved.top + bbox.y) + 'px',
                left: (offset.left + moved.left + bbox.x) + 'px',
                width: bbox.width + (moved.right - moved.left) + 'px',
                height: bbox.height + (moved.bottom - moved.top) + 'px'
            }
            let update_box = (<></>)
            if (bbox_update) {
                const top_update: CSSProperties = {
                    top: (offset.top + moved.top + bbox.y - 4) + 'px',
                    left: (offset.left + moved.left + bbox.x - 4) + 'px'
                }
                const bottom_update: CSSProperties = {
                    top: (offset.top + moved.bottom + bbox.y + bbox.height - 6) + 'px',
                    left: (offset.left + moved.right + bbox.x + bbox.width - 6) + 'px'
                }
                console.log('... render ...')
                update_box = (
                    <>
                        <MarkImg
                            alt='top box'
                            style={top_update}
                            src='static/33.jpg'
                            onDrag={onDragTop}
                            onDragEnter={ onDragEnter }
                            onDragLeave={onDragLeave}></MarkImg>
                        <MarkImg
                            alt='bottom box'
                            style={bottom_update}
                            src='static/33.jpg'
                            onDrag={onDragDown}
                            onDragEnter={ onDragEnter }
                            onDragLeave={onDragLeave}></MarkImg>
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

    // const handleDialogClose = () => {
    //     setOpenDialog(false)
    // }
    // 
    // const handleClickFilename = () => {
    //     setDialog({
    //         type: 1,
    //         message: '찾으시는 파일이름을 입력하세요.',
    //         label: 'File name'
    //     })
    //     setOpenDialog(true)
    // }
    // 
    // const handleClickFileno = () => {
    //     setDialog({
    //         type: 2,
    //         message: '이동할 번호를 입력하세요:',
    //         label: 'File no'
    //     })
    //     setOpenDialog(true)
    // }

    if (files !== undefined && files.length > 0 && cur_file !== undefined) {
        const file = files[cur_file];
        return (
            <>
                <Stack direction="row">
                    <TextField
                        margin="normal"
                        size="small"
                        name="filename"
                        sx={{ width: 420 }}
                        label="파일명 (filename)"
                        id="filename"
                        value={file}
                        // onClick={handleClickFilename}
                    />
                    <TextField
                        margin="normal"
                        size="small"
                        name="filename"
                        sx={{ width: 92 }}
                        label="번호 (No.)"
                        id="fileno"
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                        value={(props.cur_file || 0) + 1}
                        // onClick={handleClickFileno}
                    />
                </Stack>
                <div
                    ref={ref as LegacyRef<HTMLDivElement>}
                    style={{
                        width: 512,
                        height: 512,
                        backgroundColor: "white",
                        border: "1px solid lightgrey",
                    }}
                >
                    <img
                        alt="annotation target"
                        draggable="false"
                        src={
                            API_IMG_GET +
                            "?" +
                            encodeQueryData({ path: "" + props.cur_dir, name: "" + file })
                        }
                        onClick={onClickHandle(props)}
                        onContextMenu={onRightClickHandle(props)}
                    ></img>
                </div>
                {render_marks(props, offset)}
                {render_bbox()}
                {/* <AlertDialog
                    open={openDialog}
                    onClose={handleDialogClose}
                    message={dialog.message}
                >
                    <TextField
                        autoFocus
                        margin='dense'
                        id='filename'
                        label={dialog.label}
                        fullWidth
                        variant='standard'
                    />
                </AlertDialog> */}
            </>
        );
    } else
        return <></>
}

export default connector(AnnotateImage)