import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

type FoodItem = {
  food: {
    label: string;
    nutrients: {
      ENERC_KCAL: number;
    };
  };
};

type Meal = {
  id: string;
  title: string;
  foods: FoodItem[];
};

const MealDetailScreen = () => {
  const router = useRouter();
  const { id } = router.query;  // Récupère l'ID du repas à partir de l'URL
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMealDetails = async () => {
      try {
        const storedMeals = await AsyncStorage.getItem('meals');
        if (storedMeals) {
          const meals = JSON.parse(storedMeals);
          const selectedMeal = meals.find((meal: Meal) => meal.id === id);
          setMeal(selectedMeal || null);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du repas :', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMealDetails();  // Charger les détails du repas lorsque l'ID est disponible
    }
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="green" />;
  }

  if (!meal) {
    return <Text>Repas non trouvé.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{meal.title}</Text>
      <FlatList
        data={meal.foods}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.foodItem}>
            <Text style={styles.foodLabel}>{item.food.label}</Text>
            <Text>{item.food.nutrients.ENERC_KCAL} Calories</Text>
          </View>
        )}
      />
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
  foodItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  foodLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default MealDetailScreen;
