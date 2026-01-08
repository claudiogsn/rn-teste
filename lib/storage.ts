import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  getItem: async (key: string) => {
    const value = await AsyncStorage.getItem(key);
    return value ?? null;
  },
  setItem: async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    await AsyncStorage.removeItem(key);
  },
};
