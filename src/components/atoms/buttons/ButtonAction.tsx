type ButtonActionProps = {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
    typeButton?: "button" | "submit" | "reset";
    typeAction?: "delete" | "edit" | "save" | "cancel" | "action";
    icon?: React.ReactNode;
}


export const ButtonAction = ({ text, onClick, disabled, typeButton = "button", typeAction = "save", icon }: ButtonActionProps) => {
    const baseClasses = "px-8 py-3 text-white w-full text-center font-bold rounded-4xl transition-colors flex items-center justify-center";
    const variantClasses = (() => {
        switch (typeAction) {
            case "delete":
                return "bg-[var(--danger)] hover:bg-red-700";
            case "edit":
                return "bg-blue-500 hover:bg-blue-600";
            case "cancel":
                return "bg-gray-600 hover:bg-gray-700";
            case "action":
                return "bg-[var(--primary)] hover:bg-[var(--primary-600)]";
            case "save":
            default:
                return "bg-green-600 hover:bg-green-700";
        }
    })();

    const classes = `${baseClasses} ${disabled ? "bg-gray-400 cursor-not-allowed" : variantClasses}`;

    return (
        <button
            type={typeButton}
            className={classes}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {text}
        </button>
    );
};