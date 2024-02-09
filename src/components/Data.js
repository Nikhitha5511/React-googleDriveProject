import React, { useEffect, useState } from 'react';
import { db} from '../Firebase/Firebase';
import axios from 'axios';



const Data = ({photoURL}) => {
    const [files, setFiles] = useState([]);
    const [shareEmail, setShareEmail] = useState('');
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); 
    const [displayMode, setDisplayMode] = useState('list'); 
    const [activeButton, setActiveButton] = useState('list');


    const [folders, setFolders] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection('folders').onSnapshot(snapshot => {
            setFolders(snapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                date: doc.data().date, 
                timestamp: doc.data().timestamp,
            })));
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = db.collection('files').onSnapshot(snapshot => {
            setFiles(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        });
        return () => unsubscribe();
    }, []);

    const changeBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    const formatDate = (date) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-GB', options);
    }
    const deleteFile = (id) => {
        const fileRef = db.collection('files').doc(id);
        fileRef.get().then((doc) => {
            if (doc.exists) {
                const fileData = doc.data();
                fileRef.delete().then(() => {
                    console.log('File deleted successfully');
                    db.collection('bin').add(fileData).then(() => {
                        console.log('File moved to bin successfully');
                    }).catch((error) => {
                        console.error('Error moving file to bin: ', error);
                    });
                }).catch((error) => {
                    console.error('Error deleting file: ', error);
                });
            } else {
                console.log('No such document!');
            }
        }).catch((error) => {
            console.error('Error getting document:', error);
        });
    };
   
    const handleDownload = (fileURL, fileName, event) => {
        event.preventDefault();
    
        const anchor = document.createElement('a');
        anchor.href = fileURL;
        anchor.download = fileName;
        anchor.click();
    };
    const handleShare = (file) => {
        setSelectedFile(file);
        setShowShareModal(true);
    };
    
    const deleteFolder = (id) => {
        db.collection('folders').doc(id).delete()
            .then(() => {
                console.log('Folder deleted successfully');
            })
            .catch((error) => {
                console.error('Error deleting folder:', error);
            });
    };

    
    const shareFile = () => {
        if (!selectedFile || !shareEmail) return;
        db.collection('sharedFiles').add({
            fileId: selectedFile.id,
            recipientEmail: shareEmail,
            timestamp: new Date(),
        })
        .then(() => {
            console.log('File shared successfully');
            setShowShareModal(false);
            setShareEmail('');
        })
        .catch((error) => {
            console.error('Error sharing file:', error);
        });
    };
    const starFile = (fileId) => {
        db.collection('files').doc(fileId).update({
            starred: true
        })
        .then(() => {
            console.log('File starred successfully');
            
            setFiles(files.map(file => {
                if (file.id === fileId) {
                    return { ...file, starred: true };
                }
                return file;
            }));
        })
        .catch((error) => console.error('Error starring file:', error));
    };
    
   

    const toggleStar = (id) => {
       
        setFiles(files.map(file => {
            if (file.id === id) {
                return { ...file, starred: !file.starred };
            }
            return file;
        }));
    };

   return (
        <div className='dataContainer'>
            <div className='dataHeader'>
                <div className="headerLeft">
                    <p className='text'>My Drive</p>
                    <i className="fa-solid fa-caret-down"></i>
                </div>
                <div className="headerRight">
                    <div className='responseButtonside'>
                <button
            className={`firstButton ${activeButton === 'list' ? 'activeButton' : ''}`}
            onClick={() => {
                setDisplayMode('list');
                setActiveButton('list');
            }}
            style={{ backgroundColor: activeButton === 'list' ? '#b1f0f0' : 'transparent' }}

        >
        <i className="fa-solid fa-bars">  {activeButton === 'list' && <span><i class="fa-solid fa-check tick1"></i></span>}</i>

        </button>
        <button
            className={`secondButton ${activeButton === 'grid' ? 'activeButton' : ''}`}
            onClick={() => {
                setDisplayMode('grid');
                setActiveButton('grid');
            }}
            style={{ backgroundColor: activeButton === 'grid' ? '#b1f0f0' : 'transparent' }}

        >
            
            <i className="fas fa-th-large large-icon">  {activeButton === 'grid' && <span><i class="fa-solid fa-check tick2"></i></span>}</i>

        </button>
                </div>
                </div>
            </div>
            {displayMode === 'list' && (
            <div className='body'>
            <div className='dataList'>
                <p><b>Name</b></p>
                <div className='space1'>
                    <p><b>Owner</b></p>
                    <p><b>Last Modified</b></p>
                    <p><b>File Size</b></p>
                </div>
            </div>
            {files.map(file => (
            <div  key={file.id} className='dataListRow'>
                <a href={file.data.fileURL}  target='_blank'>
                     {file.data.filename}
                </a>
                <div className='dynamicdata'>
                <p className='avatar'><img src={photoURL} alt="User Image" style={{width:'30px',height:'30px',borderRadius:'50px'}}></img></p>
                <p className='date'>{formatDate(file.data.timestamp?.seconds * 1000)}</p>
                <p>{changeBytes(file.data.size)}</p>
                </div>
                <div className='iconData'>
                <button onClick={(event) => handleDownload(file.data.fileURL, file.data.filename, event)}  className='response'><i className="fas fa-arrow-down"></i></button>
                <button onClick={() => handleShare(file)} className='response'><i className="fas fa-share-square"></i></button>
                <button onClick={() => deleteFile(file.id)} className='response'><i className="fas fa-trash-alt"></i></button>
                <button className='response' onClick={() => { toggleStar(file.id); starFile(file.id); }}>
                  {file.starred ? <i className="fas fa-star" style={{ color: 'black' }}></i> : <i className="far fa-star"></i>}
                </button>
            </div>
            </div>
           

            ))}
            </div>
              )}

            {folders.map(folder =>(
            <div  key={folder.id} className='dataListRow'>
               <p><i class="fa-solid fa-folder"></i> {folder.name}</p>
                <div className='dynamicdata'>
                <p className='avatar3'><img src={photoURL} alt="User Image" style={{width:'30px',height:'30px',borderRadius:'50px'}}></img></p>

                </div>
                <div className='iconData'>
                <button onClick={() => deleteFolder(folder.id)} className='response'><i className="fas fa-trash-alt"></i></button>

            </div>
               
            </div>

            ))}
            
            {showShareModal && (
                <div className="shareModal">
                    <input
                        type="email"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        placeholder="Enter recipient's email"
                    />
                    <button onClick={shareFile}>Share</button>
                    <button onClick={() => setShowShareModal(false)}>Cancel</button>
                </div>
            )}
          
          {displayMode === 'grid' && (
          <div className='dataGrid'>
          <h3 className='showFile'>All Files</h3>
          {files.map(file => (
          <div key={file.id} className='dataFile'>
          <i class="fa-regular fa-file iconFile"></i>
          <a href={file.data.fileURL}  target='_blank'>
          <p className='filename'>{file.data.filename}</p>
          </a>
         </div>
         ))}
            </div>
       
       )}
        </div>
    );
}

export default Data;
