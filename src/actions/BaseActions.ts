export class BaseAction {
    readonly type: string;
    constructor(type: string) {
        this.type = type;
    } 

    toPlainObject(): BaseAction {
        return Object.assign({}, this);
    }
}