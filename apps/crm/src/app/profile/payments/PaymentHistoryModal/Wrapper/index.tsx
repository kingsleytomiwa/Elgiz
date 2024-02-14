"use client";

import React, { useCallback } from 'react';
import { useHandleParams } from 'src/hooks';
import { Dialog } from 'ui';

interface Props extends React.PropsWithChildren {
    open: boolean;
}

const Wrapper: React.FC<Props> = ({ open, children }) => {
    const handleParams = useHandleParams();
    const close = useCallback(() => handleParams([['history', '']]), [handleParams]);

    return (
        <Dialog
            isOpened={open}
            onCancel={close}
            onSubmit={close}
            buttons={false}
        >
            {children}
        </Dialog>
    );
};

export default Wrapper;
