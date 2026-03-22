import React from 'react';
import { StyleSheet, View, Text, ScrollView, Linking, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { colors, fonts, fontSize, spacing, radii } from '../theme';

const KnowMore = ({ isModalVisible, toggleModal }) => {
  const handleLink = (link) => {
    Linking.openURL(link).catch(() => {});
  };

  return (
    <Modal
      isVisible={isModalVisible}
      onBackButtonPress={toggleModal}
      onBackdropPress={toggleModal}>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <Text style={styles.title}>Latest Updates</Text>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroller}>
            <Section title="Changelog v1.98">
              <Bullet bold="Backend">
                Completely changed the backend. Changed how tracks are downloaded and sourced, significantly decreasing errors.
              </Bullet>
              <Bullet bold="Player">
                Tap on the mini-player while a track is playing to reveal the sleek-clean Player screen. Seek feature is now unlocked.
              </Bullet>
              <Bullet bold="Faster Downloads">
                Downloads are at least 69% faster than previous versions.
              </Bullet>
              <Bullet bold="UI Changes">
                Many major and minor changes — fonts, color, little tweaks and better animations.
              </Bullet>
              <Bullet bold="Downloaded Playlists Screen">
                Now displays the number of tracks downloaded. Long tap to open in search.
              </Bullet>
            </Section>

            <Section title="Known Issues">
              <Bullet>While tracks are downloading, do not open another playlist in search — it will mix up playlists.</Bullet>
              <Bullet>Some tracks may not be found on YT Music. Use the custom downloader as a fallback.</Bullet>
              <Bullet>Encounter something else? Feel free to report an issue or DM me.</Bullet>
            </Section>

            <Section title="How to use?">
              <Bullet>1. Copy the link of the Playlist/Album you want to download.</Bullet>
              <Bullet>2. Paste the link in the Download screen.</Bullet>
              <Bullet>3. You can save the Playlist in Library for later.</Bullet>
              <Bullet>4. Downloaded tracks will be in Downloads. Tap to play or long tap to add to queue.</Bullet>
            </Section>

            <Section title="How it Works?">
              <Text style={styles.body}>
                The app searches songs from your playlist in YouTube Music and downloads the most accurate result.{' '}
                <Text style={styles.link} onPress={() => handleLink('https://github.com/samadritsarkar2/spotifydown')}>
                  View on GitHub
                </Text>
              </Text>
            </Section>

            <Section title="Dev">
              <Text style={[styles.body, { fontWeight: 'bold' }]}>
                @samadritsarkar2 —{' '}
                <Text style={styles.link} onPress={() => handleLink('https://github.com/samadritsarkar2')}>GitHub</Text>,{' '}
                <Text style={styles.link} onPress={() => handleLink('https://instagram.com/samadritsarkar2')}>Insta</Text>,{' '}
                <Text style={styles.link} onPress={() => handleLink('https://twitter.com/samadritsarkar2')}>Twitter</Text>
              </Text>
            </Section>
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Bullet = ({ bold, children }) => (
  <Text style={styles.body}>
    {'\u25CF '}
    {bold && <Text style={{ fontWeight: 'bold' }}>{bold}: </Text>}
    {children}
  </Text>
);

export default KnowMore;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.bg.elevated,
    height: '70%',
    width: '95%',
    borderRadius: radii.md,
    padding: spacing.md,
  },
  title: {
    alignSelf: 'center',
    fontFamily: fonts.heading,
    fontSize: fontSize.xxl,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  scroller: {
    flex: 1,
  },
  section: {
    marginVertical: spacing.sm,
  },
  sectionTitle: {
    color: colors.accent.primary,
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    fontFamily: fonts.heading,
    marginBottom: spacing.xs,
  },
  body: {
    fontSize: fontSize.sm + 1,
    fontFamily: fonts.body,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  link: {
    color: colors.accent.info,
  },
  closeButton: {
    backgroundColor: colors.accent.primary,
    borderRadius: radii.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  closeButtonText: {
    color: colors.text.primary,
    fontFamily: fonts.heading,
    fontSize: fontSize.md,
  },
});
