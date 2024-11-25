import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalSearchParams, Link } from 'expo-router';

interface TeamDetails {
  name: string;
  logo: string;
  description: string;
  points: string[];
  goals: number;
}

export default function TeamDetailsScreen() {
  const [TeamDetails, setTeamDetails] = useState<TeamDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const fetchTeamDetails = async () => {
    try {
      const response = await fetch(`http://161.35.143.238:8000/mhernandez/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener los detalles del equipo');
      }

      const data = await response.json();
      setTeamDetails({
        name: data.name,
        logo: data.logo,
        description: data.description,
        points: data.points,
        goals: data.goals,
      });
    } catch (error) {
      setError('No se pudieron cargar los detalles del equipo.');
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      const response = await fetch(`http://161.35.143.238:8000/mhernandez/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el equipo');
      }

      Alert.alert('Equipo eliminado', 'El equipo se ha eliminado correctamente.', [
        {
          text: 'OK',
          onPress: () => router.push('/'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el equipo.');
    }
  };

  useEffect(() => {
    fetchTeamDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8ecae6" />
        <Text>Cargando detalles del equipo...</Text>
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

  if (!TeamDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Detalles no disponibles.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: TeamDetails.logo }} style={styles.teamLogo} />
      <Text style={styles.teamName}>{TeamDetails.name}</Text>
      <Text style={styles.description}>{TeamDetails.description}</Text>
      <Text style={styles.points}>Puntos ({TeamDetails.points}):</Text>
      <Text style={styles.points}>Goles ({TeamDetails.goals}):</Text>
      <Link
        href={{
          pathname: '/EditTeam',
          params: { id },
        }}
        style={styles.editButton}
      >
        <Text style={styles.editButtonText}>                            Editar</Text>
      </Link>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTeam(id as string)}
      >
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </TouchableOpacity>

      <Link href="/" style={styles.backButton}>
        <Text style={styles.backButtonText}>                           Volver</Text>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#f5f5f5', alignItems: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center' },
  teamLogo: { width: 200, height: 200, borderRadius: 100, marginBottom: 16 },
  teamName: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  description: { fontSize: 16, marginBottom: 16, textAlign: 'justify', color: '#333' },
  points: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'left', width: '100%' },
  goals: { fontSize: 16, color: '#555', marginBottom: 4 },
  backButton: {
    marginTop: 24,
    backgroundColor: '#8ecae6',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  backButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16,},
  deleteButton: {
    marginTop: 24,
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  deleteButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  editButton: {
    marginTop: 16,
    backgroundColor: '#ffb703',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
