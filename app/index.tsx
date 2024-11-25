import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from "expo-router";
import { Link } from 'expo-router';

interface Team {
  id: string;
  name: string;
  description: string;
  points: number;
  goals: number;
  logo: string;
}

export default function TeamList() {
  const [teams, setTeams] = useState<Team[]>([]); 
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  const fetchTeams = async () => {
    try {
      const response = await fetch('http://161.35.143.238:8000/mhernandez', {
      });
      if (!response.ok) {
        
        throw new Error('Error al obtener los equipos');
      }
      const data = await response.json();
      setTeams(data); 
    } catch (error) {
      console.error('Error al cargar los equipos:', error);
    } finally {
      setLoading(false); 
    }
  };

  const sortTeamsByPoints = () => {
    const sortedTeams = [...teams].sort((a, b) => {
      return b.points - a.points; 
    });
    setTeams(sortedTeams);
  };
  
  

  useEffect(() => {
    fetchTeams(); 
  }, []);

  const renderTeam = ({ item }: { item: Team }) => (
    <Link
    href={{
        pathname: '/details',
        params: { id: item.id },
      }}
      style={styles.teamContainer}
    >
      <Image source={{ uri: item.logo }} style={styles.teamLogo} />
      <Text style={styles.teamName}>{item.name}</Text>
    </Link>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8ecae6" />
        <Text>Cargando equipos...</Text>
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
      <Text style={styles.title}>Eliminatorias UCU</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/AddTeam')}>
          <Text style={styles.buttonText}>Agregar Selección</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={sortTeamsByPoints}>
          <Text style={styles.buttonText}>Ordenar Equipos</Text>
        </TouchableOpacity>
        
      </View>
      <FlatList
        data={teams}
        renderItem={renderTeam}
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
  teamContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, padding: 12, backgroundColor: '#ffffff', borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8},
  teamLogo: { width: 50, height: 50, marginRight: 12, borderRadius: 25 },
  teamName: { fontSize: 18, fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
