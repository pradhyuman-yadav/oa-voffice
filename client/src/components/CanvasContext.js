// import React from "react";

// const CanvasContext = React.createContext(null);

// export default CanvasContext;

// CanvasContextProvider.js
import React, { createContext, useMemo } from 'react';

const CanvasContext = createContext(null);

export const CanvasContextProvider = ({ children }) => {
    const canvas = useMemo(() => {
        // Initialize canvas here
        const canvasElement = document.createElement('canvas');
        // Set up canvas properties and methods
        return {
            canvas: canvasElement.getContext('2d'),
        };
    }, []);

    return (
        <CanvasContext.Provider value={canvas}>
            {children}
        </CanvasContext.Provider>
    );
};

export default CanvasContext;
