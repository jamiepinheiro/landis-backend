export class Account {
    private token: number;

    constructor(
        private active: boolean,
        private address: string,
        private balance: string,
        private comments: string,
        private created: string,
        private credit: number,
        private email: string,
        private employer: string,
        private name_first: string,
        private name_last: string,
        private picture: string,
        private tags: string[]
    ) {
        this.token = Math.floor(Math.random() * 10000000000000);
    };

    toWire(): any {
        return JSON.parse(JSON.stringify(this));
    };
}