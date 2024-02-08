import { useState ,useEffect} from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';


const Header=({ photoURL })=>{
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [files, setFiles] = useState([]); 

    useEffect(() => {
        const user = firebase.auth().currentUser;
        if (user) {
            setUsername(user.displayName);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const snapshot = await firebase.firestore().collection('files').get();
            const filesData = snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            }));
            setFiles(filesData);
        };
    
        fetchData();
    }, []);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };
    const handleSignOut = () => {
        firebase.auth().signOut().then(() => {
           
            console.log('User signed out successfully.');
        }).catch((error) => {
           
            console.error('Error signing out:', error.message);
        });
    };
    const closePopup = () => {
        setIsPopupOpen(false);
    };
    
    const handleSearchInputChange = (event) => {
        console.log("searching...")
        setSearchQuery(event.target.value);
    };

    const filteredFiles = files.filter(file => file.data.filename.toLowerCase().includes(searchQuery.toLowerCase()));


    return(
        <div className='HeaderContainer'>
            <div className='headerLogo'>
            <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png" alt="Google Drive"/>
            <span>Drive</span>
            </div>
            <div className='headerSearch'>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
                    className='searchtext'
                    type="text"
                    placeholder='Search in Drive'
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                />
            <i className="fas fa-align-center"></i>
            </div>
            <div className='headerIcons'>
            <span>
            <i className="fa-regular fa-circle-question large-icon"></i>
            <i className="fa-solid fa-gear large-icon"></i>
            <i className="fas fa-th-large large-icon"></i>
            <img onClick={togglePopup} src={photoURL} alt="User Image" style={{width:'40px',height:'40px',borderRadius:'50px'}}></img>

                </span>
            </div>
            {isPopupOpen && (
                <div className="popup">
                    <div className="popupContent">
                    <button className='cancel'onClick={closePopup}>X</button>
                        <p>Hi {username}!</p>
                        <p>Click here to sign out</p>
                        <button className='signout' onClick={handleSignOut}>Sign Out</button>
                        
                    </div>
                </div>
            )}
            
           
        
       
        </div>
    )
}

export default Header;