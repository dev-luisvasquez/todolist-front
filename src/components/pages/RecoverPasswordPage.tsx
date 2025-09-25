import RecoverPassword from "../template/RecoverPassword";

interface RecoverPasswordPageProps {
    token?: string | null;
}

export const RecoverPasswordPage = ({ token }: RecoverPasswordPageProps) => {
    return (
        <RecoverPassword token={token} />
    );
}