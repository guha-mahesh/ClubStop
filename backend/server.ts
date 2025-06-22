import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import userRoutes from './users/users'
import clubRoutes from './clubs/clubs'





dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cors());



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', userRoutes);
app.use('/api', clubRoutes);





export const pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'pass',
    database: process.env.DB_NAME || 'mydb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('Database connection failed:', error);
        setTimeout(testConnection, 5000);
    }
}

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Backend server is running!' });
});

app.get('/health', async (req: Request, res: Response) => {
    try {
        await pool.execute('SELECT 1');
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    testConnection();
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Closing HTTP server and database pool...');
    await pool.end();
    process.exit(0);
});