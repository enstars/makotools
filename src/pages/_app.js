// import App from 'next/app'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { StyledEngineProvider } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import ErrorBoundary from "../components/ErrorBoundary";

import "normalize.css/normalize.css";
import "../styles/index.scss";
import "@fontsource/plus-jakarta-sans";

import "../components/Sidebar/Sidebar.scss";
// import reportWebVitals from './reportWebVitals';

import AuthProvider from "../services/auth";

// const queryClient = new QueryClient();

const theme = createTheme({
    typography: {
        fontFamily: [
            "Plus Jakarta Sans",
            "Noto Sans JP",
            "-apple-system",
            "BlinkMacSystemFont",
            "\"Segoe UI\"",
            "\"Helvetica Neue\"",
            "Arial",
            "sans-serif",
            "\"Apple Color Emoji\"",
            "\"Segoe UI Emoji\"",
            "\"Segoe UI Symbol\"",
        ].join(","),
        fontSize: 16,
    },
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
        },
    },
});

function MyApp({ Component, pageProps }) {
    const location = useRouter();
    const [currentPath, setCurrentPath] = useState(location.pathname);
    const [queryClient] = useState(() => new QueryClient());

    useEffect(() => {
        setCurrentPath(location.pathname);
        // console.log(currentPath);
    }, [location]);

    return (

        <ThemeProvider theme={theme}>
            <StyledEngineProvider injectFirst>
                <QueryClientProvider client={queryClient}>
                    <Hydrate state={pageProps.dehydratedState}>
                        <AuthProvider>

                            <iframe
                                title="Site Background"
                                className="es-site__background"
                                width="1920"
                                height="1080"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight="0"
                                marginWidth="0"
                                src="https://virtualsky.lco.global/embed/index.html?longitude=139.839478&latitude=35.652832&projection=stereo&mouse=false&keyboard=false&cardinalpoints=false&showplanets=false&showplanetlabels=false&showdate=false&showposition=false&color=#000&az=318.6611215126213"
                                allowtransparency="true"
                            />
                            <div className="es-content__wrapper">
                                <Sidebar />
                                <div className="es-content">
                                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                                    {(currentPath === "/") ? <Component {...pageProps} />
                                        : (
                                            <>
                                                <Header />
                                                <main className="es-mainContent">
                                                    <ErrorBoundary>
                                                        <Component />
                                                    </ErrorBoundary>
                                                </main>
                                                <Footer />
                                            </>
                                        )}
                                </div>
                            </div>
                        </AuthProvider>
                    </Hydrate>
                </QueryClientProvider>
            </StyledEngineProvider>
        </ThemeProvider>
    );
}

export default MyApp;
