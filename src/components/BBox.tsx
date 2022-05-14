import React, { ChangeEvent, MouseEventHandler } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { bbox_set, bbox_show_set, bbox_update_set, decode_ai_label, get_bbox } from '../store/modules/annoDuck'
import { RootState } from '../store/store'
import { LabelType } from '../typings'

const mapStateToProps = (state: RootState) => ({
    bbox_show: state.anno.bbox_show,
    bbox_update: state.anno.bbox_update,
    bbox: state.anno.bbox,
    cloth_type: state.anno.cloth_type,
    label: state.image.label        // external. type unknown
})

const mapDispatchToProps = {
    bbox_set,
    bbox_show_set,
    bbox_update_set
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface BBoxProps extends PropsFromRedux {

}

const onClickUseFull = ({ bbox_set, label }: BBoxProps): MouseEventHandler<HTMLDivElement> => (e) => {
    if (label !== undefined) {
        const ai_bbox = decode_ai_label(label, 'full');
        if (ai_bbox !== undefined) {
            const bbox = get_bbox(label as LabelType, ai_bbox);
            if (bbox !== undefined)
                bbox_set(bbox);
        }
    }
}

const onChangeBBox = ({ bbox_show_set }: BBoxProps, value: number) => (e: ChangeEvent) => {
    bbox_show_set(value === 1 ? 0 : 1);
}

const onChangeUpdate = ({ bbox_update_set, bbox_show_set }: BBoxProps, value: number) => (e: ChangeEvent) => {
    bbox_update_set(value === 1 ? 0 : 1)
    if (value !== 1)
        bbox_show_set(1);
}

const BBox = (props: BBoxProps) => {
    const bbox_show = props.bbox_show || 0;
    const bbox_update = props.bbox_update || 0;
    if (props.bbox !== undefined && Object.keys(props.bbox).length) {
        return (
            <>
                <label>
                    <input type='checkbox' checked={ props.bbox_show === 1 } onChange={ onChangeBBox(props, bbox_show) }/> b. 박스 보기 (BBox show)
                </label>
                <label>
                    <input type='checkbox' checked={ props.bbox_update === 1 } onChange={ onChangeUpdate(props, bbox_update) }/> 박스 수정하기 (BBox update)
                </label>
            </>
        )
    } else {
        if (props.label !== undefined && (props.label as LabelType)['이미지 정보'] && props.cloth_type === 'upper') {
            const ai_bbox = decode_ai_label(props.label, 'full');
            if (ai_bbox !== undefined && ai_bbox.length > 0)
                return <div style={{ fontWeight: 700, marginTop: '10px', backgroundColor: 'magenta' }} onClick={ onClickUseFull(props) }>- 전체 박스 사용 (Use bounding box from full) -</div>
        }
        return <div style={{ fontWeight: 700, marginTop: '10px', backgroundColor: 'magenta' }}>- 박스 없음 (No bounding box in data) -</div>
    }
}

export default connector(BBox);