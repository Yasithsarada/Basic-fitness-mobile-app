import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useCustomContext } from '@/contexts/Context';
import { FontAwesome } from '@expo/vector-icons';

const HomePage = () => {
  const [data, setData] = useState([]);
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const {increment} = useCustomContext();
  type RouteParams = {
    username?: string;
  };

  const route = useRoute();
  const { username } = route.params as RouteParams;

  const { count } = useCustomContext();

  const RAPIDAPI_KEY = '5UQd+QI0cbd1W2/xQQkASg==wq7sYFybpuTWhjrM';
  const API_URL = `https://api.api-ninjas.com/v1/exercises?muscle=biceps`;
  const Image_API_URL = `https://api.pexels.com/v1/search?query=workout`;
  const Image_API_KEY = 'BF3ipIBCfelnuKMDjQcT0zrYyDNSQLAKTyS8INld7sYmG0EKU2RDm9aH';

  useEffect(() => {
    fetch(API_URL, {
      method: 'GET',
      headers: {
        'X-Api-Key': RAPIDAPI_KEY,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse JSON response
      })
      .then((json) => {
        // console.log('Parsed Data:', json); // Log parsed data for debugging
        setData(json); // Assuming the API response is an array
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });


      
    fetch(Image_API_URL, {
      method: 'GET',
      headers: {
        'Authorization': Image_API_KEY,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse JSON response
      })
      .then((json) => {
        console.log('Parsed Data:', json.photos[0]["src"]['original']); // Log parsed data for debugging
        const imageUrls = json.photos.map((photo) => photo["src"]['original']);
        console.log('Extracted Image URLs:', imageUrls); // Log the image URLs for debugging
        setImage(imageUrls); // Set the state with the list of image URLs
        // setData(json); // Assuming the API response is an array
        // setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);


  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          style={styles.profileImage}
          source={require('../../assets/images/logo.jpg')}
        />
        <View>
          <Text style={styles.greetingText}>Hello, {username}</Text>
          <Text style={styles.dateText}>Dec 30, 2024</Text>
        </View>
      </View>

      {/* Section Title */}
      <Text style={styles.sectionTitle}>Today Workouts</Text>

      {/* Movie List */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()} // KeyExtractor for unique key
        renderItem={({ item, index }) => (  // in
          <View style={styles.card}>
            <Image
              source={{
                uri: image[index],
              }}
              style={styles.cardImage}
            />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>
                Level : {item.difficulty} | Type : {item.type}
              </Text>
              <TouchableOpacity 
        style={{
          position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#000', // Button background color
    padding: 10,
    borderRadius: 100, // Circular butto
        }}  
        onPress={increment}
        // onPress={increment}
      >
        <FontAwesome name="plus" size={15} color={"white"}/>
      </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.name}
      />

      {/* Floating Counter */}
      <View style={styles.floatingCounter}>
        <Text style={styles.floatingText}> Cart : {count}</Text>
      </View>
      {/* <View style={styles.floatingButton}>
        <Text style={styles.floatingText}>{count}</Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  profileImage: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  dateText: {
    fontSize: 14,
    color: '#888',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardTextContainer: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  floatingCounter: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
  },
  floatingText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
 
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomePage;
