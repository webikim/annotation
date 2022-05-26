import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Cookies } from 'react-cookie';

import { dir_list, dir_set, file_set } from '../../store/anno/dirDuck';
import { RootState } from '../../store/store';
import { MenuItem, TextField } from '@mui/material';

const mapStateToProps = (state : RootState) => ({
    dirs: state.dir.dirs,
    cur_dir: state.dir.cur_dir
})

const mapDispatchToProps = {
    dir_list,
    dir_set,
    file_set 
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface SelectDirProps extends PropsFromRedux {
    cookies: Cookies
}

const SelectDir = (props: SelectDirProps) => {
    const { dirs, dir_set, file_set, cookies } = props;

    if (dirs === undefined) {
        props.dir_list();
        return ( <></> );
    }
    return (
        <TextField
            size='small'
            label="작업위치 (Work location)"
            fullWidth
            sx={{ mt: 3 }}
            select
            value={props.cur_dir || ''}
            onChange={(evt) => {
                dir_set(evt.target.value);
                file_set(parseInt(cookies.get(evt.target.value) || 0));
            }}
        >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {dirs.map((name) => (
            <MenuItem key={name} value={name}>
                {name}
            </MenuItem>
            ))}
        </TextField>
    );
}
   
export default connector(SelectDir);