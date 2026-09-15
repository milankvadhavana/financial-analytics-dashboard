import { Response } from 'express';
interface ExportConfig {
    columns: string[];
    filters?: any;
}
export declare class CSVService {
    static generateAndSend(res: Response, config: ExportConfig): Promise<void>;
    private static buildQuery;
}
export {};
//# sourceMappingURL=csvService.d.ts.map