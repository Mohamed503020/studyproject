export class NestedTransferModel <T = any>{
    public data: T;
    public isNew: boolean;
    constructor(data:T, isnew :boolean) {
        this.data = data;
        this.isNew = isnew;
    }
}