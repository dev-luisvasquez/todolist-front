type ButtonActionProps = {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
    typeButton?: "button" | "submit" | "reset";
    typeAction?: "delete" | "edit" | "save" | "cancel";
}


export const ButtonAction = ({ text, onClick, disabled, typeButton = "button", typeAction = "save" }: ButtonActionProps) => {
    const baseClasses = "px-8 py-3 text-white font-bold rounded-lg transition-colors";
    const variantClasses = (() => {
        switch (typeAction) {
            case "delete":
                return "bg-red-600 hover:bg-red-700";
            case "edit":
                return "bg-blue-500 hover:bg-blue-600";
            case "cancel":
                return "bg-gray-600 hover:bg-gray-700";
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
            {text}
        </button>
    );
};