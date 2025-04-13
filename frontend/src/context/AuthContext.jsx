import { createContext, useState } from "react";

export const AuthContext = createContext(
    {
        userId: null,
        login: (userData) => {},
    }
);

  
