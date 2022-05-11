import { Reducer } from "redux";

// action type
export const IMAGE_SET = 'image/set' as const;

type Position = {
    top: number,
    left: number
}

// action
export const image_setpos = (top: number, left: number) => {
    return {
        type: IMAGE_SET,
        payload: {
            top: top,
            left: left
        }
    }
}

export type ImageSate = {
    image?: Position
}

export type ImageAction = ReturnType<typeof image_setpos>

// reducer
const INITIAL_STATE = {}

const reducer: Reducer<ImageSate, ImageAction> = (state: ImageSate = INITIAL_STATE, action: ImageAction) => {
    switch (action.type) {
        case IMAGE_SET:
            return {
                ...state,
                image: action.payload
            }
        default:
            return state;
    }
}

export default reducer;