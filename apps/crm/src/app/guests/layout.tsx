import Heading from "./Heading";

export default function Layout({
    children,
}) {
    return (
        <>
            <Heading />

            {children}
        </>
    );
}
