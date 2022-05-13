/* eslint-disable testing-library/await-async-utils */
import moxios from "moxios";
import createMockStore from "redux-mock-store"
import thunk from "redux-thunk";
import { cloth_delete, CLOTH_GET, cloth_get, CLOTH_TYPE_SET, cloth_save, cloth_type_set, CLOTH_VARIED_SET, cloth_varied_set, LANDMARK_CLEAR, LANDMARK_ORDER_CLEAR, landmark_order_clear, LANDMARK_ORDER_SET, landmark_order_set, LANDMARK_SET, landmark_set, JOB_STATUS } from "./annoDuck";

const middleware = [thunk];
const mockStore = createMockStore(middleware);
const initialstate = {
    anno: {}
}

describe('annoDuck', () => {
    let store;

    beforeEach(() => {
        store = mockStore(initialstate);
        moxios.install();
    })

    afterEach(() => {
        moxios.uninstall();
    })

    it('should set cloth type', () => {
        store.dispatch(cloth_type_set("upper"));
        const action = store.getActions();
        const expected = [
            { type: CLOTH_TYPE_SET, payload: 'upper' },
            { type: LANDMARK_CLEAR }
        ];
        expect(action).toEqual(expected);
    })

    it('should set landmark_order (landmark type to mark color)', () => {
        const beforestate = {
            anno: {
                cloth_type: "upper"
            }
        };
        store = mockStore(beforestate);
        store.dispatch(landmark_order_set(0));
        const action = store.getActions();
        const expected = [
            { type: LANDMARK_ORDER_SET, payload: 0 }
        ];
        expect(action).toEqual(expected);
    })

    it('should clear landmark_order (landmark type to mark color)', () => {
        const beforestate = {
            anno: {
                marks: {
                    0: {}
                }
            }
        } 
        store = mockStore(beforestate);
        const state = store.getState();
        expect(state).toEqual(beforestate);
        store.dispatch(landmark_order_clear(0));
        const action = store.getActions();
        const expected = [
            { type: LANDMARK_ORDER_CLEAR, payload: {} }
        ];
        expect(action).toEqual(expected);
    })

    it('should change cloth_varied', () => {
        store = mockStore(initialstate);
        store.dispatch(cloth_varied_set(0));
        const action = store.getActions();
        const expected = [
            { type: CLOTH_VARIED_SET, payload: 0 }
        ];
        expect(action).toEqual(expected)
    })

    it('should set landmark', () => {
        store = mockStore(initialstate);
        store.dispatch(landmark_set(0, 0, 12, 23));
        const action = store.getActions();
        const expected = [
            { type: LANDMARK_SET, payload: { order: 0, vis_type: { 0: [{ x: 12, y: 23 }] } } }
        ];
        expect(action).toEqual(expected);
    })

    it('should save to file', (done) => {
        store = mockStore({
            dir: {
                files: ['file1'],
                cur_file: 0
            },
            anno: {
                marks: { 0: {} },
                cloth_type: 'upper',
                cloth_varied: 0
            }
        })
        moxios.wait(() => {
            var request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: 'OK'
            }).then(() => {
                const action = store.getActions();
                const expected = [
                    { type: JOB_STATUS, payload: 0 }
                ]
                expect(action).toEqual(expected);
                done();
            })
        })
        store.dispatch(cloth_save());
    })

    it('should get from file', (done) => {
        store = mockStore({
            dir: {
                cur_dir: 'out'
            }
        })
        const data = {
            "cloth_type": "upper",
            "marks": {
                "0": {
                    "0": [
                        {
                            "x": 96.4000015258789,
                            "y": 70.79999542236328
                        }
                    ]
                }
            },
            "landmark_order": 0,
            "cloth_varied": 1,
            "path": "out",
            "name": "1070263.jpg"
        }
        moxios.wait(() => {
            var request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: data
            }).then(() => {
                const action = store.getActions();
                const expected = [
                    { type: CLOTH_GET, payload: data }
                ];
                expect(action).toEqual(expected);
                done();
            })
        })
        store.dispatch(cloth_get("1070263.jpg"));
    })

    it('should delete file', (done) => {
        store = mockStore({
            dir: {
                files: ['file1'],
                cur_dir: 'out',
                cur_file: 0
            }
        })
        moxios.wait(() => {
            var request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: 'OK'
            }).then(() => {
                const action = store.getActions();
                const expected = [
                    { type: CLOTH_GET, payload: {} },
                    { type: JOB_STATUS, payload: 0 }
                ]
                expect(action).toEqual(expected);
                done();
            })
        })
        store.dispatch(cloth_delete());
    })
})