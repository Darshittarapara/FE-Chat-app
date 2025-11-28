
const Groups = () => {
    
    return (
        <dialog id="custom_modal" className="modal">
            <div className="modal-box">
                <h2 className="text-xl font-semibold mb-4">Modal Title</h2>

                <div className="space-y-3">
                    <select defaultValue="Users" className="select">
                        <option disabled={true}>Users</option>
                        <option>Crimson</option>
                        <option>Amber</option>
                        <option>Velvet</option>
                    </select>
                </div>

                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn btn-error text-white">Cancel</button>
                    </form>

                    <button className="btn btn-primary">Confirm</button>
                </div>
            </div>
        </dialog>

    )
}

export default Groups