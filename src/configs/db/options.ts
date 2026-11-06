import {DataSourceOptions} from 'typeorm';

export default (): DataSourceOptions => {
    const {NODE_ENV, DB_HOST = 'localhost', DB_PORT = '5432', DB_USERNAME, DB_PASSWORD, DB_NAME} = process.env;

    return {
        type: 'postgres',
        host: DB_HOST,
        port: parseInt(DB_PORT),
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
        synchronize: false,
        logging: NODE_ENV === 'development',
    };
};
