import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_ID = '7fe32169';
const APP_KEY = '0fdebb8fe5403c15564a867a25a3d790';

type FoodItem = {
  food: {
    label: string;
    nutrients: {
      ENERC_KCAL: number;
    };
  };
};

const AddMealScreen = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [mealName, setMealName] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadSelectedFoods = async () => {
      const storedFoods = await AsyncStorage.getItem('selectedFoods');
      if (storedFoods) {
        setSelectedFoods(JSON.parse(storedFoods));
      }
    };
    loadSelectedFoods();
  }, []);

  const searchFood = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.edamam.com/api/food-database/v2/parser?app_id=${APP_ID}&app_key=${APP_KEY}&ingr=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (data.hints) {
        setResults(data.hints);
      } else {
        Alert.alert('Aucun aliment trouvé', 'Essayez de modifier votre recherche.');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche :', error);
      Alert.alert('Erreur', 'Erreur lors de la récupération des aliments, veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFoodSelection = (food: FoodItem) => {
    const isSelected = selectedFoods.find(item => item.food.label === food.food.label);
    let updatedFoods;
    if (isSelected) {
      updatedFoods = selectedFoods.filter(item => item.food.label !== food.food.label);
    } else {
      updatedFoods = [...selectedFoods, food];
    }
    setSelectedFoods(updatedFoods);
    AsyncStorage.setItem('selectedFoods', JSON.stringify(updatedFoods));
  };

  const handleValidate = async () => {
    if (selectedFoods.length === 0) {
      Alert.alert('Aucun aliment sélectionné', 'Veuillez sélectionner au moins un aliment.');
      return;
    }
    setShowModal(true);
  };

  const saveMeal = async () => {
    if (!mealName.trim()) {
      Alert.alert('Nom de repas requis', 'Veuillez entrer un nom pour le repas.');
      return;
    }
    const newMeal = {
      id: Date.now().toString(),
      title: mealName,
      foods: selectedFoods,
    };
    try {
      const storedMeals = await AsyncStorage.getItem('meals');
      const meals = storedMeals ? JSON.parse(storedMeals) : [];
      meals.push(newMeal);
      await AsyncStorage.setItem('meals', JSON.stringify(meals));
      setShowModal(false);
      router.push('/(main)/(home)');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du repas :', error);
      Alert.alert('Erreur', 'Erreur lors de la validation du repas.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un repas</Text>
      <TextInput
        style={styles.input}
        placeholder="Rechercher un aliment..."
        value={query}
        onChangeText={setQuery}
      />
      <TouchableOpacity style={styles.searchButton} onPress={searchFood}>
        <Text style={styles.searchButtonText}>Rechercher</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#34D399" />}

      <FlatList
        data={results}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.resultItem,
              selectedFoods.find(selected => selected.food.label === item.food.label) && styles.selectedItem
            ]}
            onPress={() => toggleFoodSelection(item)}
          >
            <Text style={styles.resultText}>{item.food.label}</Text>
            <Text style={styles.resultText}>{item.food.nutrients.ENERC_KCAL} Calories</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => router.push('/(main)/add/camera')}
        >
          <Text style={styles.buttonText}>Scanner un Code Barres</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.validateButton}
          onPress={handleValidate}
          disabled={selectedFoods.length === 0}
        >
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nom du repas</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Entrez le nom du repas"
              value={mealName}
              onChangeText={setMealName}
            />
            <TouchableOpacity style={styles.modalButton} onPress={saveMeal}>
              <Text style={styles.modalButtonText}>Enregistrer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowModal(false)}>
              <Text style={styles.modalButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: '#34D399',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: '#d1ffd1',
  },
  resultText: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  scanButton: {
    backgroundColor: '#1A694C',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginRight: 10,
  },
  validateButton: {
    backgroundColor: '#34D399',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#34D399',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddMealScreen;
