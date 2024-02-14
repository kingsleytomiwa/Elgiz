import { Category, Position } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";

interface Props extends React.PropsWithChildren {
    role?: Position;
    category?: Category;
}

const RoleRequired: React.FC<Props> = ({
    children,
    role = Position.OWNER,
    category,
}) => {
    const session = useSession();

    if (!session?.data?.user) {
        return null;
    }

    if (role === session.data.user.position || session.data.user.sections.includes(category as Category)) {
        return <>{children}</>;
    }

    return null;
};

export default RoleRequired;
