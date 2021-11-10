import App from '../components/App'
// import App from 'next/app'
import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { StyledEngineProvider } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material";

import "normalize.css/normalize.css";
import "../styles/index.scss";
import "@fontsource/plus-jakarta-sans";

import "../components/Sidebar/Sidebar.scss";
// import reportWebVitals from './reportWebVitals';

import AuthProvider from "../services/auth";

const queryClient = new QueryClient();

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
    return (
        // "hi"
        <App page={<Component />}/>
    );
    
    
    
  }
  
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.
  //
  // MyApp.getInitialProps = async (appContext) => {
  //   // calls page's `getInitialProps` and fills `appProps.pageProps`
  //   const appProps = await App.getInitialProps(appContext);
  //
  //   return { ...appProps }
  // }
  
  export default MyApp
  