"use client";

import _Sidebar from "components/Sidebar";
import { useHandleParams } from 'src/hooks';


const Sidebar: React.FC<React.PropsWithChildren> = ({ children }) => {
    const handleParams = useHandleParams();

    return (
        <_Sidebar
            isOpened={true}
            title='the_details_of_the_guest'
            onClose={() => handleParams([['selected', '']], true)}
        >
            {children}
        </_Sidebar>
    );
};

export default Sidebar;
