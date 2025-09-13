
import { Router, Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import { RowDataPacket } from 'mysql2';
import { pool } from '../server';
import { hashPassword, verifyPassword } from './hash'
import verifyToken from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';
import jwt from 'jsonwebtoken';

const isProduction = process.env.NODE_ENV === 'production';



const router = Router();



async function createUser(req: Request, res: Response) {
    console.log(isProduction)
    const { username, password, school, email } = req.body;


    console.log('Received:', { username, password, school, email });

    const pwd = await hashPassword(password);

    try {
        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO users (username, password, School, email) VALUES (?, ?, ?, ?)',
            [username, pwd, school, email]
        );

        if (result) {
            const token = jwt.sign(
                {
                    userId: result.insertId,
                    username: username
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                maxAge: 24 * 60 * 60 * 1000,

                path: '/'
            });

            res.json({
                success: true,

                user: {
                    id: result.insertId,
                    username: username
                },
                school: school

            });
        }
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.message.includes('users.email')) {
                return res.status(400).json({ error: 'You have already created an account with this Email.' });
            } else if (error.message.includes('users.username')) {
                return res.status(400).json({ error: 'Username Taken' });
            }
        }
        else {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}


async function getUserData(username: string) {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        ) as [RowDataPacket[], any];

        if (rows.length === 0) {
            return null;
        }

        return rows[0];

    } catch (error) {
        console.error("Couldn't find User :", error);
        return null;
    }
}




async function Login(req: Request, res: Response) {
    const { username, password } = req.body;
    console.log('Received:', { username, password });
    const user_data = await getUserData(username)
    if (user_data) {
        const hashed_pwd = user_data.password
        try {
            const verification = await verifyPassword(password, hashed_pwd)
            if (verification) {
                const token = jwt.sign(
                    {
                        userId: user_data.users_id,
                        username: user_data.username
                    },
                    process.env.JWT_SECRET || 'your-secret-key',
                    { expiresIn: '24h' }
                );
                res.cookie('jwt', token, {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: isProduction ? 'none' : 'lax',
                    maxAge: 24 * 60 * 60 * 1000,

                    path: '/'
                });
                res.json({
                    success: true,

                    user: {
                        id: user_data.users_id,
                        username: user_data.username

                    },
                    school: user_data.School
                });
            }
            else {
                res.json({ match: "incorrect password" })
            }
        }
        catch (err) {
            console.error("could not verify password", err)


        }
    }






}


async function getClubs(req: AuthRequest, res: Response) {
    const userId = req.params.userId;
    console.log("received", { userId })
    try {
        console.log("trying")
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT club_id, clubRole FROM clubMember WHERE users_id = ?', [userId])

        if (rows.length !== 0) {
            console.log("got rows!")
            const clubIds = rows.map(row => row.club_id);
            const placeholders = clubIds.map(() => '?').join(',');

            const [clubs] = await pool.execute<RowDataPacket[]>(
                `SELECT clubName, clubDesc, School, created_at, club_id, leader, leaderName FROM clubs WHERE club_id IN (${placeholders})`,
                clubIds
            );

            if (clubs.length === rows.length) {

                const roleMap = new Map<number, string>();
                rows.forEach(row => roleMap.set(row.club_id, row.clubRole));


                const enrichedClubs = clubs.map(club => ({
                    ...club,
                    clubRole: roleMap.get(club.club_id)
                }));

                res.json({
                    success: true,
                    clubData: enrichedClubs

                });
            } else {
                console.log("youre a failure x")
            }
        }
        else {
            console.log("Got past rows!")
            res.json({
                success: true,
                clubData: "No Clubs Yet"
            })
        }

    } catch (err) {
        res.json({
            success: false,
            error: err
        })
    }

}


async function joinClub(req: AuthRequest, res: Response) {
    const { clubId, userId } = req.body;
    console.log("Received:", { clubId, userId })
    try {
        const [userresult] = await pool.execute<ResultSetHeader>('INSERT INTO clubMember (users_id, club_id, clubRole) VALUES (?,?,?)', [userId, clubId, 'Member'])

        if (userresult) {
            res.json({
                success: true,
                order: userresult

            })
        }
        else {
            res.json({
                success: false,
                error: "something went wrong"
            })
        }

    } catch (err) {
        console.log(err)

        res.json({
            success: false,
            error: err
        })
    }
}


async function fetchUserData(req: Request, res: Response) {
    const userId = req.params.userId;
    console.log("Received", { userId })

    try {
        const [userrows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM users WHERE users_id = ?',
            [userId]
        );
        const user = userrows[0];
        if (user) {
            delete user.password;
        }


        const [clubsled] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM clubs WHERE leader = ?',
            [userId]
        );

        const [clubsjoined_id] = await pool.execute<RowDataPacket[]>(
            'SELECT club_id FROM clubMember WHERE users_id = ?',
            [userId]
        );


        const clubIds = clubsjoined_id.map(row => row.club_id);

        let clubsjoined: RowDataPacket[] = [];

        if (clubIds.length > 0) {
            const [results] = await pool.query<RowDataPacket[]>(
                `SELECT * FROM clubs WHERE club_id IN (${clubIds.map(() => '?').join(',')}) AND leader <> ?`,
                [...clubIds, userId]
            );
            clubsjoined = results;
        }

        if (userrows.length !== 0) {
            console.log(userrows[0].userDesc)

            res.json({
                success: true,
                userData: user,
                clubsLed: clubsled,
                clubsJoined: clubsjoined



            })

        }
        else {
            res.json({
                success: false,
                error: "could not fetch any userData "
            })
        }

    } catch (err) {
        console.log(err)

    }

}


async function editUserData(req: AuthRequest, res: Response) {
    const { userId, username, school, desc } = req.body;
    console.log("Received editUser", { username, school, desc })

    try {
        const [editrows] = await pool.execute<ResultSetHeader>(
            'UPDATE users SET username=?, userDesc=?, School=? WHERE users_id=?',
            [username, desc, school, userId]
        );

        if (editrows) {
            const [clubstoedit] = await pool.execute<RowDataPacket[]>(
                'SELECT * FROM clubs WHERE leader = ?', [userId]
            );

            if (clubstoedit.length !== 0) {
                const [edittedClubs] = await pool.execute<ResultSetHeader>(
                    'UPDATE clubs SET leaderName = ? WHERE leader = ?',
                    [username, userId]
                );

                if (edittedClubs) {
                    return res.json({ success: true });
                }
            }

            return res.json({ success: true });
        } else {
            return res.json({
                success: false,
                error: "Could not edit profile"
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }

}



async function getUniversities(req: Request, res: Response) {
    try {
        const [unirows] = await pool.execute<RowDataPacket[]>('SELECT name FROM universityData')

        if (unirows.length !== 0) {
            res.json({
                success: true,
                unis: unirows

            })
        } else {
            res.json({
                success: false,
                error: "failed to fetch uni data"
            })
        }

    } catch (err) {
        console.log(err)
    }

}


async function getFlairs(req: Request, res: Response) {
    console.log("getting flairs")
    try {
        const [flairRows] = await pool.execute<RowDataPacket[]>('SELECT flair_name FROM club_flairs')

        if (flairRows.length !== 0) {
            res.json({
                success: true,
                flairs: flairRows

            })
        } else {
            res.json({
                success: false,
                error: "failed to fetch flair data"
            })
        }

    } catch (err) {
        console.log(err)
    }


}
async function verifyAuth(req: Request, res: Response) {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token found'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

        const user = await pool.execute<RowDataPacket[]>(
            'SELECT users_id, username, School FROM users WHERE users_id = ?',
            [decoded.userId]
        ).then(([rows]) => rows[0]);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }




        res.json({
            success: true,
            user: {
                id: user.users_id,
                username: user.username,
            },
            school: user.School
        });

    } catch (error: any) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({
                success: false,
                message: 'Invalid token'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({
                success: false,
                message: 'Token expired'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during authentication'
        });
    }
}
async function logout(req: Request, res: Response) {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/'
        });

        res.json({
            success: true,
            message: 'Successfully logged out'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error during logout'
        });
    }
}








router.post('/users', createUser);
router.post('/login', Login)
router.get('/clubs/:userId', verifyToken, getClubs)
router.post('/member', verifyToken, joinClub)
router.get('/user/:userId', fetchUserData)
router.put('/user', verifyToken, editUserData)
router.get('/university', getUniversities)
router.get('/flair', getFlairs)
router.get('/verify', verifyAuth)
router.post('/logout', logout)



//router.get('/users/:id', getUser);  
//router.put('/users/:id', updateUser);


export default router;




