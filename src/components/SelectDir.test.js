import React from 'react'
import thunk from 'redux-thunk'

import { fireEvent, render, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'

import SelectDir from './SelectDir'

const middleware = [thunk]
const mockStore = configureMockStore(middleware);

describe('selectDir component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            dir: {
                dirs: ['testdir']
            }
        })
    });

    afterEach(() => {

    })

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

    it('should render SelectDir', () => {
        render(
            <SelectDir cookies={undefined} store={store}/>
        )
        const labelElement = screen.getByText(/작업 위치/i)
        expect(labelElement).toBeInTheDocument();
        const optionElement = screen.getByText(/현재위치/i)
        expect(optionElement).toBeInTheDocument();
        const testElement = screen.getByText(/testdir/i)
        expect(testElement).toBeInTheDocument();
        let options = screen.getAllByTestId('select-option')
        expect(options.length).toEqual(2)
    });

    it('should diaptch dir_set if select change', () => {
        let cookies = {
            get: jest.fn()
        }
        store.dispatch = jest.fn()
        render(
            <SelectDir cookies={ cookies } store={store}/>
        )
        fireEvent.change(screen.getByTestId('select'), { target: { value: 'testdir' }});
        expect(cookies.get).toHaveBeenCalledWith('testdir')
        expect(store.dispatch).toHaveBeenCalledTimes(2)

        // without store.dispatch = jest.fn(). call actual ajax
        // const actions = store.getActions();
        // expect(actions[0]).toEqual({ type: 'dir/set', payload: 'testdir' })
    })
})
