export declare class UploadController {
    uploadImage(file: any): Promise<{
        success: boolean;
        url: string;
        filename: any;
    }>;
}
