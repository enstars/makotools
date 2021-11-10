import Document, {
    Html, Head, Main, NextScript,
} from "next/document";

class MyDocument extends Document {
    // static async getInitialProps(ctx) {
    //     const initialProps = await Document.getInitialProps(ctx);
    //     return { ...initialProps };
    // }

    render() {
        return (
            <Html>
                <Head />
                <body>
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
                        allowTransparency="true"
                    />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
