import { useEffect, useState } from 'react' 
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContexts'
import { useParams } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';

import React from 'react'

const ViewYourReview = () => {
    interface review{
        ascendancy: string;
        camaraderie: string;
        prestige: string;
        legacy: string;
        obligation: string;
        total: string;
        review: string;
    }

    const navigate = useNavigate();
    const {user, isAuthenticated, loading} = useAuth();
    const [rating, setRating] = useState<review | null>(null);
    const [editAscendancy, setEditAscendancy] = useState<string>("");
    const [editCamaraderie, setEditCamaraderie] = useState<string>("");
    const [editPrestige, setEditPrestige] = useState<string>("");
    const [editLegacy, setEditLegacy] = useState<string>("");
    const [editObligation, setEditObligation] = useState<string>("");
    const [editTotal, setEditTotal] = useState<string>("");
    const [editReview, setEditReview] = useState<string>("");
    const { clubID } = useParams<{ clubID: string }>();
    const [error, setError] = useState("")
    const [edit, setEdit] = useState(false);

    useEffect(()=>{
        if (!loading && !isAuthenticated){
            navigate("/")
        }
    }, [loading, isAuthenticated, navigate])


    useEffect(() => {
  if (!edit && rating) {
    setEditTotal(rating.total);
    setEditAscendancy(rating.ascendancy);
    setEditCamaraderie(rating.camaraderie);
    setEditObligation(rating.obligation);
    setEditPrestige(rating.prestige);
    setEditLegacy(rating.legacy);
    setEditReview(rating.review)
  } else {
    const total = (
      (
        (parseFloat(editAscendancy) +
          parseFloat(editCamaraderie) +
          parseFloat(editLegacy) +
          parseFloat(editPrestige) +
          parseFloat(editObligation)) /
        5
      ).toFixed(1)
    );

    if (total !== editTotal.toString()) {
      setEditTotal(total);
    }
  }
}, [
  edit,
  rating,
  editAscendancy,
  editCamaraderie,
  editObligation,
  editPrestige,
  editLegacy,
  editTotal, 
]);

    useEffect(()=>{

        const token = localStorage.getItem('authToken')
        const fetchReview = async () => {
            if (user){
                try{
                    const response = await fetch(`${backendUrl}/api/rate/${clubID}/${user.id}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json', },
                        credentials: 'include',
                    });

                    const data = await response.json();

                    if (data.success){
                        setRating(data.rating)
                    }
                    else{
                        setError(data.error)
                    }
                }catch (err){
                    console.log(err)
                }
            }
        }
        fetchReview();
    }, [user])


    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) =>{

       
        e.preventDefault();
        console.log("hey")
        
        const token = localStorage.getItem('authToken')
        if (user){
         const response = await fetch(`${backendUrl}/api/rate`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    
  },
  credentials: 'include',
  body: JSON.stringify({
    userId: user.id,
    clubId: clubID,
    ascendancy: parseFloat(editAscendancy),
    camaraderie: parseFloat(editCamaraderie),
    legacy: parseFloat(editLegacy),
    prestige: parseFloat(editPrestige),
    obligation: parseFloat(editObligation),
    review: editReview,
    total: editTotal,
  }),
});

    const data = await response.json();
    if (data.success){
        setRating({
  ascendancy: editAscendancy,
  camaraderie: editCamaraderie,
  prestige: editPrestige,
  legacy: editLegacy,
  obligation: editObligation,
  total: editTotal,
  review: editReview
});

setEdit(false)
window.location.reload();


    }
    else{
        console.log(data.error)
    }


        }


    }

    const handleDelete = async ()=>{
        const token = localStorage.getItem("authToken");
        if (user){
const response = await fetch(`${backendUrl}/api/rate/${clubID}/${user.id}`, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    
  },
  credentials: 'include',
});

    const data = await response.json();
    if (data.success){
        console.log("yipee")
        setRating(null)

    }
    else{
        console.log(data.error)
    }


        }
    }




    return (
        <>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        
            {rating ? (
  !edit ? (
    <div className="rating-form">
      <form className="rating-form-body">
        <div className="rating-input-group">
          <label htmlFor="camaraderie" className="rating-label">
            Camaraderie
          </label>
          <input
            id="camaraderie"
            className="rating-slider"
            type="range"
            min="1"
            max="100"
            value={rating.camaraderie}
            disabled
          />
          <input
            className="rating-number"
            type="number"
            min="1"
            max="100"
            value={rating.camaraderie}
            disabled
          />
        </div>

        <div className="rating-input-group">
          <label htmlFor="ascendancy" className="rating-label">
            Ascendancy
          </label>
          <input
            id="ascendancy"
            className="rating-slider"
            type="range"
            min="1"
            max="100"
            value={rating.ascendancy}
            disabled
          />
          <input
            className="rating-number"
            type="number"
            min="1"
            max="100"
            value={rating.ascendancy}
            disabled
          />
        </div>

        <div className="rating-input-group">
          <label htmlFor="prestige" className="rating-label">
            Prestige
          </label>
          <input
            id="prestige"
            className="rating-slider"
            type="range"
            min="1"
            max="100"
            value={rating.prestige}
            disabled
          />
          <input
            className="rating-number"
            type="number"
            min="1"
            max="100"
            value={rating.prestige}
            disabled
          />
        </div>

        <div className="rating-input-group">
          <label htmlFor="obligation" className="rating-label">
            Obligation
          </label>
          <input
            id="obligation"
            className="rating-slider"
            type="range"
            min="1"
            max="100"
            value={rating.obligation}
            disabled
          />
          <input
            className="rating-number"
            type="number"
            min="1"
            max="100"
            value={rating.obligation}
            disabled
          />
        </div>

        <div className="rating-input-group">
          <label htmlFor="legacy" className="rating-label">
            Legacy
          </label>
          <input
            id="legacy"
            className="rating-slider"
            type="range"
            min="1"
            max="100"
            value={rating.legacy}
            disabled
          />
          <input
            className="rating-number"
            type="number"
            min="1"
            max="100"
            value={rating.legacy}
            disabled
          />
        </div>

        <div className="rating-input-group">
          <label htmlFor="review" className="rating-label">
            Review Here
          </label>
          <textarea
            id="review"
            value={rating.review !== "" ? rating.review : "No review"}
            disabled
          />
        </div>

        <div className="rating-input-group">
          <label className="rating-label">Total</label>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>{rating.total}</div>
        </div>
      </form>
      <button onClick = {()=>setEdit(true)}>Edit?</button>
      <button onClick = {()=>handleDelete()}>Delete Review?</button>
    </div>
  ) : (<div className="rating-form">
      <form className="rating-form-body" onSubmit = {handleEdit}>
        <div className="rating-input-group">
          <label htmlFor="camaraderie" className="rating-label">
            Camaraderie
          </label>
          <input
            id="camaraderie"
            className="rating-slider"
            type="range"
            min="1"
            max="100"
            value={editCamaraderie}
            onChange={(e) => setEditCamaraderie(e.target.value)}
          />
          <input
            className="rating-number"
            type="number"
            min="1"
            max="100"
            value={editCamaraderie}
            onChange={(e) => setEditCamaraderie(e.target.value)}
          />
        </div>

        <div className="rating-input-group">
          <label htmlFor="ascendancy" className="rating-label">
            Ascendancy
          </label>
          <input
            id="ascendancy"
            className="rating-slider"
            type="range"
            min="1"
            max="100"
            value={editAscendancy}
            onChange={(e) => setEditAscendancy(e.target.value)}
          />
          <input
            className="rating-number"
            type="number"
            min="1"
            max="100"
            value={editAscendancy}
            onChange={(e) => setEditAscendancy(e.target.value)}
          />
        </div>

        <div className="rating-input-group">
          <label htmlFor="prestige" className="rating-label">
            Prestige
          </label>
          <input
            id="prestige"
            className="rating-slider"
            type="range"
            min="1"
            max="100"
            value={editPrestige}
            onChange={(e) => setEditPrestige(e.target.value)}
          />
          <input
            className="rating-number"
            type="number"
            min="1"
            max="100"
            value={editPrestige}
            onChange={(e) => setEditPrestige(e.target.value)}
          />
        </div>

        <div className="rating-input-group">
          <label htmlFor="obligation" className="rating-label">
            Obligation
          </label>
          <input
            id="obligation"
            className="rating-slider"
            type="range"
            min="1"
            max="100"
            value={editObligation}
            onChange={(e) => setEditObligation(e.target.value)}
          />
          <input
            className="rating-number"
            type="number"
            min="1"
            max="100"
            value={editObligation}
            onChange={(e) => setEditObligation(e.target.value)}
          />
        </div>

        <div className="rating-input-group">
          <label htmlFor="legacy" className="rating-label">
            Legacy
          </label>
          <input
            id="legacy"
            className="rating-slider"
            type="range"
            min="1"
            max="100"
            value={editLegacy}
            onChange={(e) => setEditLegacy(e.target.value)}
          />
          <input
            className="rating-number"
            type="number"
            min="1"
            max="100"
            value={editLegacy}
            onChange={(e) => setEditLegacy(e.target.value)}
          />
        </div>

        <div className="rating-input-group">
          <label htmlFor="review" className="rating-label">
            Review Here
          </label>
          <textarea
  id="review"
  value={editReview}
  onChange={(e) => setEditReview(e.target.value)}
/>
        </div>

        <div className="rating-input-group">
          <label className="rating-label">Total</label>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>{editTotal}</div>
        </div>
        <button>Save Changes</button>
      </form>
      
    </div>)
    



    
) : (<div>
  <div style={{ visibility: "hidden" }}>Placeholder</div>
  <div>No Reviews as of Yet</div>
  </div>
)}

        </>
    );
}

export default ViewYourReview