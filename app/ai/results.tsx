import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PremiumBadge } from '@/components/PremiumBadge';
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  ArrowLeft, 
  Share2, 
  Download,
  HelpCircle,
  Crown,
} from 'lucide-react-native';

export default function AIResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ image: string; type: string }>();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    status: 'healthy' | 'warning' | 'alert';
    title: string;
    description: string;
    recommendations: string[];
  } | null>(null);
  
  useEffect(() => {
    // Simulate AI analysis
    const timer = setTimeout(() => {
      // Generate mock results based on scan type
      let mockResult;
      
      switch (params.type) {
        case 'skin':
          mockResult = {
            status: 'warning' as const,
            title: 'Possible Mild Irritation',
            description: 'The scan shows signs of mild skin irritation. This could be due to allergies, dry skin, or minor contact dermatitis. The affected area appears slightly red but doesn\'t show signs of severe infection.',
            recommendations: [
              'Keep the area clean and dry',
              'Avoid scratching or licking',
              'Consider using a pet-safe moisturizer',
              'Monitor for changes over the next 48 hours',
              'If worsening, consult your veterinarian'
            ]
          };
          break;
        case 'poop':
          mockResult = {
            status: 'healthy' as const,
            title: 'Healthy Stool',
            description: 'The stool appears to be of normal consistency and color. This indicates good digestive health. No visible signs of parasites, blood, or mucus were detected.',
            recommendations: [
              'Continue current diet',
              'Ensure fresh water is always available',
              'Maintain regular feeding schedule',
              'Monitor for any changes in bathroom habits'
            ]
          };
          break;
        case 'eye':
          mockResult = {
            status: 'alert' as const,
            title: 'Possible Conjunctivitis',
            description: 'The scan shows signs of redness and discharge that may indicate conjunctivitis or an eye infection. This condition requires attention as it can cause discomfort and may worsen if untreated.',
            recommendations: [
              'Consult your veterinarian within 24-48 hours',
              'Avoid touching or wiping the eye',
              'Keep your pet from rubbing the affected eye',
              'Monitor for increased discharge or squinting',
              'Do not use human eye drops or medications'
            ]
          };
          break;
        default:
          mockResult = {
            status: 'healthy' as const,
            title: 'No Issues Detected',
            description: 'The scan appears normal with no visible health concerns.',
            recommendations: [
              'Continue regular pet care routine',
              'Monitor for any changes',
              'Schedule regular vet check-ups'
            ]
          };
      }
      
      setResult(mockResult);
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [params.type]);
  
  const getStatusColor = () => {
    if (!result) return colors.textSecondary;
    
    switch (result.status) {
      case 'healthy':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'alert':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };
  
  const getStatusIcon = () => {
    if (!result) return null;
    
    const size = 32;
    const color = getStatusColor();
    
    switch (result.status) {
      case 'healthy':
        return <CheckCircle size={size} color={color} />;
      case 'warning':
        return <AlertTriangle size={size} color={color} />;
      case 'alert':
        return <AlertCircle size={size} color={color} />;
      default:
        return null;
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: 'Scan Results' }} />
      
      {/* Image Preview */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: params.image }} style={styles.image} />
        <View style={styles.scanTypeTag}>
          <Text style={styles.scanTypeText}>
            {params.type === 'skin' && 'Skin Scan'}
            {params.type === 'poop' && 'Poop Scan'}
            {params.type === 'eye' && 'Eye/Nose Scan'}
          </Text>
        </View>
      </View>
      
      {/* Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Analyzing image...</Text>
        </View>
      ) : (
        <>
          {/* Result Header */}
          <View style={styles.resultHeader}>
            {getStatusIcon()}
            <Text style={[styles.resultTitle, { color: getStatusColor() }]}>
              {result?.title}
            </Text>
          </View>
          
          {/* Result Description */}
          <Card style={styles.descriptionCard}>
            <Text style={styles.description}>{result?.description}</Text>
          </Card>
          
          {/* Recommendations */}
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationsTitle}>Recommendations</Text>
            
            {result?.recommendations.map((recommendation, index) => (
              <View key={index} style={styles.recommendationItem}>
                <View style={styles.recommendationBullet}>
                  <Text style={styles.recommendationBulletText}>{index + 1}</Text>
                </View>
                <Text style={styles.recommendationText}>{recommendation}</Text>
              </View>
            ))}
          </View>
          
          {/* Disclaimer */}
          <View style={styles.disclaimerContainer}>
            <HelpCircle size={16} color={colors.textSecondary} />
            <Text style={styles.disclaimerText}>
              This is an AI-powered analysis and should not replace professional veterinary advice. 
              If your pet is showing signs of distress, please consult a veterinarian.
            </Text>
          </View>
          
          {/* Actions */}
          <View style={styles.actionsContainer}>
            <Button
              title="Back to Scanner"
              onPress={() => router.back()}
              variant="outline"
              icon={<ArrowLeft size={18} color={colors.primary} />}
              style={styles.actionButton}
            />
            <Button
              title="Share Results"
              onPress={() => {}}
              variant="outline"
              icon={<Share2 size={18} color={colors.primary} />}
              style={styles.actionButton}
            />
          </View>
          
          {/* Premium Upsell */}
          <Card style={styles.premiumCard}>
            <View style={styles.premiumHeader}>
              <Crown size={24} color={colors.premium} />
              <View style={styles.premiumTitleContainer}>
                <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                <PremiumBadge />
              </View>
            </View>
            
            <Text style={styles.premiumDescription}>
              Get unlimited AI scans, detailed health reports, and personalized recommendations.
            </Text>
            
            <Button
              title="Upgrade Now"
              onPress={() => router.push('/premium')}
              style={styles.premiumButton}
            />
          </Card>
        </>
      )}
    </ScrollView>
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
    position: 'relative',
    width: '100%',
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  scanTypeTag: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scanTypeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  descriptionCard: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  recommendationsContainer: {
    marginBottom: 24,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  recommendationBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendationBulletText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    backgroundColor: colors.warning + '10', // 10% opacity
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  disclaimerText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  premiumCard: {
    backgroundColor: colors.premium + '08', // 8% opacity
    borderColor: colors.premium + '30', // 30% opacity
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  premiumTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.premium,
  },
  premiumDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
  },
  premiumButton: {
    backgroundColor: colors.premium,
  },
});
