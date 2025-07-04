import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useUserStore } from '@/hooks/useUserStore';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { 
  Crown, 
  Check, 
  X, 
  Camera, 
  FileText, 
  Bell, 
  Download, 
  Zap 
} from 'lucide-react-native';

export default function PremiumScreen() {
  const router = useRouter();
  const { user, upgradeToPremiun, isPremium } = useUserStore();
  
  const handleUpgrade = (months: number) => {
    // In a real app, this would handle payment processing
    // For this demo, we'll just set the premium status
    
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + months);
    
    upgradeToPremiun(expiryDate.toISOString());
    router.replace('/profile');
  };
  
  const features = [
    {
      title: 'Unlimited AI Health Scans',
      description: 'Scan your pet\'s skin, stool, eyes, and more for health issues',
      icon: <Camera size={24} color={colors.premium} />,
      isPremium: true,
    },
    {
      title: 'Detailed Health Reports',
      description: 'Get comprehensive analysis and recommendations',
      icon: <FileText size={24} color={colors.premium} />,
      isPremium: true,
    },
    {
      title: 'Custom Reminders',
      description: 'Set personalized reminders for medications and treatments',
      icon: <Bell size={24} color={colors.premium} />,
      isPremium: true,
    },
    {
      title: 'Export Health Records',
      description: 'Generate PDF reports to share with your veterinarian',
      icon: <Download size={24} color={colors.premium} />,
      isPremium: true,
    },
    {
      title: 'Basic Pet Profiles',
      description: 'Add multiple pets and track their basic information',
      icon: <Check size={24} color={colors.success} />,
      isPremium: false,
    },
    {
      title: 'Care Schedule',
      description: 'Set and track feeding, walking, and grooming tasks',
      icon: <Check size={24} color={colors.success} />,
      isPremium: false,
    },
  ];
  
  const plans = [
    {
      id: 'monthly',
      title: 'Monthly',
      price: '$4.99',
      period: 'per month',
      features: ['All premium features', 'Cancel anytime'],
      months: 1,
      isPopular: false,
    },
    {
      id: 'yearly',
      title: 'Yearly',
      price: '$29.99',
      period: 'per year',
      features: ['All premium features', '50% savings', 'Cancel anytime'],
      months: 12,
      isPopular: true,
    },
  ];
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: 'Premium Features' }} />
      
      {/* Header */}
      <View style={styles.header}>
        <Crown size={48} color={colors.premium} />
        <Text style={styles.title}>Upgrade to Premium</Text>
        <Text style={styles.subtitle}>
          Unlock advanced features to provide the best care for your pets
        </Text>
      </View>
      
      {/* Features */}
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Features</Text>
        
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              {feature.icon}
            </View>
            <View style={styles.featureContent}>
              <View style={styles.featureTitleContainer}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                {feature.isPremium && (
                  <Crown size={16} color={colors.premium} />
                )}
              </View>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>
      
      {/* Plans */}
      {!isPremium() && (
        <View style={styles.plansContainer}>
          <Text style={styles.sectionTitle}>Choose a Plan</Text>
          
          <View style={styles.plansRow}>
            {plans.map((plan) => (
              <Card key={plan.id} style={[
                styles.planCard,
                plan.isPopular && styles.popularPlanCard,
              ]}>
                {plan.isPopular && (
                  <View style={styles.popularTag}>
                    <Text style={styles.popularTagText}>BEST VALUE</Text>
                  </View>
                )}
                
                <Text style={styles.planTitle}>{plan.title}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planPeriod}>{plan.period}</Text>
                </View>
                
                <View style={styles.planFeaturesContainer}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.planFeatureItem}>
                      <Check size={16} color={colors.success} />
                      <Text style={styles.planFeatureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                
                <Button
                  title={plan.isPopular ? 'Best Value' : 'Select Plan'}
                  onPress={() => handleUpgrade(plan.months)}
                  style={[
                    styles.planButton,
                    plan.isPopular && styles.popularPlanButton,
                  ]}
                  icon={plan.isPopular ? <Zap size={16} color="white" /> : undefined}
                />
              </Card>
            ))}
          </View>
        </View>
      )}
      
      {/* Current Status */}
      {isPremium() && user?.premiumUntil && (
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Crown size={24} color={colors.premium} />
            <Text style={styles.statusTitle}>You're Premium!</Text>
          </View>
          
          <Text style={styles.statusText}>
            Your premium subscription is active until{' '}
            <Text style={styles.statusHighlight}>
              {new Date(user.premiumUntil).toLocaleDateString()}
            </Text>
          </Text>
          
          <Button
            title="Return to Profile"
            onPress={() => router.replace('/profile')}
            style={styles.statusButton}
          />
        </Card>
      )}
      
      {/* Free Trial */}
      {!isPremium() && (
        <View style={styles.freeTrialContainer}>
          <Text style={styles.freeTrialText}>
            Not ready to commit? You have {user?.aiScansRemaining || 0} free AI scans remaining.
          </Text>
          <TouchableOpacity onPress={() => router.push('/ai/scanner')}>
            <Text style={styles.freeTrialLink}>Try it now</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Disclaimer */}
      <Text style={styles.disclaimer}>
        By upgrading, you agree to our Terms of Service and Privacy Policy. 
        {Platform.OS !== 'web' ? ' Subscriptions will automatically renew unless canceled at least 24 hours before the end of the current period.' : ''}
      </Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.premium + '10', // 10% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  plansContainer: {
    marginBottom: 32,
  },
  plansRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
  },
  planCard: {
    flex: Platform.OS === 'web' ? 1 : undefined,
    marginHorizontal: Platform.OS === 'web' ? 8 : 0,
    marginBottom: 16,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  popularPlanCard: {
    borderColor: colors.premium,
    borderWidth: 2,
  },
  popularTag: {
    position: 'absolute',
    top: 12,
    right: -30,
    backgroundColor: colors.premium,
    paddingHorizontal: 30,
    paddingVertical: 4,
    transform: [{ rotate: '45deg' }],
  },
  popularTagText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  planPeriod: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  planFeaturesContainer: {
    marginBottom: 24,
  },
  planFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planFeatureText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  planButton: {
    width: '100%',
  },
  popularPlanButton: {
    backgroundColor: colors.premium,
  },
  statusCard: {
    marginBottom: 32,
    padding: 24,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.premium,
    marginLeft: 12,
  },
  statusText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 24,
  },
  statusHighlight: {
    fontWeight: 'bold',
    color: colors.premium,
  },
  statusButton: {
    backgroundColor: colors.premium,
  },
  freeTrialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  freeTrialText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginRight: 4,
  },
  freeTrialLink: {
    fontSize: 14,
    color: colors.premium,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
