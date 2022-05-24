import { render } from "@testing-library/react";
import createMockStore from "redux-mock-store"
import thunk from "redux-thunk";
import ImageNav from "./ImageNav";

const middleware = [thunk];
const mockStore = createMockStore(middleware);
const initialstate = {
    dir: {
        files: []
    },
    anno: {
        status: 0
    },
    image: {
        auto_next: 0
    }
}

describe('Nav', () => {
    let store;

    beforeAll(() => {
        store = mockStore(initialstate);
    })

    it('show render', () => {
        render(
            <ImageNav store={store} />
        )
    })
})