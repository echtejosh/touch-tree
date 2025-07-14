import { CompareOptions, FileServiceContract, FileShape } from 'domain/contracts/services/FileServiceContract';
import { saveAs } from 'file-saver';

export default function FileService(): FileServiceContract {
    function _isFileShape(to: FileShape | CompareOptions): to is FileShape {
        return (to as FileShape).content !== undefined;
    }

    function _isCompareOptions(to: FileShape | CompareOptions): to is CompareOptions {
        return (to as CompareOptions).b !== undefined;
    }

    function isLargerThan(ref: FileShape, to: FileShape): boolean;
    function isLargerThan(ref: FileShape, to: CompareOptions): boolean;
    function isLargerThan(ref: CompareOptions, to: FileShape): boolean;
    function isLargerThan(ref: CompareOptions, to: CompareOptions): boolean;

    function isLargerThan(ref: FileShape | CompareOptions, to: FileShape | CompareOptions): boolean {
        if (_isFileShape(ref) && _isFileShape(to)) {
            return ref.content.length > to.content.length;
        }

        if (_isFileShape(ref) && _isCompareOptions(to)) {
            const refSizeInBytes = ref.content.length;

            const {
                b,
                mb,
                gb,
            } = to;

            return (
                refSizeInBytes > b
                || refSizeInBytes > mb * 1024 * 1024
                || refSizeInBytes > gb * 1024 * 1024 * 1024
            );
        }

        if (_isCompareOptions(ref) && _isFileShape(to)) {
            const refSizeInBytes = ref.b || ref.mb * 1024 * 1024 || ref.gb * 1024 * 1024 * 1024;

            return refSizeInBytes > to.content.length;
        }

        if (_isCompareOptions(ref) && _isCompareOptions(to)) {
            const refSizeInBytes = ref.b || ref.mb * 1024 * 1024 || ref.gb * 1024 * 1024 * 1024;
            const toSizeInBytes = to.b || to.mb * 1024 * 1024 || to.gb * 1024 * 1024 * 1024;

            return refSizeInBytes > toSizeInBytes;
        }

        return false;
    }

    async function urlToBase64(url: string): Promise<string> {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    async function download(file: FileShape): Promise<void> {
        const response = await fetch(file.content);
        const blob = await response.blob();

        saveAs(blob, file.name);
    }

    return {
        isLargerThan,
        urlToBase64,
        download,
    };
}
