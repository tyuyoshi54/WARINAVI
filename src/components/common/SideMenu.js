import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const MENU_WIDTH = screenWidth * 0.65;

export default function SideMenu({ 
  isVisible, 
  onClose, 
  user, 
  slideAnim 
}) {
  const handleProfilePress = () => {
    console.log('プロフィール押下');
    onClose();
  };

  const handleSettingsPress = () => {
    console.log('設定押下');
    onClose();
  };

  const handleLogoutPress = () => {
    console.log('ログアウト押下');
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <Animated.View 
            style={[
              styles.menuContainer,
              {
                transform: [{ translateX: slideAnim }]
              }
            ]}
          >
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              {user?.pictureUrl ? (
                <Image 
                  source={{ uri: user.pictureUrl }} 
                  style={styles.profileImage} 
                />
              ) : (
                <View style={styles.defaultProfileImage}>
                  <Text style={styles.defaultProfileText}>
                    {user?.displayName?.charAt(0) || 'U'}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.userName}>{user?.displayName || 'ユーザー'}</Text>
          </View>

          <View style={styles.menuItems}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleProfilePress}
            >
              <View style={styles.menuIcon}>
                <Text style={styles.menuIconText}>👤</Text>
              </View>
              <Text style={styles.menuItemText}>プロフィール</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleSettingsPress}
            >
              <View style={styles.menuIcon}>
                <Text style={styles.menuIconText}>⚙️</Text>
              </View>
              <Text style={styles.menuItemText}>設定</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleLogoutPress}
            >
              <View style={styles.menuIcon}>
                <Text style={styles.menuIconText}>🚪</Text>
              </View>
              <Text style={styles.menuItemText}>ログアウト</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: MENU_WIDTH,
    height: '100%',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  profileSection: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#3498db',
  },
  defaultProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#2980b9',
  },
  defaultProfileText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  menuItems: {
    paddingTop: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIconText: {
    fontSize: 20,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  separator: {
    height: 1,
    backgroundColor: '#e1e8ed',
    marginVertical: 8,
    marginHorizontal: 24,
  },
});