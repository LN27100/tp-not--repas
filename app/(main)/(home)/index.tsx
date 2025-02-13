// app/(main)/(home)/index.tsx
import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

type FoodItem = {
  food: {
    label: string;
    nutrients: {
      ENERC_KCAL: number;
    };
  };
};

const APP_ID = '7fe32169'; 
const APP_KEY = '0fdebb8fe5403c15564a867a25a3d790';

const HomeScreen = () => {
  const router = useRouter();
  const [meals, setMeals] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(
          `https://api.edamam.com/api/food-database/v2/parser?app_id=${APP_ID}&app_key=${APP_KEY}&ingr=pasta`
        );
        const data = await response.json();
        setMeals(data.hints || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des repas :', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Repas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.mealItem}>
              <Text style={styles.mealName}>{item.food.label}</Text>
              <Text style={styles.mealCalories}>{item.food.nutrients.ENERC_KCAL} Calories</Text>
            </View>
          )}
        />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(main)/add')}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mealItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  mealName: {
    fontSize: 18,
    fontWeight: '600',
  },
  mealCalories: {
    fontSize: 16,
    color: '#555',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'green',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
