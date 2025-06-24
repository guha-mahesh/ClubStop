import { pool } from '../server';
import { AuthRequest } from "../middleware/auth";
import verifyToken from "../middleware/auth";
import { Router, Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import { RowDataPacket } from 'mysql2';




const router = Router();
async function getRating(req: Request, res: Response) {
    const userId = req.params.userId;
    const clubId = req.params.clubId;
    console.log("Received getRating:", { userId, clubId })
    try {
        const [ratingRows] = await pool.execute<RowDataPacket[]>('SELECT * FROM rating WHERE club_id = ? AND users_id = ?', [clubId, userId])

        if (ratingRows.length !== 0) {
            console.log("heheheha")
            res.json({
                success: true,
                rating: ratingRows[0]
            })
        } else {

            res.json({
                success: false,
                error: "No reviews with this club and user"
            })
        }



    } catch (err) {
        console.log(err)
        res.json({
            sucess: false,
            error: err
        })
    }



}


async function rateClub(req: AuthRequest, res: Response) {
    const { userId, clubId, ascendancy,
        camaraderie,
        legacy,
        prestige,
        obligation,
        total, review } = req.body;

    console.log("received:", { userId, clubId, ascendancy, camaraderie, legacy, prestige, obligation, total, review })

    try {
        const [rating] = await pool.execute<ResultSetHeader>(
            'INSERT INTO rating (users_id, club_id, ascendancy, camaraderie, legacy, prestige, obligation, total, review) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, clubId, ascendancy, camaraderie, legacy, prestige, obligation, total, review]
        )

        if (rating) {

            const [averages] = await pool.execute<RowDataPacket[]>(
                `SELECT 
        AVG(ascendancy) AS ascendancy, 
        AVG(camaraderie) AS camaraderie, 
        AVG(legacy) AS legacy, 
        AVG(prestige) AS prestige, 
        AVG(obligation) AS obligation,
        AVG(total) AS total
      FROM rating
      WHERE club_id = ?`,
                [clubId]
            );

            const avg = averages[0];

            await pool.execute(
                `UPDATE clubs SET 
        ascendancy = ?, 
        camaraderie = ?, 
        legacy = ?, 
        prestige = ?, 
        obligation = ?, 
        total = ?
      WHERE club_id = ?`,
                [avg.ascendancy, avg.camaraderie, avg.legacy, avg.prestige, avg.obligation, avg.total, clubId]
            );




            res.json({
                success: true,
                id: rating.insertId
            })

        }
        else {
            res.json({
                success: false,
                error: "Rating did not go through"
            })
        }


    }
    catch (err) {
        console.log(err)
        res.json({
            success: false,
            error: "Rating did not go through", err
        })

    }

}


async function editRating(req: AuthRequest, res: Response) {
    const { userId, clubId, ascendancy,
        camaraderie,
        legacy,
        prestige,
        obligation,
        total, review } = req.body;

    console.log("received:", { userId, clubId, ascendancy, camaraderie, legacy, prestige, obligation, total, review })

    const [editedRows] = await pool.execute<ResultSetHeader>('UPDATE rating SET camaraderie=?, ascendancy=?, prestige=?, obligation=?, legacy=?, total=?, review=? WHERE users_id=? AND club_id=?',
        [camaraderie, ascendancy, prestige, obligation, legacy, total, review, userId, clubId])

    if (editedRows) {
        const [averages] = await pool.execute<RowDataPacket[]>(
            `SELECT 
        AVG(ascendancy) AS ascendancy, 
        AVG(camaraderie) AS camaraderie, 
        AVG(legacy) AS legacy, 
        AVG(prestige) AS prestige, 
        AVG(obligation) AS obligation,
        AVG(total) AS total
      FROM rating
      WHERE club_id = ?`,
            [clubId]
        );
        const avg = averages[0];

        await pool.execute(
            `UPDATE clubs SET 
        ascendancy = ?, 
        camaraderie = ?, 
        legacy = ?, 
        prestige = ?, 
        obligation = ?, 
        total = ?
      WHERE club_id = ?`,
            [avg.ascendancy, avg.camaraderie, avg.legacy, avg.prestige, avg.obligation, avg.total, clubId]
        );

        res.json({
            success: true
        })

    }
    else {
        res.json({
            success: false,
            error: "Could not update rows"
        })
    }




}


async function deleteRate(req: AuthRequest, res: Response) {
    const userId = req.params.userId
    const clubId = req.params.clubId
    console.log("Received Delete:", { userId, clubId })

    try {
        const [deleted] = await pool.execute<ResultSetHeader>('DELETE FROM rating WHERE users_id = ? AND club_id = ?', [userId, clubId])

        if (deleted) {
            res.json({
                success: true
            })
        }
        else {
            res.json({
                success: false,
                error: "Could not delete rating"
            })
        }

    } catch (err) {
        console.log(err)

    }

}





router.get('/rate/:clubId/:userId', verifyToken, getRating)
router.post('/rate', verifyToken, rateClub);
router.put('/rate', verifyToken, editRating);
router.delete('/rate/:clubId/:userId', verifyToken, deleteRate)




export default router;