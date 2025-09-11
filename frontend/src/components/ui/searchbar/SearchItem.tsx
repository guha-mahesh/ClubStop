import React from 'react'
import { useNavigate } from 'react-router-dom';

interface props{
    onSelect?: (e: string) => void;
    onSelecttwo?: (e: string[])=> void;

    type: number;
    club?: string;
    school?: string;
    id?: string;   
    uniName?: string;
    flairName?: string
}

const SearchItem = ({club = "", school = "", id = "", uniName = "", flairName = "", onSelect = () => {},onSelecttwo = () => {},type}: props) => {
    const navigate = useNavigate();

    if (type === 0) {
        return (
            <div className="SearchItem searchClub" onClick={() => navigate(`/club/${id}`)}>
                <h1>{club}</h1>
                <h2>@ {school}</h2>
            </div>
        );
    } else if (type === 1) {
        return (
            <>
            {uniName? (<div className="SearchItem searchUni" onClick={() => {
                onSelect(uniName)
                onSelecttwo(['clubs', 'flairs'])

            }}>
                <h1>{uniName}</h1>
            </div>): null}
            </>
        );
    }
    else{
        return(
            <div className="SearchItem searchFlair" onClick={() => navigate(`/sortFlair/${school}/${flairName}`)}>

                <h1>{flairName}</h1>
            </div>
        )
    }

    return null;
}

export default SearchItem