import createMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import { IMAGE_POS_SET, image_setpos } from "./imageDuck";

const middleware = [thunk];
const mockStore = createMockStore(middleware);
const initialstate = {
    image: {}
}

describe('imageDuck', () => {
    var store;

    beforeAll(() => {
        store = mockStore(initialstate);
    })

    it('should set image position', () => {
        store.dispatch(image_setpos(1, 2));
        const action = store.getActions();
        const expected = [
            { type: IMAGE_POS_SET, payload: { top: 1, left: 2 } }
        ]
        expect(action).toEqual(expected);
    })
})