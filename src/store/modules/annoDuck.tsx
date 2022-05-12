import { Reducer } from "redux";

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

export const color_key = Object.keys(color_set).map(each => color_set[each][0]);

type Landmark = {
    [k: number]: {
        x: number,
        y: number
    }[]
};

// action type
export const CLOTH_TYPE_SET = 'cloth/type/set' as const;
export const LANDMARK_ORDER_SET = 'cloth/color/set' as const;
export const LANDMARK_ORDER_CLEAR = 'cloth/color/clear' as const;
export const LANDMARK_SET = 'cloth/landmark/set' as const;
export const LANDMARK_CLEAR = 'cloth/landmark/clear' as const;
export const CLOTH_VARIED_SET = 'cloth/varied/set' as const;
export const BBOX_SET = 'bbox/set' as const;
export const BBOX_SHOW_SET = 'bbox/show/set' as const;
export const BBOX_UPDATE_SET = 'bbox/update/set' as const;

// action
export const cloth_type_set = (cloth_type: string) => {
    return (dispatch: AppDispatch) => {
        dispatch(_cloth_type_set(cloth_type));
    }
}

export const _cloth_type_set = (cloth_type: string) => ({
    type: CLOTH_TYPE_SET,
    payload: cloth_type
})

export const landmark_order_set = (landmark_order: number) => {
    return (dispatch: AppDispatch, getState: GetState) => {
        const cloth_type = getState().anno.cloth_type;
        if (cloth_type) {
            const color_index = mark_set[cloth_type].map(each => color_set[each][0]).indexOf(color_key[landmark_order]);
            if (color_index >= 0)
                dispatch(_landmark_order_set(landmark_order));
        }
    }
}

export const _landmark_order_set = (landmark_order: number) => ({
    type: LANDMARK_ORDER_SET,
    payload: landmark_order
})

export const landmark_order_clear = (order: number) => {
    return (dispatch: AppDispatch, getState: GetState) => {
        const { anno } = getState();
        let marks = { ...anno.marks }
        delete marks[order];
        dispatch(_landmark_order_clear(marks))
    }
}

export const _landmark_order_clear = (marks: object) => ({
    type: LANDMARK_ORDER_CLEAR,
    payload: marks
})

export const landmark_set = (order: NumberUndefined, vis_type: number, x: number, y: number) => {
    return (dispatch: AppDispatch, getState: GetState) => {
        if (order !== undefined) {
            const { anno } = getState();
            if (Object.keys(anno).indexOf('marks') >= 0) {
                let landmark_in_order = {...anno!.marks![order]};
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
}

export const _landmark_set = (landmark: { order: number, vis_type: object }) => ({
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

export const bbox_set = (bbox: object) => ({
    type: BBOX_SET,
    payload: bbox
})

export const bbox_show_set = (value: number) => ({
    type: BBOX_SHOW_SET,
    payload: value
})

export const bbox_update_set = (value: number) => ({
    type: BBOX_UPDATE_SET,
    payload: value
})

export type AnnoAction = ReturnType<typeof _cloth_type_set>
    | ReturnType<typeof _landmark_order_set>
    | ReturnType<typeof _landmark_order_clear>
    | ReturnType<typeof _landmark_set>
    | ReturnType<typeof landmark_clear>
    | ReturnType<typeof cloth_varied_set>
    | ReturnType<typeof bbox_set>
    | ReturnType<typeof bbox_show_set>
    | ReturnType<typeof bbox_update_set>

export type AnnoState = {
    cloth_type?: string,
    landmark_order?: number,
    marks?: { [k: number]: Landmark },
    cloth_varied?: number,
    bbox?: object,
    bbox_show?: number,
    bbox_update?: number
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
        default:
            return state;
    }
}

export default reducer;