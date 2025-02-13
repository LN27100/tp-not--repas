import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

const HomeScreen = () => {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const storedMeals = await AsyncStorage.getItem('meals');
        if (storedMeals) {
          const parsedMeals = JSON.parse(storedMeals);
          if (Array.isArray(parsedMeals)) {
            setMeals(parsedMeals);
          } else {
            console.error('Les repas stockés ne sont pas un tableau valide.');
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des repas :', error);
      } finally {
        setLoading(false);
      }
    };

    loadMeals();
  }, []);

  const handleMealClick = (meal: Meal) => {
    if (meal && meal.id) {
      router.push(`/(home)/${meal.id}`);
    } else {
      console.error('Repas invalide :', meal);
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    Alert.alert(
      'Supprimer le repas',
      'Êtes-vous sûr de vouloir supprimer ce repas ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              const storedMeals = await AsyncStorage.getItem('meals');
              if (storedMeals) {
                let meals = JSON.parse(storedMeals);
                meals = meals.filter((meal: Meal) => meal.id !== mealId);
                await AsyncStorage.setItem('meals', JSON.stringify(meals));
                setMeals(meals);
              }
            } catch (error) {
              console.error('Erreur lors de la suppression du repas :', error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Repas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.mealItem}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => handleMealClick(item)}
              >
                <Text style={styles.mealName}>{item.title}</Text>
                <Text style={styles.mealCalories}>{item.foods.length} Aliments</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteMeal(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="white" />
              </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 5,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#34D399',
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
