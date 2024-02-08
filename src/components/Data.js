import React, { useEffect, useState } from 'react';
import { db} from '../Firebase/Firebase';



const Data = ({photoURL}) => {
    const [files, setFiles] = useState([]);

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
    
   
   return (
        <div className='dataContainer'>
            <div className='dataHeader'>
                <div className="headerLeft">
                    <p className='text'>My Drive</p>
                    <i className="fa-solid fa-caret-down"></i>
                </div>
                <div className="headerRight">
                <i className="fa-solid fa-list"></i>
                <i className="fas fa-info-circle info-icon"></i>
                </div>
            </div>
            <div className='dataList'>
                <p><b>Name</b></p>
                <span className='arrow'><i className="fa-solid fa-arrow-up"></i></span>
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
                <button className='response'><i className="fas fa-arrow-down"></i></button>
                <button className='response'><i className="fas fa-share-square"></i></button>
                <button onClick={() => deleteFile(file.id)} className='response'><i className="fas fa-trash-alt"></i></button>
                <button className='response'><i className="far fa-star"></i></button>
            </div>
            </div>

            ))}
          
           
        </div>
    );
}

export default Data;
