import React, { MouseEventHandler } from 'react';
import { Button, Divider, FormControlLabel, Grid, IconButton, Radio, RadioGroup, Stack } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { connect, ConnectedProps } from 'react-redux';

import { mark_set, color_set, color_key, landmark_order_set, landmark_order_clear, landmark_clear } from '../store/modules/annoDuck';
import { RootState } from '../store/store';

const mapStateToProps = (state: RootState) => ({
    cloth_type: state.anno.cloth_type,
    landmark_order: state.anno.landmark_order
})

const mapDispatchToProps = {
    landmark_order_set,
    landmark_order_clear,
    landmark_clear
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface LandmarkProps extends PropsFromRedux {

}

const onClickClear = ({ landmark_order_clear }: LandmarkProps, colorkey_order: number): MouseEventHandler<SVGElement> => (e) => {
    landmark_order_clear(colorkey_order);
}

const Landmark = (props: LandmarkProps) => {
    const { cloth_type, landmark_order, landmark_order_set } = props
    return (
        <>
            {/* { Children.toArray(legend) } */}
            <Divider>랜드마크 (Landmarks)</Divider>
            <Grid container>
                <Grid item lg={3} sm={4} xs={5}>
                    <RadioGroup
                        aria-labelledby="cloth-type-label"
                        name="cloth_type"
                        value={landmark_order !== undefined ? landmark_order : -1}
                        onChange={(evt) => {
                            landmark_order_set(parseInt(evt.target.value))
                        }}
                    >
                        {mark_set[cloth_type!] && mark_set[cloth_type!].map((each, index) => {
                            const color = color_set[each];
                            const colorkey_order: number = color_key.indexOf(color[0]);
                            return (
                                <FormControlLabel
                                    key={index}
                                    value={colorkey_order}
                                    control={<Radio />}
                                    sx={{ height:36 }}
                                    label={'' + color[0] + '. ' + each} />
                            )
                        }) }
                    </RadioGroup>
                </Grid>
                <Grid item lg={3} sm={4} xs={5}>
                    {mark_set[cloth_type!] && mark_set[cloth_type!].map((each, index) => { 
                        return (<Stack key={index} direction="row">
                            <Button sx={{ backgroundColor: color_set[each][1] }}>visible</Button>
                            <Button sx={{ backgroundColor: color_set[each][2] }}>hidden</Button>
                        </Stack>)
                    }) }
                </Grid>
                <Grid item xs={1} sm={1}>
                    <Stack>
                    {mark_set[cloth_type!] && mark_set[cloth_type!].map((each, index) => { 
                        return (
                            <IconButton key={index} aria-label="delete" size="small" sx={{ height: 36 }}>
                                <HighlightOffIcon></HighlightOffIcon>
                            </IconButton>
                        )
                    }) }
                    </Stack>
                </Grid>
            </Grid>
        </>
    )
}

export default connector(Landmark)