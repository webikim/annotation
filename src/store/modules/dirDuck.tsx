import { ajaxBase, GET } from "../../common/ajax";
import { AppDispatch } from "../store";

// action type
export const DIR_LIST = "dir/list" as const;
export const DIR_SET = "dir/set" as const;
export const FILE_LIST = "file/list" as const;
export const FILE_SET = 'file/set';

// action
export const dir_list = () => async (dispatch: AppDispatch, getState: any) => {
    return ajaxBase("/dir/list", GET).then(
        (response) => dispatch(_dir_list(response.data))
    );
};

const _dir_list = (data: string[]) => ({
    type: DIR_LIST,
    payload: data
})

export const dir_set = (dir_name: string, pos: number) => {
    return (dispatch: AppDispatch, getState: any) => {
        dispatch(file_list(dir_name, pos));
        dispatch(_dir_set(dir_name));
    };
};

export const _dir_set = (dir_name: string) => ({
    type: DIR_SET,
    payload: dir_name,
});

export const file_list = (dir_name: string, pos: number) => async (dispatch: AppDispatch, getState: any) => {
    return ajaxBase('/file/list', GET, {'path': encodeURI(dir_name)}).then(
        (response) => dispatch(_file_list(response.data))
    );
}

export const _file_list = (data: any[]) => ({
    type: FILE_LIST,
    payload: data
})

export const file_setpos = (pos: number) => {
    return ((dispatch: AppDispatch, getState: any) => {
        const { dir } = getState()
        if ('files' in dir) {
            dispatch(_file_set(dir['files'][pos], pos));
        }
    })
}

export const _file_set = (filename: string, pos: number) => ({
    type: FILE_SET,
    payload: pos
})

export type DirAction = ReturnType<typeof _dir_list>
        | ReturnType<typeof _dir_set>
        | ReturnType<typeof _file_list>
        | ReturnType<typeof _file_set>

// reducer
const INITIAL_STATE = {};

const reducer = (state: {} = INITIAL_STATE, action: DirAction) => {
    switch (action.type) {
        case DIR_LIST:
            return {
                ...state,
                dirs: action.payload,
            };
        case DIR_SET:
            return {
                ...state,
                cur_dir: action.payload,
            };
        case FILE_LIST:
            return {
                ...state,
                files: action.payload
            }
        case FILE_SET:
            return {
                ...state,
                cur_file: action.payload
            }
        default:
            return state;
    }
};

export default reducer;
