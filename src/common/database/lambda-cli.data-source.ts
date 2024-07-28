import { DataSource, DataSourceOptions } from 'typeorm';
import databaseConfig from '../config/database.config';
import { generatePasswordWithSecretsManager } from './utils/generatePasswordWithSecretsManager';

// Define the allowed database types based on what your application supports
type DatabaseType = 'postgres';

// Cast the type explicitly
const initializeDataSource = async (): Promise<DataSource> => {
  const config = databaseConfig();

  // Retrieve the password asynchronously
  const password = await generatePasswordWithSecretsManager("DBSecret");

  // Configure DataSource options
  const dataSourceOptions: DataSourceOptions = {
    type: config.type as DatabaseType, // Explicitly cast the type
    host: config.host,
    port: config.port,
    username: config.username,
    password: password,
    database: config.name,
    synchronize: false,
    dropSchema: false,
    logging: true,
    ssl: config.sslEnabled,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    extra: config.sslEnabled
      ? {
        sslmode: 'verify-full',
        sslrootcert: __dirname + '/certs/rds-combined-ca-bundle.pem',
      }
      : {},
  };

  // Create and return the DataSource instance
  return new DataSource(dataSourceOptions);
};

// Export a promise that resolves to the initialized DataSource
export const AppDataSource = initializeDataSource();
