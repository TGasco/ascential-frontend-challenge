import React from 'react';
import { Flex, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

const Error: React.FC = () => (
  <Flex alignItems="center" justifyContent="center" width="100%">
    <Alert status="error" flexDirection="column" justifyContent="center" textAlign="center" p="8">
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        Problems loading the data
      </AlertTitle>
      <AlertDescription maxWidth="md">
        If the problem persists, try to refresh the page or wait a few minutes and try again.
      </AlertDescription>
    </Alert>
  </Flex>
);

export default Error;
