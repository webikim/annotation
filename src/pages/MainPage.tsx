import React from 'react';
import { Cookies } from 'react-cookie';
import { connect } from 'react-redux';

import SelectDir from '../components/SelectDir'
import { RootState } from '../store/store';

type MainPageProps = {
    cookies: Cookies
}

const MainPage = (props : MainPageProps) => {
    return (
        <SelectDir cookies={ props.cookies }></SelectDir>
    )
}

const mapStateToProps = (state: RootState) => {
    return {}
}

export default connect(mapStateToProps, { })(MainPage);