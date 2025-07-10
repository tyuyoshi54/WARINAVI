import { StyleSheet } from 'react-native';
import { colors, dimensions } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: dimensions.spacing.lg,
  },
  
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  
  overlayContent: {
    backgroundColor: colors.surface,
    borderRadius: dimensions.borderRadius.lg,
    padding: dimensions.spacing.xl,
    minWidth: 120,
  },
  
  indicator: {
    color: colors.primary,
  },
  
  text: {
    marginTop: dimensions.spacing.md,
    fontSize: dimensions.fontSize.md,
    color: colors.text,
    textAlign: 'center',
  },
});