import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Header from "../Header";
import {Sidebar} from "../Sidebar";
import Footer from "../Footer";
import ErrorBoundary from "../ErrorBoundary";

function App({ page }) {
    const location = useRouter();
    const [currentPath, setCurrentPath] = useState(location.pathname);
    // let sidebarClasses = "";
    useEffect(() => {
        setCurrentPath(location.pathname);
        console.log(currentPath);
    }, [location]);
    
    return (
        <div className="es-content__wrapper">
            <Sidebar />
            <div className="es-content">
                    {(currentPath === "/") ? page : 
                        <>
                            <Header />
                            <main className="es-mainContent">
                                {/* <ErrorBoundary> */}
                                    {page}
                                {/* </ErrorBoundary> */}
                            </main>
                            <Footer />
                        </>
                    }
            </div>
        </div>
    );
}

export default App;
