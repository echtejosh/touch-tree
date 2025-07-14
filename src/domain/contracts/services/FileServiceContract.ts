export interface FileShape {
    name: string;
    content: string;
}

export interface CompareOptions {
    mb: number,
    gb: number,
    b: number,
}

export interface FileServiceContract {
    isLargerThan(ref: FileShape, to: FileShape): boolean;

    isLargerThan(ref: FileShape, to: CompareOptions): boolean;

    isLargerThan(ref: CompareOptions, to: FileShape): boolean;

    isLargerThan(ref: CompareOptions, to: CompareOptions): boolean;

    isLargerThan(ref: CompareOptions | FileShape, to: FileShape | CompareOptions): boolean;

    urlToBase64(url: string): Promise<string>;

    download(file: FileShape): Promise<void>;
}
