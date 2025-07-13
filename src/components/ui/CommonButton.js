import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../../styles/colors';
import { TextStyles } from '../../styles/typography';
import { CommonStyles } from '../../styles/common';

export default function CommonButton({
  title,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'text'
  size = 'medium', // 'small', 'medium', 'large'
  disabled = false,
  loading = false,
  style,
  textStyle,
  ...props
}) {
  // サイズスタイル
  const sizeStyles = {
    small: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
    },
    medium: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 20,
    },
    large: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 24,
    },
  };

  // バリアントスタイル
  const getVariantStyles = () => {
    if (disabled) {
      return {
        container: styles.buttonDisabled,
        text: styles.buttonTextDisabled,
      };
    }

    switch (variant) {
      case 'secondary':
        return {
          container: styles.buttonSecondary,
          text: styles.buttonTextSecondary,
        };
      case 'outline':
        return {
          container: styles.buttonOutline,
          text: styles.buttonTextOutline,
        };
      case 'text':
        return {
          container: styles.buttonText,
          text: styles.buttonTextOnly,
        };
      default: // primary
        return {
          container: styles.buttonPrimary,
          text: styles.buttonTextPrimary,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const currentSizeStyle = sizeStyles[size] || sizeStyles.medium;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        currentSizeStyle,
        variantStyles.container,
        style,
      ]}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? Colors.textInverse : Colors.primary} 
        />
      ) : (
        <Text style={[
          styles.buttonTextBase,
          variantStyles.text,
          textStyle,
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  
  buttonTextBase: {
    ...TextStyles.button,
    textAlign: 'center',
  },
  
  // バリアント: Primary
  buttonPrimary: {
    backgroundColor: Colors.primary,
  },
  
  buttonTextPrimary: {
    color: Colors.textInverse,
  },
  
  // バリアント: Secondary
  buttonSecondary: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  
  buttonTextSecondary: {
    color: Colors.textPrimary,
  },
  
  // バリアント: Outline
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  
  buttonTextOutline: {
    color: Colors.primary,
  },
  
  // バリアント: Text
  buttonText: {
    backgroundColor: 'transparent',
  },
  
  buttonTextOnly: {
    color: Colors.primary,
  },
  
  // Disabled状態
  buttonDisabled: {
    backgroundColor: Colors.disabled,
  },
  
  buttonTextDisabled: {
    color: Colors.disabledText,
  },
});