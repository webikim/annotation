import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { Divider, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

import { cloth_type_set } from '../../store/anno/annoDuck';
import { RootState } from '../../store/store';

const mapStateToProps = (state: RootState) => ({
    cloth_type: state.anno.cloth_type
})

const mapDispatchToProps = {
    cloth_type_set
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface ClothTypeProps extends PropsFromRedux {

}

const ClothType = (props: ClothTypeProps) => {
    const { cloth_type, cloth_type_set } = props
    return (
        <>
            <FormControl>
                <Divider sx={{ marginBottom: 1 }}>옷 종류 (Cloth type)</Divider>
                <RadioGroup
                    row
                    aria-labelledby="cloth-type-label"
                    name="cloth_type"
                    value={cloth_type || ""}
                    onChange={(evt) => {
                        cloth_type_set(evt.target.value);
                    }}
                >
                    <FormControlLabel value="upper" control={<Radio />} label="1. 상의 (Upper)" />
                    <FormControlLabel value="lower" control={<Radio />} label="2. 하의 (lower)" />
                    <FormControlLabel value="full" control={<Radio />} label="3. 전체 (full)" />
                </RadioGroup>
            </FormControl>
        </>
   )
}

export default connector(ClothType)