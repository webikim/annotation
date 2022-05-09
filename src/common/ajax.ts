import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

export const GET = 'get' as const;
export const POST = 'post' as const;
export const PUT = 'put' as const;
export const DELETE = 'delete' as const;

type RequestMethod = typeof GET | typeof POST | typeof PUT | typeof DELETE

export const ajaxBase = <T>(url: string, method?: RequestMethod, data?: T, header?: AxiosRequestHeaders) => {
    var params = undefined;
    if (method === GET) {
        params = data;
        data = undefined;
    }
    var config: AxiosRequestConfig<any> = {
        url: url,
        method: method,
        data: data,
        params: params,
        headers: header
    }
    console.log('.. ajax request : ', config)
    return axios(config);
}

export const encodeQueryData = (data: { [k: string]: string }) => {
    const ret = [];
    for (let k in data)
        ret.push(encodeURIComponent(k) + '=' + encodeURIComponent('' + data[k]));
    return ret.join('&');
}
