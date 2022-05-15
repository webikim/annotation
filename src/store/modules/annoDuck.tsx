import { Reducer } from "redux";
import { ajaxBase, DELETE, encodeQueryData, GET, POST } from "../../common/ajax";
import { BBoxType, CollectLandmarkType, LabelType } from "../../typings";
import { AppDispatch, GetState } from "../store";

export const mark_set: { [k: string]: string[] } = {
    'upper': ['collar', 'sleeve', 'hem'],
    'lower': ['waistline', 'hem'],
    'full': ['collar', 'sleeve', 'waistline', 'hem']
}

export const color_set: { [k: string]: string[] } = {
    'collar': ['q', 'yellow', 'skyblue'],
    'sleeve': ['w', 'red', 'darkgray'],
    'waistline': ['e', 'greenyellow', 'magenta'],
    'hem': ['r', 'deepskyblue', 'orange']
}

const cloth_map: {[k: string]: string[]} = {
    'upper': ['상의'],
    'lower': ['하의'],
    'full': ['아우터', '원피스']
}

export const color_key = Object.keys(color_set).map(each => color_set[each][0]);

const filter_marks = (anno: AnnoState, cloth_type: string) => {
    if (anno.marks !== undefined) {
        const marks = anno.marks;
        const new_keys = mark_set[cloth_type].map((each) => 
            Object.keys(color_set).indexOf(each)
        )
        let new_marks: CollectLandmarkType = {};
        new_keys.filter(key => key in marks).forEach((key) =>
            new_marks[key] = marks[key]
        )
        return new_marks;
    }
    return {}
}

const get_ratio = (width: number, height: number) => {
    if (width > height)
        return 512 / width;
    else
        return 512 / height;
}

export const get_bbox = (label: LabelType, ai_bbox: LabelType) => {
    if (label['이미지 정보']['이미지 너비'] !== undefined) {
        const ratio = get_ratio(+label['이미지 정보']['이미지 너비'], +label['이미지 정보']['이미지 높이']);
        const bbox = {
            x: +ai_bbox[0]['X좌표'] * ratio,
            y: +ai_bbox[0]['Y좌표'] * ratio,
            width: +ai_bbox[0]['가로'] * ratio,
            height: +ai_bbox[0]['세로'] * ratio
        }
        return bbox;
    }
}

export const decode_ai_label = (label: any, cloth_type: string) => {
    const ai_image_bboxes = label['데이터셋 정보']['데이터셋 상세설명']['렉트좌표'];
    if (cloth_type !== undefined) {
        if (cloth_type === 'full') {
            for (let i in cloth_map[cloth_type]) {
                const ai_bbox = ai_image_bboxes[cloth_map[cloth_type][i]];
                if (Object.keys(ai_bbox[0]).length > 0) {
                    return ai_bbox;
                }
            }
        } else {
            const ai_bbox = ai_image_bboxes[cloth_map[cloth_type][0]];
            if (Object.keys(ai_bbox[0]).length > 0) {
                return ai_bbox;
            }
        }
    }
}

// action type
export const CLOTH_TYPE_SET = 'cloth/type/set' as const;
export const LANDMARK_ORDER_SET = 'cloth/color/set' as const;
export const LANDMARK_ORDER_CLEAR = 'cloth/color/clear' as const;
export const LANDMARK_SET = 'cloth/landmark/set' as const;
export const LANDMARK_SET_ALL = 'cloth/landmark/setall' as const;
export const LANDMARK_CLEAR = 'cloth/landmark/clear' as const;
export const CLOTH_VARIED_SET = 'cloth/varied/set' as const;
export const BBOX_SET = 'bbox/set' as const;
export const BBOX_SHOW_SET = 'bbox/show/set' as const;
export const BBOX_UPDATE_SET = 'bbox/update/set' as const;
export const CLOTH_GET = 'cloth/get' as const;
export const JOB_STATUS = 'job/status' as const;
export const IMAGE_AUTO_NEXT = 'image/autonext' as const;

// action
export const cloth_type_set = (cloth_type: string) => (dispatch: AppDispatch, getState: GetState) => {
    const { anno, image } = getState();
    dispatch(_cloth_type_set(cloth_type));
    if (image !== undefined && image.label !== undefined && image.label['이미지 정보']) {
        const ai_bbox = decode_ai_label(image.label, cloth_type);
        if (ai_bbox !== undefined) {
            const bbox = get_bbox(image.label, ai_bbox);
            if (ai_bbox.length > 0 && bbox !== undefined) 
                dispatch(bbox_set(bbox));
            else
                dispatch(bbox_set({}));
        } else
            dispatch(bbox_set({}));
    } else
        dispatch(bbox_set({}));
    if (anno.marks === undefined)
        dispatch(landmark_clear());
    else
        dispatch(_landmark_set_all(filter_marks({ ...anno }, cloth_type)));
}

const _cloth_type_set = (cloth_type: string) => ({
    type: CLOTH_TYPE_SET,
    payload: cloth_type
})

export const _landmark_set_all = (marks: {}) => ({
    type: LANDMARK_SET_ALL,
    payload: marks
})

export const landmark_order_set = (landmark_order: number) => (dispatch: AppDispatch, getState: GetState) => {
    const cloth_type = getState().anno.cloth_type;
    if (cloth_type !== undefined) {
        const color_index = mark_set[cloth_type].map(each => color_set[each][0]).indexOf(color_key[landmark_order]);
        if (color_index >= 0)
            dispatch(_landmark_order_set(landmark_order));
    }
}

const _landmark_order_set = (landmark_order: number) => ({
    type: LANDMARK_ORDER_SET,
    payload: landmark_order
})

export const landmark_order_clear = (order: number) => (dispatch: AppDispatch, getState: GetState) => {
    const { anno } = getState();
    let marks = { ...anno.marks }
    delete marks[order];
    dispatch(_landmark_order_clear(marks))
}

const _landmark_order_clear = (marks: object) => ({
    type: LANDMARK_ORDER_CLEAR,
    payload: marks
})

export const landmark_set = (order: number, vis_type: number, x: number, y: number) => (dispatch: AppDispatch, getState: GetState) => {
    if (order !== undefined) {
        const { anno } = getState();
        if (anno.marks !== undefined && Object.keys(anno).indexOf('marks') >= 0) {
            let landmark_in_order = {...anno.marks[order]};
            if (Object.keys(landmark_in_order) !== undefined && Object.keys(landmark_in_order).length > 0)  {
                let landmark = landmark_in_order[vis_type === 1 ? 0: 1]
                if ((landmark && landmark.length > 1) || (landmark && landmark_in_order[vis_type]))
                    landmark_in_order[vis_type === 1 ? 0: 1] = landmark.slice(1);
            }
            if (Object.keys(landmark_in_order).indexOf(String(vis_type)) > -1) {
                let landmark = landmark_in_order[vis_type]
                if (landmark_in_order[vis_type].length > 1)
                    landmark_in_order[vis_type] = landmark.slice(1);
                landmark_in_order[vis_type] = landmark_in_order[vis_type].concat({
                    x: x,
                    y: y
                })
            } else {
                landmark_in_order = {
                    ...landmark_in_order,
                    [vis_type]: [{
                        x: x,
                        y: y
                    }]
                }
            }
            dispatch(_landmark_set({
                order: order,
                vis_type: landmark_in_order
            }))
        } else {
            dispatch(_landmark_set({
                order: order,
                vis_type: {
                    [vis_type]: [{
                        x: x,
                        y: y
                    }]
                }
            }));
        }
    }
}

const _landmark_set = (landmark: { order: number, vis_type: object }) => ({
    type: LANDMARK_SET,
    payload: landmark
})

export const landmark_clear = () => ({
    type: LANDMARK_CLEAR
})

export const cloth_varied_set = (cloth_varied: number) => ({
    type: CLOTH_VARIED_SET,
    payload: cloth_varied
})

export const bbox_set = (bbox: BBoxType | {}) => ({
    type: BBOX_SET,
    payload: bbox
})

export const bbox_show_toggle = () => (dispatch: AppDispatch, getState: GetState) => {
    dispatch(bbox_show_set(getState().anno.bbox_show === 1 ? 0 : 1));
}

export const bbox_show_set = (value: number) => ({
    type: BBOX_SHOW_SET,
    payload: value
})

export const bbox_update_set = (value: number) => ({
    type: BBOX_UPDATE_SET,
    payload: value
})

export const cloth_get = (name: string) => (dispatch: AppDispatch, getState: GetState) => {
    const { dir } = getState();
    if (dir.cur_dir !== undefined) {
        ajaxBase('/anno/get?' + encodeQueryData({
            path: dir.cur_dir,
            name: name
        }), GET).then(
            (response) => {
                dispatch(_cloth_get(response.data))
            }
        );
    }
}

const _cloth_get = (data: object) => ({
    type: CLOTH_GET,
    payload: data
})

export const cloth_save = () => (dispatch: AppDispatch, getState: GetState) => {
    const { dir, anno } = getState();
    if (
        dir.files !== undefined &&
        dir.cur_file !== undefined &&
        anno.marks !== undefined &&
        Object.keys(anno.marks).length > -1 &&
        anno.cloth_type !== undefined &&
        anno.cloth_varied !== undefined
    ) {
        ajaxBase("/anno/save", POST, {
            path: dir.cur_dir,
            name: dir.files[dir.cur_file],
            data: {
                ...anno,
                marks: filter_marks({ ...anno }, anno.cloth_type),
            },
        }).then(
            (response) => dispatch(job_status(1))
        );
    } else dispatch(job_status(-1));
}

export const cloth_delete = () => (dispatch: AppDispatch, getState: GetState) => {
    const { dir } = getState();
    if (dir.files !== undefined && dir.cur_file !== undefined) {
        ajaxBase('/anno/delete', DELETE, {
            path: dir.cur_dir,
            name: dir.files[dir.cur_file],
        }).then(
            () => {
                dispatch(_cloth_get({}))
                dispatch(job_status(0))
            }
        )
    }
}

export const job_status = (status: number) => ({
    type: JOB_STATUS,
    payload: status
})

export const clear_status = () => ({
    type: JOB_STATUS,
    payload: 0
})

export const image_auto_next = (value: number) => ({
    type: IMAGE_AUTO_NEXT,
    payload: value
})

type AnnoAction = ReturnType<typeof _cloth_type_set>
    | ReturnType<typeof _landmark_order_set>
    | ReturnType<typeof _landmark_order_clear>
    | ReturnType<typeof _landmark_set>
    | ReturnType<typeof _landmark_set_all>
    | ReturnType<typeof landmark_clear>
    | ReturnType<typeof cloth_varied_set>
    | ReturnType<typeof bbox_set>
    | ReturnType<typeof bbox_show_set>
    | ReturnType<typeof bbox_update_set>
    | ReturnType<typeof _cloth_get>
    | ReturnType<typeof job_status>
    | ReturnType<typeof image_auto_next>

type AnnoState = {
    cloth_type?: string,
    landmark_order?: number,
    marks?: CollectLandmarkType,
    cloth_varied?: number,
    bbox?: BBoxType,
    bbox_show?: number,
    bbox_update?: number,
    status?: number,
    auto_next?: number
}

const INITIAL_STATE: AnnoState = {}

const reducer: Reducer<AnnoState, AnnoAction> = (state: AnnoState = INITIAL_STATE, action: AnnoAction) => {
    switch (action.type) {
        case CLOTH_TYPE_SET:
            return {
                ...state,
                cloth_type: action.payload
            } as AnnoState
        case LANDMARK_ORDER_SET:
            return {
                ...state,
                landmark_order: action.payload
            } as AnnoState
        case LANDMARK_ORDER_CLEAR:
            return {
                ...state,
                marks: action.payload
            } as AnnoState
        case LANDMARK_CLEAR:
            return {
                ...state,
                marks: {}
            } as AnnoState
        case CLOTH_VARIED_SET:
            return {
                ...state,
                cloth_varied: action.payload
            } as AnnoState
        case LANDMARK_SET:
            return {
                ...state,
                marks: {
                    ...state.marks,
                    [action.payload.order]: action.payload.vis_type
                }
            } as AnnoState
        case LANDMARK_SET_ALL:
            return {
                ...state,
                marks: action.payload
            } as AnnoState
        case CLOTH_GET:
            return action.payload as AnnoState
        case BBOX_SET:
            return {
                ...state,
                bbox: action.payload
            } as AnnoState
        case BBOX_SHOW_SET:
            return {
                ...state,
                bbox_show: action.payload
            } as AnnoState
        case BBOX_UPDATE_SET:
            return {
                ...state,
                bbox_update: action.payload
            } as AnnoState
        case JOB_STATUS:
            return {
                ...state,
                status: action.payload
            } as AnnoState
        case IMAGE_AUTO_NEXT:
            return {
                ...state,
                auto_next: action.payload
            } as AnnoState
        default:
            return state;
    }
}

export default reducer;