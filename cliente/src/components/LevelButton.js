
import "../css/LevelButton.css";

export default function LevelButton({ level, onClick }) {
    return (
        <>
         <button className={`level-button level-${level}`} onClick={onClick}>
            {level}
        </button>
        </>
       
    );
}
