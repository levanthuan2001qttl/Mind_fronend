import React from "react";
import "./modal.scss"
const Modal = ({show}) =>  {
    console.log(show)
    return (
        <>
             {show &&(
                 <div className="modalContainer">
                    <div className="modalL" >
                        <header className="modal_header">
                            <h2 className="modal_header-title">Modal title</h2>
                            <button className="close" >Close</button>
                        </header>
                        <main className="modal_content">This is modal content</main>
                        <footer className="modal_footer">
                            <button className="modal-close">
                            Cancel
                            </button>
                            <button className="submit">Submit</button>
                        </footer>
                    </div>
                 </div>
             )}
        </>
    )
}
export default Modal