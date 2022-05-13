// external. partial type as below. use quicktype later.
export type LabelType = {
    [k: string]: {
        [k: string]: object
    }
}

export type LandmarkType = {
    [k: number]: {
        x: number,
        y: number
    }[]
};

export type CollectLandmarkType = {
    [k: number]: LandmarkType
}

export type BBoxType = {
    x: number,
    y: number,
    width: number,
    height: number
}