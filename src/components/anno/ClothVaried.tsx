import { Divider, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { connect, ConnectedProps } from 'react-redux';

import { cloth_varied_set } from '../../store/anno/annoDuck';
import { RootState } from '../../store/store';

const mapStateToProps = (state: RootState) => ({
    cloth_varied: state.anno.cloth_varied
})

const mapDispatchToProps = {
   cloth_varied_set 
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface ClothVariedProps extends PropsFromRedux {

}

const ClothVaried = (props: ClothVariedProps) => {
    const { cloth_varied, cloth_varied_set } = props
    return (
        <>
            <FormControl>
                <Divider sx={{ marginBottom: 1 }}>자세 변형 정도 (Variation)</Divider>
                <RadioGroup
                    row
                    aria-labelledby="cloth-type-label"
                    name="cloth_type"
                    value={(cloth_varied !== undefined) ? cloth_varied : -1}
                    onChange={(evt) => {
                        cloth_varied_set(parseInt(evt.target.value));
                    }}
                >
                    {["a. 없음", "s. 약간", "d. 많이", "f. 확대 약간", "g. 확대 많이"].map((each, index) => (
                        <FormControlLabel key={index} value={ '' + (index + 1) } control={<Radio />} label={ each } />

                    ))}
                </RadioGroup>
            </FormControl>
        </>
    )
}

export default connector(ClothVaried)