import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from 'react-dom';

const ResultModal= forwardRef(function ResultModal({newGame, score, gameOver, win}, ref) {
    const dialog =useRef();

    useImperativeHandle(ref, () => {
        return {
            open() {
                dialog.current.showModal();
            }
        }
    });

    return createPortal( //Output dialog någon annanstans i trädet, i det här fallet i diven "modal" som finns i index.html
    <dialog ref={dialog} className="result" onClose={newGame}>
        <div className="wrapper">
        {gameOver && <h2>You lost</h2>}
        {win && <h2>You won!</h2>}
        <p>Your score is: {score}</p>
        <form method="dialog" onSubmit={newGame}>
            <button>New Game</button>
        </form>
        </div>
    </dialog>, 
    document.getElementById('modal')
    );
})

export default ResultModal;