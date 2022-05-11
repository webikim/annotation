import createMockStore from "redux-mock-store"
import thunk from "redux-thunk";
import { cloth_type_set, landmark_clear, landmark_order_clear, landmark_order_set } from "./annoDuck";

const middleware = [thunk];
const mockStore = createMockStore(middleware);

describe('annoDuck', () => {
    let store;

    beforeAll(() => {
        store = mockStore({
            anno: { }
        });
    })

    it('should set cloth type', () => {
        store.dispatch(cloth_type_set("upper"));
        const action = store.getActions();
        const expected = { type: 'cloth/type/set', payload: 'upper' }
        expect(action).toEqual([expected]);
    })

    it('should set landmark_order', () => {
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

    it('should clear landmark_order', () => {
        const beforestate = {
            anno: {
                marks: {
                    0: {}
                }
            }
        } 
        store = mockStore(beforestate);
        const state = store.getState();
        expect(state).toEqual(beforestate)
        store.dispatch(landmark_order_clear(0));
        const action = store.getActions();
        const expected = { type: 'cloth/color/clear', payload: {} }
        expect(action).toEqual([expected]);
    })
})