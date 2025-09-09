import { AuthRequest } from "../middleware/auth";
import verifyToken from "../middleware/auth";
import { Router, Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import { RowDataPacket } from 'mysql2';
import { pool } from '../server';
import jwt from 'jsonwebtoken';








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
    const { userId, clubName, clubDesc, school, instagram, linkTree } = req.body;
    console.log("hi")


    console.log('Received:', { userId, clubName, clubDesc, school, instagram, linkTree });

    try {

        if (!instagram && !linkTree) {
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
        else if (linkTree) {
            const username = await getUsernameFromId(userId);
            console.log(username)

            const [clubresult] = await pool.execute<ResultSetHeader>(
                'INSERT INTO clubs (clubName, clubDesc, School, leader, leaderName, linktree) VALUES (?, ?, ?, ?, ?, ?)',
                [clubName, clubDesc, school, userId, username, linkTree]
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
        else if (instagram) {
            const username = await getUsernameFromId(userId);
            console.log(username)

            const [clubresult] = await pool.execute<ResultSetHeader>(
                'INSERT INTO clubs (clubName, clubDesc, School, leader, leaderName, instagram) VALUES (?, ?, ?, ?, ?)',
                [clubName, clubDesc, school, userId, username, instagram]
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
    let clubId = req.params.clubId;
    const { userId } = req.query;




    console.log("getClub Received:", { clubId, userId })


    try {
        console.log("trying")

        if (userId) {

            const [clubresult] = await pool.execute<RowDataPacket[]>('SELECT primaryFlair,clubName, clubDesc, School, leader, leaderName, created_at, camaraderie, ascendancy, prestige, obligation, legacy, total, instagram, linktree FROM clubs WHERE club_id = ?', [clubId])
            const [flairresult] = await pool.execute<RowDataPacket[]>('SELECT flairName FROM clubFlair WHERE club_id = ?', [clubId])


            if (clubresult.length !== 0) {
                console.log(clubresult[0].leaderName)

                const [role] = await pool.execute<RowDataPacket[]>('SELECT clubRole FROM clubMember WHERE club_id = ? AND users_id = ?', [clubId, userId])
                const [ratings] = await pool.execute<RowDataPacket[]>('SELECT * FROM rating WHERE users_id = ? AND club_id = ?', [userId, clubId])

                const leader_id = clubresult[0].leader

                const primaryFlair = clubresult[0].primaryFlair

                const otherFlairs = flairresult.map(flair => flair.flairName).filter(flairName => flairName !== primaryFlair)




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
                        primaryFlair: primaryFlair,
                        flairs: otherFlairs,




                    })


                } else {
                    console.log('case 2')
                    res.json({

                        success: true,
                        clubRole: "Not a Member!",
                        hasRated: hasRated,
                        clubData: clubresult[0],
                        flairs: otherFlairs,
                        primaryFlair: primaryFlair


                    })
                }


            } else {
                res.json({
                    success: false,
                    error: "clubData not found"
                })
            }

        }
        else if (clubId !== '""') {
            console.log("this one")

            const [clubresult] = await pool.execute<RowDataPacket[]>('SELECT clubName, clubDesc, School, leader, leaderName, created_at, camaraderie, ascendancy, prestige, obligation, legacy, total, instagram, linktree FROM clubs WHERE club_id = ?', [clubId])
            const [flairresult] = await pool.execute<RowDataPacket[]>('SELECT flairName FROM clubFlair WHERE club_id = ?', [clubId])

            const primaryFlair = clubresult[0].primaryFlair

            const otherFlairs = flairresult.map(flair => flair.flairName).filter(flairName => flairName !== primaryFlair)

            if (clubresult.length !== 0) {
                console.log(clubresult[0].leaderName)
                console.log('case 3')
                res.json({
                    success: true,
                    clubData: clubresult[0],
                    flairs: otherFlairs,
                    primaryFlair: primaryFlair

                })
            }


        }
        else {
            console.log("case ???")

            const [allClubs] = await pool.execute<RowDataPacket[]>('SELECT clubName, club_id, School FROM clubs')
            if (allClubs) {
                res.json({
                    success: true,
                    clubData: allClubs,
                })
            } else {
                res.json({
                    success: false,
                    error: "clubData not found"
                })

            }
        }

    }
    catch (err) {
        res.json({
            success: false,
            error: err

        })
    }
}

async function geteditClub(req: AuthRequest, res: Response) {
    const clubID = req.params.clubId;
    console.log("EditClub Received", { clubID });


    try {
        const [clubRows] = await pool.execute<RowDataPacket[]>('SELECT * FROM clubs WHERE club_id = ?', [clubID]);


        if (clubRows.length === 0) {
            return res.json({
                success: false,
                error: "Could not find club to edit"
            });
        }


        const [flairRows] = await pool.execute<RowDataPacket[]>('SELECT * FROM clubFlair WHERE club_id = ?', [clubID])

        const primaryFlair = clubRows[0].primaryFlair

        const otherFlairs = flairRows.map(flair => flair.flairName).filter(flairName => flairName !== primaryFlair)




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
            ...(memberData && { memberData }),
            ...(flairRows && { otherFlairs })
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
    const { clubID, name, description, founded, instagram, linktree } = req.body;
    console.log("editclubfr received:", { clubID, name, description, founded })
    try {
        const [editrows] = await pool.execute<ResultSetHeader>(
            'UPDATE clubs SET clubName = ?, clubDesc = ?, created_at = ?, instagram = ?, linktree = ? WHERE club_id = ?',
            [name, description, founded, instagram, linktree, clubID]
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


async function addFlair(req: AuthRequest, res: Response) {
    const { Flair, ClubID } = req.body;
    console.log("hi")


    console.log('Received:', { Flair, ClubID });

    try {

        const [count] = await pool.execute<RowDataPacket[]>('SELECT * FROM clubFlair WHERE club_id = ?', [ClubID])



        if (count.length < 5) {

            if (count.length === 0) {
                const [primary] = await pool.execute<ResultSetHeader>(
                    'UPDATE clubs SET primaryFlair = ? WHERE club_id = ?',
                    [Flair, ClubID]
                );
            }

            const [flairresult] = await pool.execute<ResultSetHeader>(
                'INSERT INTO clubFlair (club_id, flairName) VALUES (?, ?)',
                [ClubID, Flair]
            );

            if (flairresult) {
                res.json({
                    success: true,
                    result: flairresult.insertId

                })
            }
            else {
                res.json({
                    success: false,
                    error: "Couldn't add flairs"
                })

            }
        }
        else {
            res.json({
                success: false,
                error: "too many flairs"
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
async function deleteFlair(req: AuthRequest, res: Response) {
    const Flair = req.params.Flair;
    const ClubID = req.params.ClubID;
    console.log('Received:', { Flair, ClubID });

    try {
        let primresult: ResultSetHeader = {} as ResultSetHeader;

        const [primary] = await pool.execute<RowDataPacket[]>('SELECT primaryFlair FROM clubs WHERE club_id = ?', [ClubID]);

        if (primary[0].primaryFlair === Flair) {
            console.log("Deleting Primary...");
            const [result] = await pool.execute<ResultSetHeader>(
                'UPDATE clubs SET primaryFlair = "" WHERE club_id = ?',
                [ClubID]
            );
            console.log("Deleted Primary.");
            primresult = result;
        }

        const [flairresult] = await pool.execute<ResultSetHeader>(
            'DELETE FROM clubFlair WHERE flairName = ? AND club_id = ?',
            [Flair, ClubID]
        );


        if (primresult.affectedRows !== 0) {
            const [newPrimary] = await pool.execute<RowDataPacket[]>('SELECT * FROM clubFlair WHERE club_id = ?', [ClubID]);
            if (newPrimary.length > 0) {
                console.log("Adding new Primary");
                await pool.execute<ResultSetHeader>('UPDATE clubs SET primaryFlair = ? WHERE club_id = ?', [newPrimary[0].flairName, ClubID]);
            }
        }


        return res.json({ success: true, result: flairresult.affectedRows });

    } catch (err) {
        console.log(err);
        if (!res.headersSent) {
            return res.status(500).json({ success: false, error: err });
        }
    }
}


async function getClubByFlair(req: Request, res: Response) {
    const flairName = req.params.flairName;
    console.log("getClubByFlair Received:", { flairName })

    try {
        const [flairIds] = await pool.execute<RowDataPacket[]>(
            'SELECT club_id FROM clubFlair WHERE flairName = ?',
            [flairName]
        );





        if (flairIds.length === 0) {
            return res.json({
                success: false,
                error: "No clubs found for this flair",
                errorCode: 404
            });
        }
        else {
            const clubIds = flairIds.map(row => row.club_id);

            const placeholders = clubIds.map(() => '?').join(',');

            const [sortables] = await pool.execute<RowDataPacket[]>(`SELECT School, leaderName, clubName, clubDesc, club_id FROM clubs WHERE club_id IN (${placeholders})  ORDER BY total DESC
   LIMIT 20` , clubIds);
            res.json({
                success: true,
                clubName: sortables.map(club => club.clubName),
                School: sortables.map(club => club.School),
                leaderName: sortables.map(club => club.leaderName),
                clubDesc: sortables.map(club => club.clubDesc),
                club_id: sortables.map(club => club.club_id),
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: "Error fetching clubs by flair",
            errorCode: 500
        });
    }
}



async function changePrimary(req: AuthRequest, res: Response) {
    const { newPrimary, clubID } = req.body;
    console.log({ newPrimary, clubID })
    try {

        const [updateCurrentPrimary] = await pool.execute<ResultSetHeader>('UPDATE clubs SET primaryFlair = ? WHERE club_id = ?', [newPrimary, clubID]);

        if (updateCurrentPrimary.affectedRows != 0) {
            res.json({
                success: true
            })

        }
        else {
            res.json({
                success: false,
                error: "didn't update primary"
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


router.post('/club', verifyToken, createClub);
router.get('/club/:clubId', getClub);
router.get('/editclub/:clubId', verifyToken, geteditClub)
router.put('/role', verifyToken, editRole)
router.put('/club', verifyToken, editclub)
router.post('/flair', verifyToken, addFlair)
router.delete('/flair/:Flair/:ClubID', verifyToken, deleteFlair)
router.get('/sort/:flairName', getClubByFlair);
router.put('/flair', verifyToken, changePrimary)




export default router;


