import React from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

type Meal = {
  id: string;
  name: string;
  totalCalories: number;
};

const mockMeals: Meal[] = [
  { id: '1', name: 'Pasta', totalCalories: 600 },
  { id: '2', name: 'Salad', totalCalories: 300 },
  { id: '3', name: 'Burger', totalCalories: 800 },
];

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Repas</Text>

      <FlatList
        data={mockMeals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Text>{item.name}</Text>
            <Text>{item.totalCalories} Calories</Text>
          </View>
        )}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add')} 
        >
          <Text style={styles.addButtonText}>Ajouter un repas</Text> 
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  mealItem: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: 'tomato',
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 20, 
  },
  addButton: {
    backgroundColor: 'green', 
    borderRadius: 10, 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  addButtonText: {
    color: 'white', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
