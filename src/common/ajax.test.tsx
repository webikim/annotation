/* eslint-disable testing-library/await-async-utils */
import moxios from "moxios";

import { ajaxBase, GET } from "./ajax";

describe('ajax', () => {
    beforeEach(() => {
        moxios.install()
    })

    afterEach(() => {
        moxios.uninstall()
    })

    it('should call backend', async () => {
        const data = ['out1', 'out2', 'out3']
        moxios.wait(() => {
            var request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: data
            })
        })

        const resp = await ajaxBase('http://localhost:5000/dir/list', GET)
        expect(resp.data).toEqual(data);
    })
})