import { fireEvent, render, screen } from "@testing-library/react";
import createMockStore from "redux-mock-store"
import thunk from "redux-thunk";
import ClothVaried from "./ClothVaried";

const middleware = [thunk]
const mockStore = createMockStore(middleware);
const initialstate = {
    anno: { }
}

describe('ClothVaried', () => {
    let store;

    beforeAll(() => {
        store = mockStore(initialstate);
    })

    it('should render', () => {
        render(
            <ClothVaried store={ store } />
        )
        expect(screen.getByText(/없음/i)).toBeInTheDocument();
    })

    it('should change cloth varied', () => {
        render(
            <ClothVaried store={ store } />
        )
        fireEvent.click(screen.getByDisplayValue(1));
        const action = store.getActions();
        const expected = { type: 'cloth/varied/set', payload: 1 }
        expect(action).toEqual([expected])
    })
})