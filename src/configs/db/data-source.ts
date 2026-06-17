import * as dotenv from 'dotenv';
import {DataSource} from 'typeorm';

import getDBConfig from './options';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const isDev = NODE_ENV === 'development';

const cliSourceData = {
  entities: isDev ? ['src/**/*.entity.ts'] : ['dist/**/*.entity.js'],
  migrations: isDev ? ['src/migrations/*.ts'] : ['dist/migrations/*.js'],
};

const dataSource = new DataSource({
  ...getDBConfig(),
  ...cliSourceData,
});

// Для TypeORM CLI scripts
export default dataSource;
