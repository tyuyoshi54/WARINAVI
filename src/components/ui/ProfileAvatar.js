import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';
import { Dimensions } from '../../styles/common';

export default function ProfileAvatar({
  user,
  size = 'md', // 'xs', 'sm', 'md', 'lg', 'xl'
  showBorder = true,
  borderColor = Colors.profileBorder,
  onPress,
  style,
}) {
  // サイズマッピング
  const sizeMap = {
    xs: Dimensions.avatar.xs,
    sm: Dimensions.avatar.sm,
    md: Dimensions.avatar.md,
    lg: Dimensions.avatar.lg,
    xl: Dimensions.avatar.xl,
  };

  const avatarSize = sizeMap[size] || sizeMap.md;
  const borderRadius = avatarSize / 2;
  const borderWidth = showBorder ? 2 : 0;
  
  // フォントサイズをアバターサイズに合わせて調整
  const fontSize = Math.max(12, Math.floor(avatarSize * 0.4));

  const avatarStyles = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: borderRadius,
    borderWidth: borderWidth,
    borderColor: borderColor,
  };

  const defaultAvatarStyles = {
    ...avatarStyles,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const textStyles = {
    fontSize: fontSize,
    fontWeight: 'bold',
    color: Colors.textInverse,
  };

  const renderAvatar = () => {
    if (user?.pictureUrl) {
      return (
        <Image 
          source={{ uri: user.pictureUrl }} 
          style={[styles.profileImage, avatarStyles]}
          resizeMode="cover"
        />
      );
    } else {
      return (
        <View style={[styles.defaultProfileImage, defaultAvatarStyles]}>
          <Text style={[styles.defaultProfileText, textStyles]}>
            {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
      );
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.container, style]}
        activeOpacity={0.7}
      >
        {renderAvatar()}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {renderAvatar()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    // 動的にスタイルが適用される
  },
  defaultProfileImage: {
    // 動的にスタイルが適用される
  },
  defaultProfileText: {
    // 動的にスタイルが適用される
  },
});