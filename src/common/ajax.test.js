/* eslint-disable testing-library/await-async-utils */
import moxios from "moxios";

import { ajaxBase, encodeQueryData, GET } from "./ajax";

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

    it('should return URL encoded string', () => {
        const data = {
            'key1': 'value1',
            'key2': 'value2'
        }
        expect(encodeQueryData(data)).toEqual('key1=value1&key2=value2')
    })
})