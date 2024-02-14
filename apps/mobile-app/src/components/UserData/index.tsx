import React from 'react';
import CustomText from '../CustomText';
import { useGuest } from '../../hooks';
import { i18n } from '../../../App';

const UserData: React.FC = () => {
    const { data: guest } = useGuest();
    
    return (
        <>
            <CustomText variant="bold" className="text-center text-[24px] mt-20">
                {i18n?.t("hello")}, {guest?.name} 👋
            </CustomText>
            <CustomText className="text-[20px] mt-4 text-center">
                {i18n?.t("room")} {guest?.room}
            </CustomText>
        </>
    );
};

export default UserData;
