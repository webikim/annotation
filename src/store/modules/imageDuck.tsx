import { Reducer } from "redux";
import { ajaxBase, encodeQueryData, GET } from "../../common/ajax";
import { AppDispatch, GetState } from "../store";

// action type
export const IMAGE_POS_SET = 'image/pos/set' as const;
export const IMAGE_LABEL_SET = 'image/label' as const;
export const IMAGE_LABEL_CLEAR = 'image/label/clear' as const;

type Position = {
    top: number,
    left: number
}

// action
export const image_setpos = (top: number, left: number) => {
    return {
        type: IMAGE_POS_SET,
        payload: {
            top: top,
            left: left
        }
    }
}

export const set_image_label = (filename: string) => {
    return (dispatch: AppDispatch, getState: GetState) => {
        const { dir } = getState();
        if (dir.cur_dir !== undefined) {
            ajaxBase('/label/get?' + encodeQueryData({
                path: dir.cur_dir,
                name: filename
            }), GET).then(
                (response) => {
                    let label = response.data;
                    if (label['데이터셋 정보'])
                        delete label['데이터셋 정보']['데이터셋 상세설명']['폴리곤좌표'];
                    dispatch(_set_image_label(response.data))
                }
            )
        }
    }
}

export const _set_image_label = (data: object) => ({
    type: IMAGE_LABEL_SET,
    payload: data
})

export const image_label_clear = () => ({
    type: IMAGE_LABEL_CLEAR
})

type ImageSate = {
    image?: Position,
    label?: object,     // external data. type unknown
}

type ImageAction = ReturnType<typeof image_setpos>
    | ReturnType<typeof _set_image_label>
    | ReturnType<typeof image_label_clear>

// reducer
const INITIAL_STATE = {}

const reducer: Reducer<ImageSate, ImageAction> = (state: ImageSate = INITIAL_STATE, action: ImageAction) => {
    switch (action.type) {
        case IMAGE_POS_SET:
            return {
                ...state,
                image: action.payload
            } as ImageSate
        case IMAGE_LABEL_SET:
            return {
                ...state,
                label: action.payload
            } as ImageSate
        case IMAGE_LABEL_CLEAR:
            return {
                ...state,
                label: {}
            } as ImageSate
        default:
            return state;
    }
}

export default reducer;