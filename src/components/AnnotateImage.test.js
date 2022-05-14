import React from 'react';
import { render, screen } from '@testing-library/react';
import moxios from 'moxios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import AnnotateImage from './AnnotateImage';

const middleware = [thunk];
const mockStore = configureMockStore(middleware)
const initialstate = {
    dir: {
        cur_dir: 'dir1',
        cur_file: 0,
        files: ['file1', 'file2', 'file3'],
    },
    anno: {
        landmark_order: 0,
        bbox: {
            y: 4, x: 5
        },
        bbox_show: 1
    },
    image: {
        image: {
            top: 2, left: 3
        }
    }
}

describe('AnnotateImage', () => {
    let store;

    beforeEach(() => {
        moxios.install();
        store = mockStore(initialstate);
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

    it('should render bounding box', () => {
        const imgRef = jest.fn();
        render(
            <AnnotateImage imgRef={ imgRef } store={ store } />
        )
        expect(screen.getByTestId(/bbox/i)).toBeInTheDocument();
    })
});