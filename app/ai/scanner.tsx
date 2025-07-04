import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useUserStore } from '@/hooks/useUserStore';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { 
  Camera, 
  Image as ImageIcon, 
  Info, 
  AlertCircle 
} from 'lucide-react-native';

export default function AIScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const { user, decrementAiScans, isPremium } = useUserStore();
  
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanType, setScanType] = useState<'skin' | 'poop' | 'eye'>('skin');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef(null);
  
  const scanTypes = [
    { id: 'skin', label: 'Skin Scan', icon: '🔍' },
    { id: 'poop', label: 'Poop Scan', icon: '💩' },
    { id: 'eye', label: 'Eye/Nose', icon: '👁️' },
  ];
  
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
    }
  };
  
  const handleAnalyze = () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    
    // In a real app, you would send the image to your AI service here
    // For this demo, we'll simulate an API call with a timeout
    setTimeout(() => {
      // Decrement available scans if not premium
      if (!isPremium()) {
        decrementAiScans();
      }
      
      setIsAnalyzing(false);
      
      // Navigate to results screen with the image and scan type
      router.push({
        pathname: '/ai/results',
        params: { 
          image: capturedImage,
          type: scanType
        }
      });
    }, 2000);
  };
  
  const handleReset = () => {
    setCapturedImage(null);
  };
  
  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.permissionContainer}>
        <AlertCircle size={48} color={colors.primary} />
        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
        <Text style={styles.permissionText}>
          We need camera permission to scan your pet's health issues.
        </Text>
        <Button 
          title="Grant Permission" 
          onPress={requestPermission} 
          style={styles.permissionButton}
        />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'AI Health Scanner' }} />
      
      {/* Scan Type Selector */}
      <View style={styles.scanTypeContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scanTypeScroll}
        >
          {scanTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.scanTypeButton,
                scanType === type.id && styles.selectedScanType,
              ]}
              onPress={() => setScanType(type.id as any)}
            >
              <Text style={styles.scanTypeIcon}>{type.icon}</Text>
              <Text 
                style={[
                  styles.scanTypeText,
                  scanType === type.id && styles.selectedScanTypeText,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Camera or Captured Image */}
      <View style={styles.cameraContainer}>
        {capturedImage ? (
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
        ) : (
          <CameraView 
            style={styles.camera} 
            facing={facing}
            ref={cameraRef}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.scanFrame} />
            </View>
          </CameraView>
        )}
      </View>
      
      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Info size={20} color={colors.primary} />
        <Text style={styles.instructionsText}>
          {scanType === 'skin' && 'Position the camera close to your pet\'s skin issue. Ensure good lighting.'}
          {scanType === 'poop' && 'Take a clear photo of your pet\'s stool. Avoid including other objects.'}
          {scanType === 'eye' && 'Position the camera close to your pet\'s eye or nose. Ensure good lighting.'}
        </Text>
      </View>
      
      {/* Controls */}
      {capturedImage ? (
        <View style={styles.controlsContainer}>
          <Button
            title="Retake"
            onPress={handleReset}
            variant="outline"
            style={styles.controlButton}
          />
          <Button
            title="Analyze"
            onPress={handleAnalyze}
            loading={isAnalyzing}
            style={styles.controlButton}
          />
        </View>
      ) : (
        <View style={styles.controlsContainer}>
          <Button
            title=""
            onPress={toggleCameraFacing}
            variant="outline"
            icon={<Camera size={24} color={colors.primary} />}
            style={styles.roundButton}
          />
          <Button
            title=""
            onPress={() => setCapturedImage('https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80')}
            icon={<Camera size={32} color="white" />}
            style={styles.captureButton}
          />
          <Button
            title=""
            onPress={pickImage}
            variant="outline"
            icon={<ImageIcon size={24} color={colors.primary} />}
            style={styles.roundButton}
          />
        </View>
      )}
      
      {/* Scans Remaining */}
      {!isPremium() && user && (
        <View style={styles.scansRemainingContainer}>
          <Text style={styles.scansRemainingText}>
            {user.aiScansRemaining} free scans remaining
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    minWidth: 200,
  },
  scanTypeContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scanTypeScroll: {
    paddingHorizontal: 16,
  },
  scanTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedScanType: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  scanTypeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  scanTypeText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  selectedScanTypeText: {
    color: 'white',
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 20,
  },
  capturedImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.primary + '10', // 10% opacity
    borderRadius: 8,
    margin: 16,
  },
  instructionsText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: colors.text,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  roundButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  controlButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  scansRemainingContainer: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  scansRemainingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
