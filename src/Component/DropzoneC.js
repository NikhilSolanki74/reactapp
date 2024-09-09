import React, { useEffect, useRef } from 'react';
import Dropzone from 'dropzone';
import styles from './CSS/Dropzone.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const DropzoneC = ({ onFilesAdded,onFilesRemove }) => {
  const dropzoneRef = useRef(null);

  useEffect(() => {
    // Initialize Dropzone
    const dropzone = new Dropzone(dropzoneRef.current, {
      url: "/upload",
      autoProcessQueue: false,
      maxFiles: 8,
      acceptedFiles: 'image/*',
      addRemoveLinks: true,
      dictRemoveFile: "Remove",
      previewTemplate: `
        <div class="dz-preview dz-file-preview">
          <div class="dz-image">
            <img data-dz-thumbnail />
          </div>
          <div class="dz-details">
            <div class="dz-filename"><span data-dz-name></span></div>
            <div class="dz-size" data-dz-size></div>
          </div>
        </div>
      `,
    });

    // Handle file added event
    dropzone.on('addedfile', (file) => {
      onFilesAdded(file);
    });

    dropzone.on('removedfile',(file) => {
      onFilesRemove(file);
    })
    return () => {
      dropzone.destroy();
    };
  }, []);

  return (
    <div className={styles.abc}>
      <div ref={dropzoneRef} id="my-dropzone" className="dropzone">
        <div className="dz-message">
          <FontAwesomeIcon size='xl' icon={faPlus} style={{color: "#ffff"}} />&nbsp;Add Images (Max Limit 8)
        </div>
      </div>
    </div>
  );
};

export default DropzoneC;
