import React, { useState, useEffect } from "react";
import Link from 'next/link'
import { useRouter } from 'next/router'
import variant404Image1 from "../../../public/404_1.png";
import variant404Image2 from "../../../public/404_2.png";
import variant404Image3 from "../../../public/404_3.png";
// import "./NoMatch.module.scss";

function NoMatch() {
    console.log(variant404Image1)
    const location = useRouter();
    const [random404message, setRandom404message] = useState({
        text: "",
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
                text: "Damnit, I can't find the page you're looking for…",
                image: variant404Image1,
            });
        }
    }, [location]);

    return (
        <div className="es-404__wrapper">
            <div className="es-404__content">
                <h1>{random404message.text}</h1>
                <Link href="/">
                    <a>
                    Back to Home
                    </a>
                </Link>
            </div>
            <div
                className="es-404__image"
                style={{
                    "--es-splash-image": `url("${random404message.image.src}")`,
                    "--es-splash-image--blur": `url("${random404message.image.blurDataURL}")`,
                }}
            />
        </div>
    );
}

export default NoMatch;
