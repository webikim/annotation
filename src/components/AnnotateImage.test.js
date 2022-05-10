import React from 'react';
import { render, screen } from '@testing-library/react';
import moxios from 'moxios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import AnnotateImage from './AnnotateImage';

const middleware = [thunk];
const mockStore = configureMockStore(middleware)

describe('AnnotateImage', () => {
    let store;

    beforeEach(() => {
        moxios.install();
        store = mockStore({
            dir: {
                cur_dir: 'dir1',
                cur_file: 0,
                files: ['file1', 'file2', 'file3' ]
            }
        })
    })

    afterEach(() => {
        moxios.uninstall();
    })

    it('should render image', () => {
        const imgRef = jest.fn();
        render(
            <AnnotateImage imgRef={ imgRef } store={ store } />
        )
        const imgElem = screen.getByAltText('annotation target')
        expect(imgElem).toBeInTheDocument();
    })
});