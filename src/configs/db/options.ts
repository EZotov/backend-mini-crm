import {DataSourceOptions} from 'typeorm';

export default (): DataSourceOptions => {
    const {
        NODE_ENV = 'development',
        DB_HOST = 'localhost',
        DB_PORT = '5432',
        DB_USERNAME,
        DB_PASSWORD,
        DB_NAME,
        DB_ENABLE_SYNCHRONIZE,
    } = process.env;

    return {
        type: 'postgres',
        host: DB_HOST,
        port: parseInt(DB_PORT),
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
        synchronize: NODE_ENV === 'development' && DB_ENABLE_SYNCHRONIZE === 'true',
        logging: NODE_ENV === 'development',
        entities: ['dist/**/*.entity.{ts,js}'],
        migrations: ['dist/migrations/*.{ts,js}'],
    };
};
