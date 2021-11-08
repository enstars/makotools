import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import variant404Image1 from "../../assets/404_1.png";
import variant404Image2 from "../../assets/404_2.png";
import variant404Image3 from "../../assets/404_3.png";
import "./NoMatch.scss";

function NoMatch() {
    const location = useLocation();
    const [random404message, setRandom404message] = useState({
        text: "Damnit, I can't find the page you're looking for…",
        image: variant404Image1,
    });

    useEffect(() => {
        const variant404 = Math.floor(Math.random() * 4);
        switch (variant404) {
        case 1:
            setRandom404message({
                text: "Damnit, I can't find the page you're looking for…",
                image: variant404Image1,
            });
            break;
        case 2:
            setRandom404message({
                text: "No, this is no use… I can't find any inspiration!",
                image: variant404Image2,
            });
            break;
        case 3:
            setRandom404message({
                text: "W-what do you mean there's no page at this address?!",
                image: variant404Image3,
            });
            break;
        default:
            setRandom404message({
                text: "Damnit, I can't find the page you're looking for...",
                image: variant404Image1,
            });
        }
    }, [location]);

    return (
        <div className="es-404__wrapper">
            <div className="es-404__content">
                <h1>{random404message.text}</h1>
                <NavLink to="/">Back to Home</NavLink>
            </div>
            <div
                className="es-404__image"
                style={{
                    backgroundImage: `linear-gradient(to bottom, transparent 40%, hsla(0, 0%, 0%, 0.8) 100%), url('${random404message.image}'), linear-gradient(#2a2c8e, #2a2c8e)`,
                }}
            />
        </div>
    );
}

export default NoMatch;
