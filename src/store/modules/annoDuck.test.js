import createMockStore from "redux-mock-store"
import thunk from "redux-thunk";
import { cloth_type_set, cloth_varied_set, landmark_order_clear, landmark_order_set, landmark_set } from "./annoDuck";

const middleware = [thunk];
const mockStore = createMockStore(middleware);
const initialstate = {
            anno: { }
        }

describe('annoDuck', () => {
    let store;

    beforeAll(() => {
        store = mockStore(initialstate);
    })

    it('should set cloth type', () => {
        store.dispatch(cloth_type_set("upper"));
        const action = store.getActions();
        const expected = { type: 'cloth/type/set', payload: 'upper' }
        expect(action).toEqual([expected]);
    })

    it('should set landmark_order (landmark type to mark color)', () => {
        const beforestate = {
            anno: {
                cloth_type: "upper"
            }
        }
        store = mockStore(beforestate);
        store.dispatch(landmark_order_set(0));
        const action = store.getActions();
        const expected = { type: 'cloth/color/set', payload: 0 }
        expect(action).toEqual([expected]);
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
        const expected = { type: 'cloth/color/clear', payload: {} };
        expect(action).toEqual([expected]);
    })

    it('should change cloth_varied', () => {
        store = mockStore(initialstate);
        store.dispatch(cloth_varied_set(0));
        const action = store.getActions();
        const expected = { type: 'cloth/varied/set', payload: 0 }
        expect(action).toEqual([expected])
    })

    it('should set landmark', () => {
        store = mockStore(initialstate);
        store.dispatch(landmark_set(0, 0, 12, 23));
        const action = store.getActions();
        const expected = {"payload": {"order": 0, "vis_type": {"0": [{"x": 12, "y": 23}]}}, "type": "cloth/landmark/set"}
        expect(action).toEqual([expected]);
    })
})