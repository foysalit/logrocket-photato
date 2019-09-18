import React, { useState, useEffect, useCallback } from 'react';
import Carousel, { Modal, ModalGateway } from "react-images";
import PhotoGallery from 'react-photo-gallery';
import { useToast } from '@chakra-ui/core';

import Header from './header.component';
import { uploadPhoto, getPhotos } from './api';

function AppContainer() {
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);

    const [isUploading, setIsUploading] = useState(false);
    const [photos, setPhotos] = useState([]);
    const toast = useToast();
    
    async function handlePhotoSelect (file) {
        setIsUploading(true);

        try {
            const result = await uploadPhoto(file);
            if (!result.success)
                throw new Error("Error Uploading photo");

            toast({
                duration: 5000,
                status: "success",
                isClosable: true,
                title: "Upload Complete.",
                description: "Saved your photo on Photato!",
            });
        } catch (err) {
            toast({
                duration: 9000,
                status: "error",
                isClosable: true,
                title: "Upload Error.",
                description: "Something went wrong when uploading your photo!",
            });
        }

        setIsUploading(false);
    };

    const openLightbox = useCallback((event, { photo, index }) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    }, []);

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };
    
    useEffect(() => {
        if (!isUploading)
            getPhotos().then(setPhotos);
    }, [isUploading]);

    return (
        <>
            <Header
                isUploading={isUploading}
                onPhotoSelect={handlePhotoSelect}
            />
            <PhotoGallery
                photos={photos}
                onClick={openLightbox}
            />
            <ModalGateway>
                {viewerIsOpen && (
                    <Modal onClose={closeLightbox}>
                        <Carousel
                            currentIndex={currentImage}
                            views={photos.map(x => ({
                                ...x,
                                srcset: x.srcSet,
                                caption: x.title
                            }))}
                        />
                    </Modal>
                )}
            </ModalGateway>
        </>
    );
}

export default AppContainer;