/* eslint-disable testing-library/await-async-utils */
import moxios from "moxios";
import createMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import { get_image_label, IMAGE_LABEL_GET } from "./imageDuck";

const middleware = [thunk];
const mockStore = createMockStore(middleware);
const initialstate = {
    image: {},
    dir: {
        cur_dir: '0ut'
    }
}

describe('imageDuck', () => {
    var store;

    beforeEach(() => {
        moxios.install();
        store = mockStore(initialstate);
    })

    afterEach(() => {
        moxios.uninstall();
    })

    it('should get image label', (done) => {
        const data = {
            "데이터셋 정보": {
                "데이터셋 상세설명": {
                    "라벨링": {
                        "상의": [
                            {
                                "색상": "화이트",
                                "소매기장": "7부소매"
                            }
                        ],
                        "스타일": [
                            {}
                        ],
                        "아우터": [
                            {}
                        ],
                        "원피스": [
                            {}
                        ],
                        "하의": [
                            {
                                "색상": "화이트"
                            }
                        ]
                    },
                    "렉트좌표": {
                        "상의": [
                            {
                                "X좌표": 128.504,
                                "Y좌표": 106.452,
                                "가로": 621,
                                "세로": 558
                            }
                        ],
                        "아우터": [
                            {}
                        ],
                        "원피스": [
                            {}
                        ],
                        "하의": [
                            {
                                "X좌표": 240.504,
                                "Y좌표": 569.044,
                                "가로": 361,
                                "세로": 476
                            }
                        ]
                    }
                },
                "파일 번호": 1070263,
                "파일 생성일자": "2020-11-12 16:33:57",
                "파일 이름": "nt2157k07-nt2157k07-s_3.jpg"
            },
            "이미지 정보": {
                "이미지 너비": 800,
                "이미지 높이": 1049,
                "이미지 식별자": 1070263,
                "이미지 파일명": "nt2157k07-nt2157k07-s_3.jpg"
            }
        }
        moxios.wait(() => {
            let request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: data
            }).then(() => {
                const action = store.getActions();
                const expexted = [
                    { type: IMAGE_LABEL_GET, payload: data }
                ];
                expect(action).toEqual(expexted);
                done();
            })
        })
        store.dispatch(get_image_label('1070263.jpg'))
    })
})