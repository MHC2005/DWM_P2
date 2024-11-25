import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from "expo-router";

export default function AddPlanet() {
  const router = useRouter();
  const [planetName, setPlanetName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [moonsAmount, setMoonsAmount] = useState('');
  const [moons, setMoons] = useState('');

  const handleAddPlanet = async () => {
    // Validaciones de entrada
    if (!planetName.trim() || !imageUrl.trim() || !description.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios.');
      return;
    }

    if (isNaN(parseInt(moonsAmount, 10))) {
      Alert.alert('Error', 'La cantidad de lunas debe ser un número válido.');
      return;
    }

    // Crear el objeto de datos del nuevo planeta
    const planetData = {
      name: planetName.trim(),
      imageUrl: imageUrl.trim(),
      description: description.trim(),
      moonsAmount: parseInt(moonsAmount, 10),
      moons: (moons || '').split(',').map(moon => moon.trim()).filter(moon => moon), // Filtrar elementos vacíos
    };

    try {
      // Realizar el POST a la API
      const response = await fetch('http://161.35.143.238:8000/mhernandez', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planetData),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'El planeta ha sido agregado.');
        router.push('/'); // Redirigir a la pantalla principal
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
      <Text style={styles.title}>Nuevo Planeta</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={planetName}
        onChangeText={setPlanetName}
        placeholderTextColor="grey"
      />
      <TextInput
        style={styles.input}
        placeholder="Imagen (url)"
        value={imageUrl}
        onChangeText={setImageUrl}
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
        placeholder="Cantidad de lunas"
        keyboardType="numeric"
        value={moonsAmount}
        onChangeText={setMoonsAmount}
        placeholderTextColor="grey"
      />
      <TextInput
        style={styles.input}
        placeholder="Lunas (separadas por comas)"
        value={moons}
        onChangeText={setMoons}
        placeholderTextColor="grey"
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddPlanet}>
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
