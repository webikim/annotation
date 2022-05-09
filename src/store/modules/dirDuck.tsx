import { ajaxBase, GET } from "../../common/ajax";
import { RootState, AppDispatch } from "../store";

// action type
export const DIR_LIST = "dir/list" as const;
export const DIR_SET = "dir/set" as const;
export const FILE_LIST = "file/list" as const;

// action
export const dir_list = () => {
  return async (dispatch: AppDispatch, getState: RootState) => {
      const resp = await ajaxBase("/dir/list", GET);
      dispatch(_dir_list(resp.data));
  };
};

const _dir_list = (data: string[]) => ({
    type: DIR_LIST,
    payload: data
})

export const dir_set = (dir_name: string, pos: number) => {
  return (dispatch: AppDispatch, getState: RootState) => {
    dispatch(_dir_set(dir_name));
  };
};

export const _dir_set = (dir_name: string) => ({
    type: DIR_SET,
    payload: dir_name,
});

export type DirAction = ReturnType<typeof _dir_set>
    | ReturnType<typeof _dir_list>

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
    default:
      return state;
  }
};

export default reducer;
