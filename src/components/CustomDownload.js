import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { searchYouTube } from '../common/YouTubeExtractor';
import { selectCustomItemData } from '../redux/selectors';
import { addToDownloadQueue } from '../redux/actions/playlistActions';
import { windowHeight } from '../common';
import { colors, fonts, fontSize, spacing, radii, commonStyles } from '../theme';
import LoadingScreen from './shared/LoadingScreen';

const CustomDownload = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const single = useSelector(selectCustomItemData);

  const doFetch = async () => {
    try {
      const artistNames = single.artist.map(a => a.name);
      const query = `${single.title} ${artistNames.join(' ')} ${single.album}`;
      const results = await searchYouTube(query, 15);
      setData(results);
    } catch (e) {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    doFetch();
  }, []);

  const handleClick = (item) => {
    single.customDownloadData = item;
    dispatch(addToDownloadQueue(single));
  };

  if (loading) {
    return (
      <View style={[commonStyles.screenContainer, { paddingTop: spacing.sm }]}>
        <LoadingScreen type="Circle" size={40} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headingText}>Select any video to download</Text>
        <Text style={styles.subtitleText}>The videos are sorted in descending order of views</Text>
      </View>
      <View style={{ flex: 1, marginHorizontal: spacing.sm - 1 }}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => item.videoId?.toString() || index.toString()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={commonStyles.listFooterGap} />}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleClick(item)}>
              <View style={styles.videoRow}>
                <Image style={styles.thumbnail} source={{ uri: item.thumbnail }} />
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.durationText}>{item.duration_string}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default CustomDownload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    paddingTop: spacing.sm,
    justifyContent: 'center',
  },
  header: {
    padding: spacing.md,
  },
  headingText: {
    alignSelf: 'center',
    color: colors.text.primary,
    fontSize: fontSize.lg,
    fontFamily: fonts.heading,
  },
  subtitleText: {
    color: colors.text.hint,
    fontSize: fontSize.sm,
    fontFamily: fonts.secondary,
    alignSelf: 'center',
  },
  videoRow: {
    flexDirection: 'row',
    minHeight: windowHeight * 0.085,
    paddingVertical: spacing.xs / 2,
    marginVertical: spacing.sm - 1,
    alignItems: 'flex-start',
    backgroundColor: colors.bg.card,
    borderRadius: radii.md,
  },
  thumbnail: {
    flex: 1,
    marginRight: spacing.sm,
    height: '95%',
    aspectRatio: 1,
    alignSelf: 'center',
    borderRadius: radii.sm,
  },
  titleText: {
    flex: 4,
    color: colors.text.primary,
    fontSize: fontSize.md,
    fontFamily: fonts.body,
    marginHorizontal: spacing.xs / 2,
    alignSelf: 'center',
  },
  durationText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: fontSize.md,
    fontFamily: fonts.heading,
    alignSelf: 'center',
    marginLeft: spacing.xs,
  },
});
