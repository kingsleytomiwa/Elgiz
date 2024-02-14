import { FoodCategory, FoodPosition } from '@prisma/client';
import PositionMenu, { PositionMenuProps } from 'components/PositionMenu';
import { useFoodCategories, useFoodPositions } from 'lib/use-fetch';
import React from 'react';
import AddPositionForm from '../AddPositionForm';
import { deleteFoodPosition } from '../AddPositionForm/actions';
import i18next from 'i18next';

const Menu: React.FC<Omit<PositionMenuProps<FoodPosition & FoodCategory, FoodCategory>, 'toSinglePosition' | 'useData' | 'useCategories' | 'CreateEditForm'>> = (props) => {
    return (
        <PositionMenu
            toSinglePosition={(item) => ({
                name: item?.name?.[i18next.language],
                description: item?.name?.[i18next.language],
                caption: `${item?.weight} г`,
                imageURL: item?.imageURL,
                price: +(item?.price?.toFixed(2))
            })}
            useData={useFoodPositions}
            useCategories={useFoodCategories}
            CreateEditForm={AddPositionForm as any}
			onDelete={(id) => deleteFoodPosition(id)}

            {...props}
        />
    );
};

export default Menu;
