export enum HttpCode {
    E200 = 200,
    E201 = 201,
    E400 = 400,
    E401 = 401
}

export enum ErrStr {
    OK = '',

    // DB
    ErrNoObj = 'Can not find the record',
    ErrStore = 'Failed to store data',
    ErrDel = 'Failed to delete data',

    //Parameter
    ErrMissingParameter = 'Missing parameter'
}

export class Err {
    data: any;
    code: number;
    msg: string;
    page: any;

    constructor(code: HttpCode = HttpCode.E200, msg: string = ErrStr.OK, data: any = null,  page: any = null) {
        this.data = data
        this.code = code
        this.msg = msg
        this.page = page
    }
}