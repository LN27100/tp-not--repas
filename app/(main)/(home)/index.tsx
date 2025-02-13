import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const [meals, setMeals] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMeals = async () => {
      // Charger les repas depuis AsyncStorage ou une autre base de données
      const storedMeals = await AsyncStorage.getItem('meals');
      if (storedMeals) {
        setMeals(JSON.parse(storedMeals));
      }
    };

    fetchMeals();
  }, []);

  const calculateTotalCalories = (meal) => {
    return meal.foods.reduce((total, food) => total + food.calories, 0);
  };

  const navigateToMealDetail = (mealId) => {
    router.push(`/home/${mealId}`);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Mes repas enregistrés</Text>
      
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToMealDetail(item.id)}>
            <View style={{ padding: 10, borderBottomWidth: 1 }}>
              <Text style={{ fontSize: 18 }}>{item.name}</Text>
              <Text>Total Caloriques : {calculateTotalCalories(item)} kcal</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      
      <Button title="Ajouter un repas" onPress={() => router.push('/add')} />
    </View>
  );
};

export default HomeScreen;
