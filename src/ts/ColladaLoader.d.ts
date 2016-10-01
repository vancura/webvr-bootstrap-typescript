declare namespace THREE {
    export class ColladaLoader {
        options: any;

        load(name: string,
            readyCallback: (result: any) => void,
            progressCallback: (total: number, loaded: number) => void): void;
    }
}
