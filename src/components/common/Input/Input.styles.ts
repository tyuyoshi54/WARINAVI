import { StyleSheet } from 'react-native';
import { colors, dimensions } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    marginBottom: dimensions.spacing.md,
  },
  
  label: {
    fontSize: dimensions.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: dimensions.spacing.xs,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: dimensions.borderRadius.md,
    height: dimensions.input.height,
    paddingHorizontal: dimensions.spacing.md,
  },
  
  input: {
    flex: 1,
    fontSize: dimensions.fontSize.md,
    color: colors.text,
  },
  
  multiline: {
    textAlignVertical: 'top',
    paddingTop: dimensions.spacing.sm,
  },
  
  eyeIcon: {
    padding: dimensions.spacing.xs,
  },
  
  // States
  focused: {
    borderColor: colors.primary,
  },
  
  error: {
    borderColor: colors.error,
  },
  
  disabled: {
    backgroundColor: colors.background,
    opacity: 0.6,
  },
  
  errorText: {
    fontSize: dimensions.fontSize.sm,
    color: colors.error,
    marginTop: dimensions.spacing.xs,
  },
});