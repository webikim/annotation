import { render, screen } from "@testing-library/react"
import createMockStore from "redux-mock-store"
import thunk from "redux-thunk";
import BBox from './BBox'

const middleware = [thunk];
const mockStore = createMockStore(middleware);
const initialstate = {
    anno: {},
    image: {}
}

describe('BBox', () => {
    let store;

    beforeAll(() => {
        store = mockStore(initialstate);
    })

    it('should render no bbox', () => {
        render(
            <BBox store={ store } />
        )
        expect(screen.getAllByText(/박스/i).length).toEqual(2)
    })

    it('should render bbox options', () => {
        store = mockStore({
            anno: {
                bbox: { x:1, y:2 }
            },
            image: {}
        })
        render(
            <BBox store={ store } />
        )
        expect(screen.getAllByText(/박스/i).length).toEqual(3)
    })
})