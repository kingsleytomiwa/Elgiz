import { ShopCategory, ShopPosition } from '@prisma/client';
import PositionMenu, { PositionMenuProps } from 'components/PositionMenu';
import { useShopCategories, useShopPositions } from 'lib/use-fetch';
import React from 'react';
import AddPositionForm from '../AddPositionForm';
import { deleteShopPosition } from '../AddPositionForm/actions';
import i18next from 'i18next';

const Menu: React.FC<Omit<PositionMenuProps<ShopPosition & ShopCategory, ShopCategory>, 'toSinglePosition' | 'useData' | 'useCategories' | 'CreateEditForm'>> = (props) => {
    return (
        <PositionMenu
            toSinglePosition={(item) => ({
                name: item?.name?.[i18next.language],
                description: item?.name?.[i18next.language],
                imageURL: item?.imageURL,
                price: Number(item?.price?.toFixed(2))
            })}
            useData={useShopPositions}
            useCategories={useShopCategories}
            CreateEditForm={AddPositionForm as any}
            onDelete={(id) => deleteShopPosition(id)}

            {...props}
        />
    );
};

export default Menu;
