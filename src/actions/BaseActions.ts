export class BaseAction {
    readonly type: Symbol;
    constructor(type: Symbol) {
        this.type = type;
    }

    toPlainObject() : BaseAction {
        return Object.assign({}, this);
    }
}