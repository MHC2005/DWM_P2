import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter, SearchParams } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';

interface PlanetDetails {
  name: string;
  image: string;
  description: string;
  moons: string[];
  moonsAmount: number;
}

export default function PlanetDetailsScreen() {
  const [planetDetails, setPlanetDetails] = useState<PlanetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useLocalSearchParams(); 
  const router = useRouter();

  const fetchPlanetDetails = async () => {
    try {
      const response = await fetch(`http://161.35.143.238:8000/mhernandez/${id}`, {
      });

      if (!response.ok) {
        throw new Error('Error al obtener los detalles del planeta');
      }

      const data = await response.json();
      console.log('Datos del planeta:', data);
      setPlanetDetails({
        name: data.name,
        image: data.image,
        description: data.description,
        moons: data.moon_names,
        moonsAmount: data.moons,
      });
    } catch (error) {
      setError('No se pudieron cargar los detalles del planeta.');
      console.error('Error al cargar los detalles del planeta:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanetDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8ecae6" />
        <Text>Cargando detalles del planeta...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!planetDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Detalles no disponibles.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: planetDetails.image }} style={styles.planetImage} />
      <Text style={styles.planetName}>{planetDetails.name}</Text>
      <Text style={styles.description}>{planetDetails.description}</Text>
      <Text style={styles.moonsTitle}>Lunas ({planetDetails.moonsAmount}):</Text>
      {planetDetails && planetDetails.moons.map((moon, index) => (
        <Text key={index} style={styles.moonItem}>
          - {moon}
        </Text>
      ))}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#f5f5f5', alignItems: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center' },
  planetImage: { width: 200, height: 200, borderRadius: 100, marginBottom: 16 },
  planetName: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  description: { fontSize: 16, marginBottom: 16, textAlign: 'justify', color: '#333' },
  moonsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'left', width: '100%' },
  moonItem: { fontSize: 16, color: '#555', marginBottom: 4 },
  backButton: {
    marginTop: 24,
    backgroundColor: '#8ecae6',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  backButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
