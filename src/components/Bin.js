import react from 'react';
import React, { useEffect, useState } from 'react';
import { db } from '../Firebase/Firebase';


const Bin=({photoURL})=>{
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null); 
    const [displayMode, setDisplayMode] = useState('list'); 
    const [activeButton, setActiveButton] = useState('list');

    useEffect(() => {
        const unsubscribe = db.collection('bin').onSnapshot(snapshot => {
            setFiles(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })));
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

    const handleEmptyBin = () => {
       
        db.collection('bin').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                doc.ref.delete();
            });
        }).catch(error => {
            console.error('Error emptying Bin:', error);
        });
    };


   return(
    <>
     <div className='dataContainer'>
        <div>
            <div className='dataHeader'>
                <div className="headerLeft">
                    <p className='text'> Bin for My Drive</p>
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
                <button onClick={handleEmptyBin} className="emptybutton">Empty Bin</button>

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
               
            </div>

            ))}
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
  
    
     
     </>

    )
}


export default Bin;
