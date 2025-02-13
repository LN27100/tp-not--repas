import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Slot } from "expo-router";

interface NavItemProps {
  label: string;
  icon: string;
  iconActive: string;
  isActive: boolean;
  onPress: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, iconActive, isActive, onPress }) => (
  <TouchableOpacity style={[styles.navItem, isActive && styles.navItemActive]} onPress={onPress}>
    <Ionicons name={isActive ? iconActive : icon} size={28} color={isActive ? "#fff" : "#666"} />
    <Text style={[styles.navText, isActive && styles.navTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const MainLayout: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); 

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>

      <View style={styles.navbar}>
        <NavItem 
          label="Home" 
          icon="home-outline" 
          iconActive="home" 
          isActive={pathname === "/"} 
          onPress={() => router.push('/')}
        />
        <NavItem 
          label="Add" 
          icon="add-circle-outline" 
          iconActive="add-circle" 
          isActive={pathname === "/add"} 
          onPress={() => router.push('/add')}
        />
        <NavItem 
          label="Profile" 
          icon="person-outline" 
          iconActive="person" 
          isActive={pathname === "/profile"} 
          onPress={() => router.push('/profile')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  navItemActive: {
    backgroundColor: "#34D399",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  navText: {
    fontSize: 12,
    color: '#666',
  },
  navTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MainLayout;
