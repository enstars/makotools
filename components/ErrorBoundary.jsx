import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        const { hasError } = this.state;
        const { children } = this.props;
        if (hasError) {
            // console.log(this);
            return "Something went wrong";
        }
        return children;
    }
}

export default ErrorBoundary;
