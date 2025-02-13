import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { CameraView } from 'expo-camera';

export default function BarcodeScannerScreen({ navigation }: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: any) => {
    setScanned(true);
    
    Alert.alert('détecté', `Code: ${data}`);

    const nutrients = await fetchNutriments(data);
    if (nutrients) {
      navigation.navigate('Results', { nutrients });
    } else {
      Alert.alert('Erreur', 'Aucun nutriment trouvé pour cet ingrédient.');
    }
  };

  if (hasPermission === null) {
    return <Text>Demande de permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Aucune permission pour utiliser l'appareil photo.</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 18 }}>Scannez un code-barres</Text>
        </View>
      </CameraView>
    </View>
  );
}

function fetchNutriments(data: any) {
  throw new Error('Function not implemented.');
}
