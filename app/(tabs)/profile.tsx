import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/hooks/useUserStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { PremiumBadge } from '@/components/PremiumBadge';
import { 
  User, 
  Bell, 
  CreditCard, 
  HelpCircle, 
  Settings, 
  LogOut, 
  ChevronRight,
  Crown,
  Shield
} from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateUser, isPremium } = useUserStore();

  if (!user) return null;

  const toggleNotifications = () => {
    updateUser({
      preferences: {
        ...user.preferences,
        notifications: !user.preferences.notifications,
      },
    });
  };

  const handleUpgradeToPremium = () => {
    router.push('/premium');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        
        {isPremium() ? (
          <View style={styles.premiumContainer}>
            <Crown size={16} color={colors.premium} />
            <Text style={styles.premiumText}>Premium Member</Text>
          </View>
        ) : (
          <Button
            title="Upgrade to Premium"
            onPress={handleUpgradeToPremium}
            variant="outline"
            size="small"
            style={styles.upgradeButton}
            textStyle={{ color: colors.premium }}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <Card style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={colors.text} />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={user.preferences.notifications}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#E5E7EB', true: colors.primary + '80' }}
              thumbColor={user.preferences.notifications ? colors.primary : '#f4f3f4'}
              ios_backgroundColor="#E5E7EB"
            />
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        
        <Card style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <Text style={styles.subscriptionTitle}>
              {isPremium() ? 'Premium Plan' : 'Free Plan'}
            </Text>
            {isPremium() && <PremiumBadge />}
          </View>
          
          <Text style={styles.subscriptionDescription}>
            {isPremium() 
              ? 'You have access to all premium features'
              : 'Upgrade to access premium features'}
          </Text>
          
          {isPremium() && user.premiumUntil && (
            <Text style={styles.subscriptionExpiry}>
              Expires on {new Date(user.premiumUntil).toLocaleDateString()}
            </Text>
          )}
          
          {!isPremium() && (
            <Button
              title="Upgrade to Premium"
              onPress={handleUpgradeToPremium}
              style={styles.subscriptionButton}
              icon={<Crown size={16} color="white" />}
            />
          )}
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <Card style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <HelpCircle size={20} color={colors.text} />
              <Text style={styles.menuText}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Shield size={20} color={colors.text} />
              <Text style={styles.menuText}>Privacy Policy</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Settings size={20} color={colors.text} />
              <Text style={styles.menuText}>App Settings</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </Card>
      </View>

      <Button
        title="Sign Out"
        onPress={() => {}}
        variant="outline"
        style={styles.signOutButton}
        textStyle={{ color: colors.error }}
        icon={<LogOut size={18} color={colors.error} />}
      />
      
      <Text style={styles.versionText}>
        Version 1.0.0
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
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  premiumContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.premium + '15', // 15% opacity
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  premiumText: {
    fontSize: 14,
    color: colors.premium,
    fontWeight: '600',
    marginLeft: 6,
  },
  upgradeButton: {
    borderColor: colors.premium,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  subscriptionCard: {
    padding: 16,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  subscriptionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  subscriptionExpiry: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  subscriptionButton: {
    backgroundColor: colors.premium,
    marginTop: 8,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  signOutButton: {
    marginTop: 8,
    marginBottom: 24,
    borderColor: colors.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
  },
});
