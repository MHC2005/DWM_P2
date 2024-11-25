import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from "expo-router";

export default function AddTeam() {
  const router = useRouter();
  const [teamName, setTeamName] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('');
  const [goals, setGoals] = useState('');

  const handleAddTeam = async () => {
    // Validaciones de entrada
    if (!teamName.trim() || !logo.trim() || !description.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios.');
      return;
    }

    if (isNaN(parseInt(goals, 10))) {
      Alert.alert('Error', 'La cantidad de goles debe ser un número válido.');
      return;
    }

    const teamData = {
      name: teamName.trim(),
      logo: logo.trim(),
      description: description.trim(),
      points: parseInt(points, 10),
      goals: parseInt(goals, 10),
    };

    try {
      const response = await fetch('http://161.35.143.238:8000/mhernandez', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'El equipo ha sido agregado.');
        router.push('/'); 
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'No se pudo agregar el planeta.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al conectar con el servidor.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Agregar Planeta",
        }}
      />
      <Text style={styles.title}>Nueva Selección</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={teamName}
        onChangeText={setTeamName}
        placeholderTextColor="grey"
      />
      <TextInput
        style={styles.input}
        placeholder="Logo (url)"
        value={logo}
        onChangeText={setLogo}
        placeholderTextColor="grey"
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        placeholderTextColor="grey"
      />
      <TextInput
        style={styles.input}
        placeholder="Puntos"
        keyboardType="numeric"
        value={points}
        onChangeText={setPoints}
        placeholderTextColor="grey"
      />
      <TextInput
        style={styles.input}
        placeholder="Goles"
        value={goals}
        onChangeText={setGoals}
        placeholderTextColor="grey"
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddTeam}>
        <Text style={styles.buttonText}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    backgroundColor: '#ffffff',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#219ebc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginTop: 16,
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
