import { render, screen } from "@testing-library/react";
import createMockStore from "redux-mock-store"
import thunk from "redux-thunk";
import Landmark from "./Landmark";

const middleware = [thunk];
const mockStore = createMockStore(middleware);

describe('Landmark', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            anno: {}
        })
    })

    afterEach(() => {

    })

    it('should render landmark', () => {
        store = mockStore({
            anno: {
                cloth_type: "upper"
            }
        })
        render(
            <Landmark store={ store } />
        )
        expect(screen.getByText(/collar/i)).toBeInTheDocument()
    })

    it('should change color (type of landmark to mark color)', () => {

    })

    it('should clear color', () => {

    })
})