import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function EditTeamScreen() {
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('');
  const [goals, setGoals] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useLocalSearchParams();


  const fetchTeamDetails = async () => {
    try {
      const response = await fetch(`http://161.35.143.238:8000/mhernandez/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener los detalles del equipo');
      }
      const data = await response.json();
      setName(data.name);
      setLogo(data.logo);
      setDescription(data.description);
      setPoints(data.points.toString());
      setGoals(data.goals.toString());
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los detalles del equipo.');
    } finally {
      setLoading(false);
    }
  };

  const editTeam = async () => {
    try {
      const updatedTeam = {
        name,
        logo,
        description,
        points: parseInt(points,10),
        goals: parseInt(goals, 10),
      };

      const response = await fetch(`http://161.35.143.238:8000/mhernandez/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTeam),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el equipo');
      }

      Alert.alert('Equipo actualizado', 'El equipo se ha actualizado correctamente.', [
        { text: 'OK', onPress: () => router.push('/?reload=true') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el equipo.');
    }
  };

  useEffect(() => {
    fetchTeamDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando detalles del equipo...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Equipo</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="URL del logo"
        value={logo}
        onChangeText={setLogo}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Puntos (separados por comas)"
        value={points}
        onChangeText={setPoints}
      />
      <TextInput
        style={styles.input}
        placeholder="Goles"
        value={goals}
        keyboardType="numeric"
        onChangeText={setGoals}
      />

      <TouchableOpacity style={styles.saveButton} onPress={editTeam}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#8ecae6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  backButton: {
    backgroundColor: '#d3d3d3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: { color: '#555', fontWeight: 'bold', fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
