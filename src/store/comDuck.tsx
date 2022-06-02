import { Reducer } from "redux";

// action type
export const STATUS_SET = 'status/set' as const;
export const STATUS_RESET = 'status/reset' as const;
export const STATUS_CLEAR = 'statuc/clear' as const;

// action
export const status_set = (status_name: string, status: string | number) => ({
    type: STATUS_SET,
    payload: {
        [status_name]: status
    }
})

export const status_reset = (status_name: string) => ({
    type: STATUS_RESET,
    payload: status_name
})

export const status_clear = () => ({
    type: STATUS_CLEAR,
})

// reducer
type ComAction = ReturnType<typeof status_set>
    | ReturnType<typeof status_reset>
    | ReturnType<typeof status_clear>
type ComState = {
    status: {
        [key: string]: string | number
    }
}

const INITIAL_STATE = {
    status: {}
}

const reducer: Reducer<ComState, ComAction> = (state: ComState = INITIAL_STATE, action: ComAction) => {
    switch (action.type) {
        case STATUS_SET:
            return {
                ...state,
                status: {
                    ...state.status,
                    ...action.payload
                }
            }
        case STATUS_RESET:
            if (state.status[action.payload]) {
                var status = { ...state.status }
                delete status[action.payload]
                return {
                    ...state,
                    status: status
                }
            }
            return state;
        case STATUS_CLEAR:
            return {
                ...state,
                status: {}
            }
        default:
            return state;
    }
}

export default reducer