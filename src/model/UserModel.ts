export class User {
    readonly name: string;
    readonly infoId: number;
    constructor(name: string, infoId: number) {
        this.name = name;
        this.infoId = infoId;
    }
}