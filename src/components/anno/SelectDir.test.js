import React from 'react'
import thunk from 'redux-thunk'

import { render } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'

import SelectDir from './SelectDir'

const middleware = [thunk]
const mockStore = configureMockStore(middleware);
const initialstate = {
    dir: {
        dirs: ['testdir']
    }
}
        
describe('selectDir component', () => {
    let store;

    beforeEach(() => {
        store = mockStore(initialstate)
    });

    it('should dispatch dir_list if dirs === undefined', () => {
        store = mockStore({
            dir: {
            }
        });
        store.dispatch = jest.fn()
        render(
            <SelectDir cookies={undefined} store={store}/>
        )
        expect(store.dispatch).toHaveBeenCalledTimes(1);
    })
})
