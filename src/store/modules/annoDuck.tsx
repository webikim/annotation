import { Reducer } from "redux";
import { AppDispatch } from "../store";

// action type
export const CLOTH_TYPE_SET = 'cloth/type/set';

// action
export const cloth_type_set = (cloth_type: string) => {
    return (dispatch: AppDispatch, getState: any) => {
        dispatch(_cloth_type_set(cloth_type));
    }
}

export const _cloth_type_set = (cloth_type: string) => {
    return {
        type: CLOTH_TYPE_SET,
        payload: cloth_type
    }
}

export type AnnoAction = ReturnType<typeof _cloth_type_set>

export type AnnoState = {
    cloth_type?: string
}

const INITIAL_STATE: AnnoState = {}

const reducer: Reducer<AnnoState, AnnoAction> = (state: AnnoState = INITIAL_STATE, action: AnnoAction) => {
    switch (action.type) {
        case CLOTH_TYPE_SET:
            return {
                ...state,
                cloth_type: action.payload
            }
        default:
            return state;
    }
}

export default reducer;