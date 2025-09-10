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
}

const SearchItem = ({club = "", school = "", id = "", uniName = "", onSelect = () => {},onSelecttwo = () => {},type}: props) => {
    const navigate = useNavigate();

    if (type === 0) {
        return (
            <div className="SearchItem" onClick={() => navigate(`/club/${id}`)}>
                <h1>{club}</h1>
                <h2>@ {school}</h2>
            </div>
        );
    } else if (type === 1) {
        return (
            <>
            {uniName? (<div className="SearchItem" onClick={() => {
                onSelect(uniName)
                onSelecttwo(['clubs', 'flairs'])

            }}>
                <h1>{uniName}</h1>
            </div>): null}
            </>
        );
    }

    return null;
}

export default SearchItem