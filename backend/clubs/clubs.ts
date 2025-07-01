import { AuthRequest } from "../middleware/auth";
import verifyToken from "../middleware/auth";
import { Router, Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import { RowDataPacket } from 'mysql2';
import { pool } from '../server';
import jwt from 'jsonwebtoken';
import { errorMonitor } from "node:events";




const router = Router();




async function getUsernameFromId(id: string) {
    try {
        const [rows] = await pool.execute(
            'SELECT username FROM users WHERE users_id = ?',
            [id]
        ) as [RowDataPacket[], any];

        if (rows.length === 0) {
            return null;
        }

        return rows[0].username;

    } catch (error) {
        console.error("Couldn't find User :", error);
        return null;
    }
}

async function createClub(req: AuthRequest, res: Response) {
    const { userId, clubName, clubDesc, school } = req.body;
    console.log("hi")


    console.log('Received:', { userId, clubName, clubDesc, school });

    try {
        const username = await getUsernameFromId(userId);
        console.log(username)

        const [clubresult] = await pool.execute<ResultSetHeader>(
            'INSERT INTO clubs (clubName, clubDesc, School, leader, leaderName) VALUES (?, ?, ?, ?, ?)',
            [clubName, clubDesc, school, userId, username]
        );

        if (clubresult) {

            const [userresult] = await pool.execute<ResultSetHeader>('INSERT INTO clubMember (users_id, club_id, clubRole) VALUES (?,?,?)', [userId, clubresult.insertId, 'Leader'])
            if (userresult) {
                res.json({
                    success: true,
                    clubId: clubresult.insertId,
                })

            }
            else {
                console.log("failed to insert userResult")
                res.json({
                    success: false,
                    error: "couldn't handle users club creation"
                })
            }

        }
        else {
            res.json({
                success: false,
                error: "Couldn't create Club"
            })
        }

    }
    catch (err) {
        console.log(err)
        res.json({
            success: false,
            error: "some error with api, i don't know", err
        })

    }

}


async function getClub(req: Request, res: Response) {
    const clubId = req.params.clubId;
    const { userId } = req.query;


    console.log("Received:", { clubId, userId })


    try {

        if (userId) {
            const [clubresult] = await pool.execute<RowDataPacket[]>('SELECT clubName, clubDesc, School, leader, leaderName, created_at, camaraderie, ascendancy, prestige, obligation, legacy, total FROM clubs WHERE club_id = ?', [clubId])



            if (clubresult.length !== 0) {
                console.log(clubresult[0].leaderName)

                const [role] = await pool.execute<RowDataPacket[]>('SELECT clubRole FROM clubMember WHERE club_id = ? AND users_id = ?', [clubId, userId])
                const [ratings] = await pool.execute<RowDataPacket[]>('SELECT * FROM rating WHERE users_id = ? AND club_id = ?', [userId, clubId])

                const leader_id = clubresult[0].leader




                let hasRated = false;
                if (ratings.length !== 0) {
                    hasRated = true;

                } else {
                    hasRated = false;
                }

                if (role.length !== 0) {
                    console.log('case 1')

                    res.json({
                        success: true,
                        clubRole: role[0].clubRole,
                        clubData: clubresult[0],
                        hasRated: hasRated,



                    })


                } else {
                    console.log('case 2')
                    res.json({

                        success: true,
                        clubRole: "Not a Member!",
                        hasRated: hasRated,
                        clubData: clubresult[0],


                    })
                }


            } else {
                res.json({
                    success: false,
                    error: "clubData not found"
                })
            }

        }
        else if (clubId) {

            const [clubresult] = await pool.execute<RowDataPacket[]>('SELECT clubName, clubDesc, School, leader, leaderName, created_at, camaraderie, ascendancy, prestige, obligation, legacy, total FROM clubs WHERE club_id = ?', [clubId])


            if (clubresult.length !== 0) {
                console.log(clubresult[0].leaderName)
                console.log('case 3')
                res.json({
                    success: true,
                    clubData: clubresult[0],

                })
            }
            else {
                res.json({
                    success: false,
                    error: 'club not found'
                })
            }

        }
        else {
            res.json({
                success: false,
                error: "clubId not existent"
            })
        }
    }
    catch (err) {
        res.json({
            success: false,
            error: errorMonitor

        })
    }
}

async function geteditClub(req: AuthRequest, res: Response) {
    const clubID = req.params.clubId;
    console.log("EditClub Received", { clubID });


    try {
        const [clubRows] = await pool.execute<RowDataPacket[]>('SELECT * FROM clubs WHERE club_id = ?', [1]);
        console.log(clubRows)

        if (clubRows.length === 0) {
            return res.json({
                success: false,
                error: "Could not find club to edit"
            });
        }

        const [memberRows] = await pool.execute<RowDataPacket[]>(
            'SELECT users_id, clubRole FROM clubMember WHERE club_id = ?',
            [clubID]
        );

        let memberData = undefined;

        if (memberRows.length > 0) {
            const userIds = memberRows.map(row => row.users_id);
            const placeholders = userIds.map(() => '?').join(',');

            const [usernames] = await pool.execute<RowDataPacket[]>(
                `SELECT users_id, username FROM users WHERE users_id IN (${placeholders})`,
                userIds
            );

            const userIdToName = new Map(usernames.map(u => [u.users_id, u.username]));

            memberData = memberRows.map(row => ({
                ...row,
                username: userIdToName.get(row.users_id) || null
            }));
        }

        return res.json({
            success: true,
            clubData: clubRows[0],
            ...(memberData && { memberData })
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
}







async function editRole(req: AuthRequest, res: Response) {
    const { clubID, userID, memberRole } = req.body;
    console.log("editrole Received", { clubID, userID, memberRole })

    try {
        const [editrows] = await pool.execute<ResultSetHeader>('UPDATE clubMember SET clubRole = ? WHERE users_id = ? AND club_id = ?', [memberRole, userID, clubID])

        if (editrows) {
            res.json({
                success: true,

            })
        } else {
            res.json({
                success: false,
                error: "could not find role to edit most likely"
            })
        }

    } catch (err) {
        console.log(err)
    }



}

async function editclub(req: AuthRequest, res: Response) {
    const { clubID, name, description, founded } = req.body;
    console.log("editclubfr received:", { clubID, name, description, founded })
    try {
        const [editrows] = await pool.execute<ResultSetHeader>(
            'UPDATE clubs SET clubName = ?, clubDesc = ?, created_at = ? WHERE club_id = ?',
            [name, description, founded, clubID]
        );
        if (editrows) {
            res.json({
                success: true,
            })
        } else {
            res.json({
                success: false,
                error: "Could not edit club, club probably missing"
            })
        }

    } catch (err) {
        console.log(err)

    }

}




router.post('/club', verifyToken, createClub);
router.get('/club/:clubId', getClub);
router.get('/editclub/:clubId', verifyToken, geteditClub)
router.put('/role', verifyToken, editRole)
router.put('/club', verifyToken, editclub)




export default router;


