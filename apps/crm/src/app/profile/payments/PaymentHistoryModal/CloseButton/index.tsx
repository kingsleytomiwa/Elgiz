"use client";

import { Button } from '@mui/material';
import ClearIcon from "@mui/icons-material/Clear";
import React, { useCallback } from 'react';
import { useHandleParams } from 'src/hooks';

interface Props {

}

const CloseButton: React.FC<Props> = () => {
    const handleParams = useHandleParams();
    const close = useCallback(() => handleParams([['history', '']]), [handleParams]);

    return (
        <Button
            onClick={close}
        >
            <ClearIcon sx={{ color: "#3F51B5" }} />
        </Button>
    );
};

export default CloseButton;
