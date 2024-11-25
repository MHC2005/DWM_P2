import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from "expo-router";
import { Link } from 'expo-router';

interface Planet {
  id: string;
  name: string;
  description: string;
  moons: string[];
  moonsAmount: number;
  image: string;
}

export default function PlanetList() {
  const [planets, setPlanets] = useState<Planet[]>([]); 
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  const fetchPlanets = async () => {
    try {
      const response = await fetch('http://161.35.143.238:8000/mhernandez', {
      });
      if (!response.ok) {
        
        throw new Error('Error al obtener los planetas');
      }
      const data = await response.json();
      setPlanets(data); 
    } catch (error) {
      console.error('Error al cargar los planetas:', error);
    } finally {
      setLoading(false); 
    }
  };

  const detailsPlanet = async (id: string) => {
    try {
      const response = await fetch(`http://161.35.143.238:8000/mhernandez/${id}`, {
      });
      if (!response.ok) {
        throw new Error('Error al obtener los detalles del planeta');
      }
      const data = await response.json();
      return{
        name: data.name,
          image: data.image,
          description: data.description,
          moons: data.moons,
          moonsAmount: data.moonsAmount,
      }
    } catch (error) {
      console.error('Error al cargar los detalles del planeta:', error);
    }
  };

  useEffect(() => {
    fetchPlanets(); 
  }, []);

  const renderPlanet = ({ item }: { item: Planet }) => (
    <Link
    href={{
        pathname: '/details',
        params: { id: item.id },
      }}
      style={styles.planetContainer}
    >
      <Image source={{ uri: item.image }} style={styles.planetImage} />
      <Text style={styles.planetName}>{item.name}</Text>
    </Link>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8ecae6" />
        <Text>Cargando planetas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Home",
        }}
      />
      <Text style={styles.title}>Planetario UCU</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/AddPlanet')}>
          <Text style={styles.buttonText}>Agregar Planeta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Ordenar Planetas</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={planets}
        renderItem={renderPlanet}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  button: { backgroundColor: '#8ecae6', padding: 12, borderRadius: 8, flex: 1, marginHorizontal: 8 },
  buttonText: { textAlign: 'center', color: 'white', fontWeight: 'bold' },
  listContainer: { paddingBottom: 16 },
  planetContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, padding: 12, backgroundColor: '#ffffff', borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 },
  planetImage: { width: 50, height: 50, marginRight: 12, borderRadius: 25 },
  planetName: { fontSize: 18, fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
