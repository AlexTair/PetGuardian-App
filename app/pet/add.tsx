import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { usePetStore } from '@/hooks/usePetStore';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { PetSpecies } from '@/types/pet';
import { generateId } from '@/utils/helpers';
import { Camera, X } from 'lucide-react-native';

export default function AddPetScreen() {
  const router = useRouter();
  const { addPet } = usePetStore();
  
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'unknown'>('unknown');
  const [neutered, setNeutered] = useState(false);
  const [microchipped, setMicrochipped] = useState(false);
  const [microchipId, setMicrochipId] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  
  const speciesOptions: PetSpecies[] = ['dog', 'cat', 'bird', 'rabbit', 'fish', 'reptile', 'other'];
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };
  
  const handleAddPet = () => {
    if (!name.trim()) {
      // Show error (in a real app, use a proper error handling system)
      alert('Please enter a name for your pet');
      return;
    }
    
    const newPet = {
      id: generateId(),
      name: name.trim(),
      species,
      breed: breed.trim() || undefined,
      age: age ? parseInt(age, 10) : undefined,
      gender,
      neutered,
      microchipped,
      microchipId: microchipped ? microchipId.trim() : undefined,
      notes: notes.trim() || undefined,
      imageUri,
    };
    
    addPet(newPet);
    router.replace('/pets');
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Stack.Screen options={{ title: 'Add Pet' }} />
        
        {/* Pet Image */}
        <View style={styles.imageContainer}>
          {imageUri ? (
            <View>
              <Image source={{ uri: imageUri }} style={styles.petImage} />
              <TouchableOpacity 
                style={styles.removeImageButton} 
                onPress={() => setImageUri(undefined)}
              >
                <X size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
              <Camera size={32} color={colors.primary} />
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Pet Information Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter pet's name"
              placeholderTextColor={colors.textSecondary + '80'}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Species *</Text>
            <View style={styles.speciesOptions}>
              {speciesOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.speciesOption,
                    species === option && styles.selectedSpeciesOption,
                  ]}
                  onPress={() => setSpecies(option)}
                >
                  <Text 
                    style={[
                      styles.speciesOptionText,
                      species === option && styles.selectedSpeciesOptionText,
                    ]}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Breed</Text>
            <TextInput
              style={styles.input}
              value={breed}
              onChangeText={setBreed}
              placeholder="Enter breed (optional)"
              placeholderTextColor={colors.textSecondary + '80'}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Age (years)</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ''))}
              placeholder="Enter age in years (optional)"
              placeholderTextColor={colors.textSecondary + '80'}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Additional Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.genderOptions}>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  gender === 'male' && styles.selectedGenderOption,
                ]}
                onPress={() => setGender('male')}
              >
                <Text 
                  style={[
                    styles.genderOptionText,
                    gender === 'male' && styles.selectedGenderOptionText,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  gender === 'female' && styles.selectedGenderOption,
                ]}
                onPress={() => setGender('female')}
              >
                <Text 
                  style={[
                    styles.genderOptionText,
                    gender === 'female' && styles.selectedGenderOptionText,
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  gender === 'unknown' && styles.selectedGenderOption,
                ]}
                onPress={() => setGender('unknown')}
              >
                <Text 
                  style={[
                    styles.genderOptionText,
                    gender === 'unknown' && styles.selectedGenderOptionText,
                  ]}
                >
                  Unknown
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[styles.checkbox, neutered && styles.checkboxChecked]}
              onPress={() => setNeutered(!neutered)}
            >
              {neutered && <View style={styles.checkboxInner} />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>Neutered/Spayed</Text>
          </View>
          
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[styles.checkbox, microchipped && styles.checkboxChecked]}
              onPress={() => setMicrochipped(!microchipped)}
            >
              {microchipped && <View style={styles.checkboxInner} />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>Microchipped</Text>
          </View>
          
          {microchipped && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Microchip ID</Text>
              <TextInput
                style={styles.input}
                value={microchipId}
                onChangeText={setMicrochipId}
                placeholder="Enter microchip ID"
                placeholderTextColor={colors.textSecondary + '80'}
              />
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional notes about your pet"
              placeholderTextColor={colors.textSecondary + '80'}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Add Pet"
            onPress={handleAddPet}
            fullWidth
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  removeImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.error,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary + '15', // 15% opacity
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: colors.primary,
    fontWeight: '500',
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  speciesOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  speciesOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedSpeciesOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  speciesOptionText: {
    color: colors.text,
    fontWeight: '500',
  },
  selectedSpeciesOptionText: {
    color: 'white',
  },
  genderOptions: {
    flexDirection: 'row',
  },
  genderOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedGenderOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderOptionText: {
    color: colors.text,
    fontWeight: '500',
  },
  selectedGenderOptionText: {
    color: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 16,
    color: colors.text,
  },
  buttonContainer: {
    marginTop: 16,
  },
});
