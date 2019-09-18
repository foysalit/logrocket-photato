import React from 'react';
import { Flex, Button, Text } from '@chakra-ui/core';

function Header ({
    isUploading = false, 
    onPhotoSelect,
}) {
    let hiddenInput = null;

    return (
        <Flex 
            px="4"
            py="4"
            justify="space-between"
        >
            <Text 
                as="div"
                fontSize="xl" 
                fontWeight="bold" 
            >
                <span 
                    role="img" 
                    aria-labelledby="potato"
                >
                    🥔 
                </span> 
                <span 
                    role="img" 
                    aria-labelledby="potato"
                >
                    🍠 
                </span> 
                Photato
            </Text>

            <Flex align="end">
                <Button 
                    size="sm"
                    variant="outline"
                    variantColor="blue"
                    isLoading={isUploading}
                    loadingText="Uploading..."
                    onClick={() => hiddenInput.click()}
                >
                    Upload Photo     
                </Button>

                <input
                    hidden
                    type='file'
                    ref={el => hiddenInput = el}
                    onChange={(e) => onPhotoSelect(e.target.files[0])}
                />
            </Flex>
        </Flex>
    );
};

export default Header;