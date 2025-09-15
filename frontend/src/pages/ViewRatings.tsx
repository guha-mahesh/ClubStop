import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';
import Review from "../components/Review";


interface rating{
    username: string;
    users_id: string;
    ascendancy: number;
    camaraderie: number;
    prestige: number;
    obligation: number;
    legacy: number;
    total: number;
    review: string;
    profilePic: string | null;
    created_at: string;

}


const ViewRatings = () => {
    const {clubID, clubName} = useParams();
    const [ noClub, setNoClub] = useState(false);
    const [ratings, setRatings] = useState<rating[]| null>(null);

    useEffect(()=>{
        console.log(ratings);
    }, [ratings])
    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const results = await fetch(`${backendUrl}/api/ratings/${clubID}`, {

                    method: 'GET',
                    headers: { 
                      'Content-Type': 'application/json', 
                    },
                });
                const data = await results.json();
                if(data.success){

                    setRatings(data.ratings);  
                }
                else if (data.error === "No ratings for this club"){
                    
                    setNoClub(true);
                    console.log("No ratings for this club");
                    
                    
                }
                else{
                    console.log(data.error);
                }




            }catch(err){
                console.log(err);


            }
        
        
        
        
        }
        fetchRatings();
    
    },[])

  return (
    <div>
  {ratings && ratings.map((r, idx) => (
    <div key={idx}>
        <Review
            Review={r.review}
            User={r.username}
            userId={r.users_id}
            created_at={new Date(r.created_at).toLocaleDateString()} 
            ascendancy={r.ascendancy}
            camaraderie={r.camaraderie}
            prestige={r.prestige}
            obligation={r.obligation}
            legacy={r.legacy}
            total={r.total}
            profilePic={r.profilePic}
            clubName={clubName}
            clubId={clubID}
            
        />



    </div>
  ))}
</div>









  )
}

export default ViewRatings