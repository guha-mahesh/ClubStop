import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface props{
    type: number;
     club?: string;
     school?: string;
     id?: string;   
     uniName?: string;

    }



const SearchItem = ({club ="", school ="", id = "", uniName = "",type}: props) => {
    const [situation, setSituation] = useState<JSX.Element | null>(null);

    useEffect(()=>{ setSituation(map[type]);},[])
const navigate = useNavigate();



const situation1 = 
(<div className = "SearchItem" onClick = {()=>navigate(`/club/${id}`)}>
        <h1>{club}</h1>
        <h2>@ {school}</h2>

    </div>)


const situation2 = 
(<div className = "SearchItem" onClick = {()=>navigate(`/club/${id}`)}>
        <h1>{uniName}</h1>

    </div>)

const map: Record<number, JSX.Element> = {0 : situation1,1 : situation2}



    
  return situation
}

export default SearchItem