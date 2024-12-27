import React, { useState } from 'react';
import { ProfileContext } from './profileContext'; 
const ProfileContextProvider = ({ children }) => {
    const [profileStatus, setProfileStatus] = useState(0);

    return (
        <ProfileContext.Provider value={{ profileStatus, setProfileStatus }}>
            {children}
        </ProfileContext.Provider>
    );
};

export default ProfileContextProvider;
