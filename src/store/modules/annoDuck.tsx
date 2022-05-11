import { Reducer } from "redux";
import { RootState } from "..";
import { AppDispatch } from "../store";

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

const get_color_key = (colorSet: typeof color_set) => Object.keys(color_set).map(each => color_set[each][0]);

export const color_key = get_color_key(color_set);

// action type
export const CLOTH_TYPE_SET = 'cloth/type/set' as const;
export const LANDMARK_ORDER_SET = 'cloth/color/set' as const;
export const LANDMARK_ORDER_CLEAR = 'cloth/color/clear' as const;
export const LANDMARK_CLEAR = 'cloth/landmark/clear' as const;

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
    return (dispatch: AppDispatch, getState: ()=>RootState) => {
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
    return (dispatch: AppDispatch, getState: ()=>RootState) => {
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

export const landmark_clear = () => ({
    type: LANDMARK_CLEAR
})

export type AnnoAction = ReturnType<typeof _cloth_type_set>
    | ReturnType<typeof _landmark_order_set>
    | ReturnType<typeof _landmark_order_clear>
    | ReturnType<typeof landmark_clear>

export type AnnoState = {
    cloth_type?: string,
    landmark_order?: number,
    marks?: { [k: number]: object }
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
        default:
            return state;
    }
}

export default reducer;