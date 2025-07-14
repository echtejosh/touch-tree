import { useCallback } from 'react';
import Container from 'infrastructure/services/Container';
import FileService from 'application/services/FileService';
import { FileShape } from 'domain/contracts/services/FileServiceContract';

const getFileNameWithTimestamp = (fileName: string) => {
    const formattedDate = new Date().toISOString().split('T')[0];
    return `${fileName}-${formattedDate}`;
};

export function useDownload() {
    const fileService = Container.resolve(FileService);

    const handleDownload = useCallback(
        async (file?: FileShape | null, onDownloadClick?: () => Promise<FileShape | null>) => {
            try {
                let downloadFile = file;

                if (!downloadFile && onDownloadClick) {
                    downloadFile = await onDownloadClick();
                }

                if (downloadFile) {
                    const fileNameWithTimestamp = getFileNameWithTimestamp(downloadFile.name);
                    await fileService.download({
                        content: downloadFile.content,
                        name: fileNameWithTimestamp,
                    });
                } else {
                    console.error('No file available for download');
                }
            } catch (error) {
                console.error('Download failed', error);
                throw error; // Optional: rethrow if you want to handle errors in the component
            }
        },
        [fileService],
    );

    return { handleDownload };
}
