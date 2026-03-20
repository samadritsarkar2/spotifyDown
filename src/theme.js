import { StyleSheet, Dimensions } from 'react-native';

const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

// ─── Colors ──────────────────────────────────────────
export const colors = {
  bg: {
    primary: '#181818',
    secondary: '#212326',
    card: '#111111',
    elevated: '#1e1e1e',
  },
  accent: {
    primary: '#1DB954',
    info: '#3B82F6',
    warning: '#F59E0B',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B3B3B3',
    tertiary: '#9CA3AF',
    hint: '#6B7280',
  },
  status: {
    error: '#EF4444',
    success: '#1DB954',
  },
  overlay: 'rgba(0,0,0,0.50)',
  border: '#2A2A2A',
};

// ─── Spacing (4px base grid) ─────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ─── Typography ──────────────────────────────────────
export const fonts = {
  heading: 'GothamRoundedMedium',
  body: 'GothamRoundedBook',
  secondary: 'GothamMedium',
  nav: 'OpenSans-SemiBold',
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 28,
  display: 36,
};

// ─── Radii ───────────────────────────────────────────
export const radii = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 30,
};

// ─── Common Styles ───────────────────────────────────
export const commonStyles = StyleSheet.create({
  // Layout
  screenContainer: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  card: {
    backgroundColor: colors.bg.card,
    borderRadius: radii.md,
    padding: spacing.md,
  },

  // Track list items
  trackRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: windowHeight * 0.07,
  },
  trackArtwork: {
    height: '90%',
    aspectRatio: 1,
    alignSelf: 'center',
    borderRadius: radii.sm,
  },
  trackTitle: {
    color: colors.text.primary,
    fontSize: fontSize.lg,
    fontFamily: fonts.body,
  },
  trackSubtitle: {
    color: colors.text.tertiary,
    fontSize: 12,
    fontFamily: fonts.heading,
  },
  trackDetails: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },

  // Icon buttons (play, pause, more, download, etc.)
  iconButton: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonWrapper: {
    marginHorizontal: 5,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  // Green CTA button
  primaryButton: {
    justifyContent: 'center',
    height: 50,
    width: '60%',
    borderRadius: radii.pill,
    alignSelf: 'center',
    marginTop: spacing.lg,
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.xl,
  },
  primaryButtonText: {
    color: colors.text.primary,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: fontSize.lg + 1,
    fontFamily: fonts.heading,
    textTransform: 'uppercase',
  },

  // Playlist card (Downloads, SavedPlaylists)
  playlistCard: {
    marginVertical: spacing.sm,
    paddingVertical: spacing.xs + 1,
    paddingHorizontal: spacing.xs + 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.card,
    borderRadius: radii.md,
  },
  playlistCardImage: {
    flex: 1.3,
    marginLeft: 7,
    marginRight: 12,
    height: '100%',
    aspectRatio: 1,
    alignSelf: 'center',
    padding: spacing.sm,
  },
  playlistCardName: {
    color: colors.text.primary,
    fontSize: fontSize.md + 1,
    fontFamily: fonts.heading,
  },
  playlistCardCount: {
    color: colors.text.secondary,
    fontSize: fontSize.sm + 1,
    fontFamily: fonts.heading,
    paddingRight: 7,
  },

  // Empty state
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyStateTitle: {
    color: colors.text.primary,
    fontSize: fontSize.xl,
    fontFamily: fonts.heading,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    color: colors.text.secondary,
    fontSize: fontSize.md,
    fontFamily: fonts.body,
    textAlign: 'center',
  },

  // Section heading
  sectionHeader: {
    color: colors.accent.primary,
    fontFamily: fonts.heading,
    fontSize: fontSize.display,
    alignSelf: 'center',
  },

  // List footer gap (above tab bar)
  listFooterGap: {
    height: windowHeight * 0.07,
  },

  // Bottom sheet modal
  bottomSheetOverlay: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomSheetContainer: {
    height: windowHeight * 0.15,
    backgroundColor: colors.bg.primary,
    paddingHorizontal: spacing.sm,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
  },
  bottomSheetOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  bottomSheetOptionIcon: {
    width: 20,
    height: 20,
  },
  bottomSheetOptionText: {
    color: colors.text.primary,
    fontSize: fontSize.md,
    fontFamily: fonts.heading,
    marginLeft: spacing.md,
  },
});
