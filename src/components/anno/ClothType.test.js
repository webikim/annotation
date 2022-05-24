import { render, screen } from "@testing-library/react";
import createMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import ClothType from "./ClothType";

const middleware = [thunk];
const mockStore = createMockStore(middleware);
const initialstate = {
    anno: {}
}

describe('ClothType', () => {
    let store;

    it('should render', () => {
        store = mockStore(initialstate);
        render(
            <ClothType store={ store }/>
        );
        const labelElement = screen.getByText(/상의/i);
        expect(labelElement).toBeInTheDocument();
    })
})