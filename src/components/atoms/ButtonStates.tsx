



interface ButtonStateProps {
    state: string;
    isActive?: boolean;
    onClick?: () => void;
}

export const ButtonState = ({ state, isActive, onClick }: ButtonStateProps) => {
    return (
        <button 
            className={`${isActive ? 'bg-teal-500' : 'bg-gray-400'} hover:bg-teal-700 text-white font-bold py-2 px-4 rounded`}
            onClick={onClick}
        >
            {state}
        </button>
    );
}