import Datastore from 'nedb';

const db: Datastore<DownloadEntity> = new Datastore<DownloadEntity>({ filename: `${__dirname}/tmp/download.db`, autoload: true });

export interface DownloadEntity {
    uuid?: string;
    expires?: number;
    videoid?: string;
}

class DownloadRepository {
    select(query: any): Promise<DownloadEntity[]> {
        return new Promise(resolve => {
            db.find(query, (err: Error, newEntity: DownloadEntity[]) => {
                if (err) console.error(err);
                // console.log(`select. size = ${newEntity.length}`);
                resolve(newEntity);
            });
        });
    }

    insert(entity: any): Promise<DownloadEntity[]> {
        return new Promise(resolve => {
            db.insert(entity, (err: Error, newEntity: DownloadEntity[]) => {
                if (err) console.error(err);
                // console.log(`insert. size = ${newEntity.length}`);
                resolve(newEntity);
            });
        });
    }

    upsert(query: any, updateQuery: any, upsert: boolean = false) {
        return new Promise(resolve => {
            db.update(query, updateQuery, { upsert: upsert, multi: true }, (err: Error, num: number) => {
                if (err) console.error(err);
                // console.log(`upsert. size = ${num}`);
                resolve(num);
            });
        });
    }

    delete(query: any): Promise<number> {
        return new Promise(resolve => {
            db.remove(query, { multi: true }, (err: Error, num: number) => {
                if (err) console.error(err);
                //console.log(`delete. size = ${num}`);
                resolve(num);
            });
        });
    }

    expires = () => new Date(+new Date() + 5 * 60 * 1000).getTime();
    nowTime = () => new Date(+new Date() + 0 * 60 * 1000).getTime();
}

export default new DownloadRepository();
