declare class MysqlConfig {
  type?: string;
  host: string;
  port: number;
  username: string;
  password?: string | undefined;
  database: string;
  synchronize: boolean;
  logging: boolean;
  entities: string[];
  migrations: string[];
  subscribers: string[];
}