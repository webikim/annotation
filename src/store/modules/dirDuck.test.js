/* eslint-disable testing-library/await-async-utils */
import moxios from "moxios";
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { DIR_LIST, dir_list, DIR_SET, dir_set, FILE_LIST, file_list, FILE_SET, file_set } from "./dirDuck";

const middleware = [thunk]
const mockStore = configureMockStore(middleware);
const initialstate = {
    dir: {}
}

describe('dirDuck', () => {
    let store;

    beforeEach(() => {
        moxios.install();
        store = mockStore(initialstate)
    })

    afterEach(() => {
        moxios.uninstall();
    })

    it('should get dir list', (done) => {
        const data = ['dir1', 'dir2', 'dir3']
        moxios.wait(() => {
            var request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: data
            }).then(() => {
                const actual = store.getActions();
                const expected = [
                    { type: DIR_LIST, payload: data }
                ];
                expect(actual).toEqual(expected);
                done();
            })
        })
        store.dispatch(dir_list())
    })

    it('should set current dir', () => {
        store.dispatch(dir_set('dir1', 0))
        const actual = store.getActions();
        const expected = [
            { type: DIR_SET, payload: 'dir1' }
        ];
        expect(actual).toEqual(expected);
    })

    it('should get file list', (done) => {
        const data = ['file1', 'file2', 'file3']
        moxios.wait(() => {
            var request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: data
            }).then(() => {
                const actual = store.getActions();
                const expected = [
                    { type: FILE_LIST, payload: data }
                ]
                expect(actual).toEqual(expected)
                done();
            })
        })
        store.dispatch(file_list('dir1'))
    })

    it('should not set current file', () => {
        store.dispatch(file_set(0))
        const actual = store.getActions();
        expect(actual).toEqual([]);
    })

    it('should set current file', () => {
        store = mockStore({
            dir: {
                files: ['file1']
            }
        })
        store.dispatch(file_set(0))
        const actual = store.getActions();
        const expected = [
            { type: FILE_SET, payload: 0 }
        ]
        expect(actual).toEqual(expected);
    })

})
