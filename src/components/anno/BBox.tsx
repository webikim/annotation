import { Checkbox, Divider, FormControlLabel, styled, Typography } from '@mui/material'
import React, { } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { bbox_set, bbox_show_set, bbox_update_set, decode_ai_label, get_bbox } from '../../store/anno/annoDuck'
import { RootState } from '../../store/store'
import { LabelType } from '../../typings'

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

const WarnTypography = styled(Typography)(({ theme }) => ({
    '&': {
        textAlign: 'center',
        fontWeight: 700,
        marginTop: '10px',
        backgroundColor: theme.palette.error.light
    }
}));

const BBox = (props: BBoxProps) => {
    const { bbox, bbox_set, bbox_show, bbox_show_set, bbox_update, bbox_update_set, cloth_type, label } = props
    const handleClickUseFull = () => {
        if (label !== undefined) {
            const ai_bbox = decode_ai_label(label, 'full');
            if (ai_bbox !== undefined) {
                const bbox = get_bbox(label as LabelType, ai_bbox);
                if (bbox !== undefined)
                    bbox_set(bbox);
            }
        }
    }
    if (bbox !== undefined && Object.keys(bbox).length) {
        return (
            <>
                <Divider>바운딩 박스</Divider>
                <FormControlLabel
                    label="b. 바운딩 박스 보기 (View BBox)"
                    sx={{ height: 0 }}
                    control={
                        <Checkbox
                            checked={bbox_show === 1}
                            onChange={(evt) => {
                                bbox_show_set(bbox_show === 1 ? 0 : 1)
                            }}
                        />
                    }
                />
                <FormControlLabel
                    label=" 바운딩 박스 수정 (Edit BBox)"
                    sx={{ height: 1 }}
                    control={
                        <Checkbox
                            checked={bbox_update === 1}
                            onChange={(evt) => {
                                bbox_update_set(bbox_update === 1 ? 0 : 1)
                                if (bbox_update !== 1)
                                    bbox_show_set(1)
                            }}
                        />
                    }
                />
            </>
        )
    } else {
        if (label !== undefined && (label as LabelType)['이미지 정보'] && cloth_type === 'upper') {
            const ai_bbox = decode_ai_label(label, 'full');
            if (ai_bbox !== undefined && ai_bbox.length > 0)
                return (
                    <>
                        <Divider>바운딩 박스</Divider>
                        <WarnTypography onClick = { handleClickUseFull }>
                            전체 박스 사용(Use bounding box from full)
                        </WarnTypography>
                    </>
                )
        }
        return (
            <>
                <Divider>바운딩 박스</Divider>
                <WarnTypography>
                    박스 없음 (No bounding box in data)
                </WarnTypography>
            </>
        )
    }
}

export default connector(BBox);