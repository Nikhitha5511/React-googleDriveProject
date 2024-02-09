
import { useRef } from 'react';
import { useState ,useEffect} from 'react';
import 'firebase/storage';
import { db } from '../Firebase/Firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import firebase from 'firebase/compat/app'; 
import { Link } from 'react-router-dom';
import { auth, provider } from '../Firebase/Firebase';


const Sidebar=()=>{
    const popUpRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isPopUpVisible, setIsPopUpVisible] = useState(false);
    const [isFolderPopUpVisible, setIsFolderPopUpVisible] = useState(false);
    const [folderName, setFolderName] = useState('');

    // const handleFileUpload = async(file) => {
    //     console.log("File selected:", file.name);

    //     try {
    //         const storage = getStorage();
    //         const storageRef = ref(storage, `files/${file.name}`);
    //         const uploadTask = uploadBytesResumable(storageRef, file);
    //         const snapshot = await uploadTask;

    //         const downloadURL = await getDownloadURL(snapshot.ref);

    //         await db.collection('files').add({
    //             timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //             filename: file.name,
    //             fileURL: downloadURL,
    //             size: snapshot.totalBytes
    //         });

    //         console.log("File uploaded and details saved to Firestore!");
    //     } catch (error) {
    //         console.error("Error uploading file: ", error);
    //     }
    // };
    // In the handleFileUpload function in Sidebar.js

const handleFileUpload = async(file) => {
    console.log("File selected:", file.name);

    try {
        const storage = getStorage();
        const storageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        const snapshot = await uploadTask;

        const downloadURL = await getDownloadURL(snapshot.ref);

        const user = auth.currentUser;

        await db.collection('files').add({
            userId: user.uid, 
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            filename: file.name,
            fileURL: downloadURL,
            size: snapshot.totalBytes
        });

        console.log("File uploaded and details saved to Firestore!");
    } catch (error) {
        console.error("Error uploading file: ", error);
    }
};


    useEffect(() => {
        function handleClickOutside(event) {
            if (popUpRef.current && !popUpRef.current.contains(event.target) && event.target.tagName !== "BUTTON") {
                setIsPopUpVisible(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const openFileUploadDialog = () => {
        fileInputRef.current.click();
    };

    const togglePopUpVisibility = () => {
        setIsPopUpVisible(!isPopUpVisible);
    };
   
    const handleButtonClick = () => {
        setIsPopUpVisible(false);
        openFileUploadDialog();
    };
                 
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        handleFileUpload(file);
    };
    
    const handleCreateFolder = () => {
        if (folderName.trim() !== '') {
            db.collection('folders').add({
                name: folderName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                console.log('Folder created successfully');
                setFolderName('');
                setIsFolderPopUpVisible(false);
            }).catch((error) => {
                console.error('Error creating folder:', error);
            });
        }
    };
    const handleNewFolderClick = () => {
        setIsPopUpVisible(false); 
        setIsFolderPopUpVisible(true); 
    };

    return(
        <>
            <div className='sidebarContainer'>
                <div className='sidebarButton'>
                    <button onClick={togglePopUpVisibility}>
                        <img src="data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2236%22 height=%2236%22 viewBox=%220 0 36 36%22%3E%3Cpath fill=%22%2334A853%22 d=%22M16 16v14h4V20z%22/%3E%3Cpath fill=%22%234285F4%22 d=%22M30 16H20l-4 4h14z%22/%3E%3Cpath fill=%22%23FBBC05%22 d=%22M6 16v4h10l4-4z%22/%3E%3Cpath fill=%22%23EA4335%22 d=%22M20 16V6h-4v14z%22/%3E%3Cpath fill=%22none%22 d=%22M0 0h36v36H0z%22/%3E%3C/svg%3E" />
                        <span>New</span>
                    </button>
                </div>
                <div className="sidebarOptions">
                    <div className='sidebarOption'>
                    <i className="fas fa-home home-icon"></i>
                        <span>Home</span>
                    </div>
                    <div className='sidebarOption'>
                    <i className="fa-solid fa-laptop"></i>

                    <Link to="/drive">  <span>My Drive</span></Link>
                    </div>
                    <div className='sidebarOption'>
                    <i className="fas fa-desktop"></i>
                        <span>Computers</span>
                    </div>
                    <div className='sidebarOption'>
                    <i className="fa-regular fa-user"></i>
                        <span>Shared with me</span>
                    </div>
                    <div className='sidebarOption'>
                    <i className="far fa-clock"></i>
                        <span>Recent</span>
                    </div>
                    <div className='sidebarOption'>
                    <i className="far fa-star"></i>
                    <Link to='starred'><span>Starred</span></Link>
                    </div>
                    <div className='sidebarOption'>
                    <i className="fas fa-info-circle"></i>
                        <span>spam</span>
                    </div>
                    <div className='sidebarOption'>
                    <i className="fas fa-trash-alt"></i>
                        <Link to="/bin"><span>Bin</span></Link>
                    </div>
                    <div className='sidebarOption'>
                    <i className="fas fa-cloud"></i>
                        <span>Storage</span>
                    </div>
                    <div className="progress_bar">
                        <progress className='bar' size="tiny" value="50" max="100" />
                        <span>10 GB  of 15 GB used</span>
                    </div>
                </div>
                {isPopUpVisible && (
                    <div className='popUp1' ref={popUpRef}>
                        <div className='top'>
                            <button onClick={handleNewFolderClick} className='flex1'>
                            <i className="fas fa-folder"></i>
                            <span>New Folder</span>
                            </button>
                            <hr></hr>
                            <button  className='flex1' onClick={handleButtonClick}>
                            <i className="fas fa-cloud-upload-alt"></i>
                                <span>File Upload</span>
                            </button>
                            <button className='flex1'>
                            <i className="fas fa-cloud-upload-alt"></i>
                                <span>Folder Upload</span>
                            </button>
                        </div>
                    </div>
                )}
                 {isFolderPopUpVisible && (
                    <div className='folderPopUp'>
                        <input
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="Enter folder name"
                        />
                        <div className='buttonContainer'>
                            <button onClick={handleCreateFolder}>Create</button>
                          
                            <button onClick={() => setIsFolderPopUpVisible(false)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
            <input
                type='file'
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileInputChange}
            />
        </>
    )
}

export default Sidebar;
