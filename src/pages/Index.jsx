// Complete the Index page component here
// Use chakra-ui
import { Box, Input, Button, Text, VStack, Image, useToast } from '@chakra-ui/react';
import { useState } from 'react';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [songs, setSongs] = useState([]);
  const toast = useToast();

  const handleSearch = async () => {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa('4642e3fdf761477991140a71ec36597e:1f1ef85b93cc467290f77cdcca6b5cd1')
      },
      body: 'grant_type=client_credentials'
    });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track&limit=10`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const searchData = await searchResponse.json();
    if (searchData.tracks && searchData.tracks.items) {
      setSongs(searchData.tracks.items);
    } else {
      toast({
        title: 'No results found.',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch" m={10}>
      <Input placeholder="Search for a song" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <Button colorScheme="blue" onClick={handleSearch}>Search</Button>
      {songs.map(song => (
        <Box key={song.id} p={5} shadow="md" borderWidth="1px">
          <Text fontSize="xl">{song.name}</Text>
          <Text>Artist: {song.artists.map(artist => artist.name).join(', ')}</Text>
          <Image src={song.album.images[0].url} alt="Album cover" />
          <audio controls src={song.preview_url}>Your browser does not support the audio element.</audio>
        </Box>
      ))}
    </VStack>
  );
};

export default Index;

export default Index;