import React, { } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Cookies } from 'react-cookie';

import { Checkbox, FormControlLabel, Grid, Stack } from '@mui/material';

import { image_auto_next } from '../store/modules/imageDuck';
import { RootState } from '../store/store';
import BBox from './BBox';
import ClothType from './ClothType';
import ClothVaried from './ClothVaried';
import ImageNav from './ImageNav';
import Landmark from './Landmark';

const mapStateToProps = (state: RootState) => ({
    auto_next: state.image.auto_next
})

const mapDispatchToProps = {
    image_auto_next
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface RightPanceProps extends PropsFromRedux {
    cookies: Cookies
}

const RightPane = (props: RightPanceProps) => {
    const { auto_next, cookies, image_auto_next } = props
    return (
        <>
            <div style={{ height: 520 }}>
            <Stack sx={{ marginTop: 1 }} spacing={2} >
                <ClothType></ClothType>
                <Landmark></Landmark>
                <ClothVaried></ClothVaried>
                <BBox></BBox>
            </Stack>
            </div>
            <Grid container spacing={3}>
                <Grid item lg={11}>
                    <ImageNav cookies={cookies}></ImageNav>
                </Grid>
                <Grid item lg={1}>
                    <FormControlLabel
                        label="Auto"
                        sx={{ height: 0 }}
                        control={
                            <Checkbox
                                checked={auto_next === 1}
                                onChange={(evt) => {
                                    image_auto_next(auto_next === 1 ? 0 : 1);
                                }}
                            />
                        }
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default connector(RightPane);