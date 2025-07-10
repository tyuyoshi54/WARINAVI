import { StyleSheet } from 'react-native';
import { colors, dimensions } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: dimensions.spacing.lg,
  },
  
  header: {
    alignItems: 'center',
    marginBottom: dimensions.spacing.xxl,
  },
  
  title: {
    fontSize: dimensions.fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: dimensions.spacing.sm,
  },
  
  subtitle: {
    fontSize: dimensions.fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  form: {
    backgroundColor: colors.surface,
    borderRadius: dimensions.borderRadius.lg,
    padding: dimensions.spacing.lg,
    marginBottom: dimensions.spacing.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  footer: {
    alignItems: 'center',
  },
  
  footerText: {
    fontSize: dimensions.fontSize.md,
    color: colors.textSecondary,
    marginBottom: dimensions.spacing.md,
    textAlign: 'center',
  },
});