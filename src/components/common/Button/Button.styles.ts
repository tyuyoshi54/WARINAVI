import { StyleSheet } from 'react-native';
import { colors, dimensions } from '@/constants';

export const styles = StyleSheet.create({
  button: {
    borderRadius: dimensions.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  
  secondary: {
    backgroundColor: colors.secondary,
  },
  
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  
  // Sizes
  small: {
    height: 36,
    paddingHorizontal: dimensions.spacing.md,
  },
  
  medium: {
    height: dimensions.button.height,
    paddingHorizontal: dimensions.spacing.lg,
  },
  
  large: {
    height: 56,
    paddingHorizontal: dimensions.spacing.xl,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  
  // Text styles
  text: {
    fontWeight: '600',
  },
  
  primaryText: {
    color: colors.surface,
    fontSize: dimensions.fontSize.md,
  },
  
  secondaryText: {
    color: colors.surface,
    fontSize: dimensions.fontSize.md,
  },
  
  outlineText: {
    color: colors.primary,
    fontSize: dimensions.fontSize.md,
  },
});