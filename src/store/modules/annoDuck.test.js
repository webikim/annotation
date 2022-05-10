import createMockStore from "redux-mock-store"
import thunk from "redux-thunk";
import { cloth_type_set } from "./annoDuck";

const middleware = [thunk];
const mockStore = createMockStore(middleware);
const initialstate = {};

describe('annoDuck', () => {
    let store;

    beforeEach(() => {
        store = mockStore(initialstate);
    })

    afterEach(() => {
        
    })

    it('should set cloth type', () => {
        store.dispatch(cloth_type_set("upper"));
        const action = store.getActions();
        const expected = { type: 'cloth/type/set', payload: 'upper' }
        expect(action).toEqual([expected]);
    })
})