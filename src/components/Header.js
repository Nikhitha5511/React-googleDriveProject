
const Header=({ photoURL })=>{
    return(
        <div className='HeaderContainer'>
            <div className='headerLogo'>
            <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png" alt="Google Drive"/>
            <span>Drive</span>
            </div>
            <div className='headerSearch'>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input  className='searchtext' type="text" placeholder='Search in Drive' />
            <i className="fas fa-align-center"></i>
            </div>
            <div className='headerIcons'>
            <span>
            <i className="fa-regular fa-circle-question large-icon"></i>
            <i className="fa-solid fa-gear large-icon"></i>
            <i className="fas fa-th-large large-icon"></i>
            <img src={photoURL} alt="User Image" style={{width:'40px',height:'40px',borderRadius:'50px'}}></img>

                </span>
            </div>
       
        </div>
    )
}

export default Header;