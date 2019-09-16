import fs from 'fs';

class file {
    isExist(filePath: string) {
        return new Promise<number>(resolve => {
            try {
                fs.statSync(filePath);
                resolve(1);
            } catch (e) {
                resolve(0);
            }
        });
    }
}

export const File = new file();
