import type { Client } from 'pg';

let pgClient: Client | null = null;
let sqliteDb: any = null;

/**
 * DBActions supports basic Postgres and SQLite queries.
 * For SQLite support, install `sqlite3` in the workspace: `npm install sqlite3`.
 */
export class DBActions {
	/**
	 * Connect to a database. Usage:
	 * - Postgres: connectDB(dbUsername, dbPassword, dbServerName, dbPort, dbName)
	 * - SQLite: connectDB('sqlite', '', '', '', '', sqliteFilePath)
	 */
	async connectDB(dbUsername: string, dbPassword: string, dbServerName: string, dbPort: string, dbName: string, sqlitePath?: string) {
		// SQLite branch
		if (dbUsername === `sqlite` || (sqlitePath && sqlitePath.endsWith(`.sqlite`))) {
			try {
				// Lazy-require sqlite3 to avoid adding a hard dependency
				 
				const sqlite3 = require(`sqlite3`).verbose();
				sqliteDb = new sqlite3.Database(sqlitePath || dbName, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err: any) => {
					if (err) throw err;
				});
				return;
			} catch (e) {
				throw new Error(`SQLite support requires the \`sqlite3\` package. Run \`npm install sqlite3\``);
			}
		}

		// Postgres branch
		try {
			 
			const { Client: PgClient } = require(`pg`);
			const connectionString = `postgres://${dbUsername}:${dbPassword}@${dbServerName}:${dbPort}/${dbName}`;
			pgClient = new PgClient({ connectionString });
			await pgClient.connect();
		} catch (err) {
			throw err;
		}
	}

	/**
	 * Execute a query. Returns the driver-specific result.
	 */
	async query(queryString: string): Promise<any> {
		if (sqliteDb) {
			return new Promise((resolve, reject) => {
				sqliteDb.all(queryString, (err: any, rows: any) => {
					if (err) return reject(err);
					resolve(rows);
				});
			});
		}

		if (pgClient) {
			return pgClient.query(queryString);
		}

		throw new Error(`No database connection. Call connectDB() first.`);
	}

	/**
	 * Close any open database connections.
	 */
	async close(): Promise<void> {
		if (sqliteDb) {
			try {
				sqliteDb.close();
			} catch (e) {
				// ignore close errors
			}
			sqliteDb = null;
			return;
		}

		if (pgClient) {
			try {
				await pgClient.end();
			} catch (e) {
				// ignore
			}
			pgClient = null;
			return;
		}
	}
}