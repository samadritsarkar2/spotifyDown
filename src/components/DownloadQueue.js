import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Spinner from 'react-native-spinkit';
import { useSelector } from 'react-redux';
import { selectPlaylistState } from '../redux/selectors';
import { commonStyles, colors, fonts, fontSize, spacing } from '../theme';
import EmptyState from './shared/EmptyState';
import TrackRow from './shared/TrackRow';

const DownloadQueue = () => {
  const state = useSelector(selectPlaylistState);
  const navigation = useNavigation();
  const { downloadQueue, currentDownloading, downloadPercent, downloadSize } = state;

  if (downloadQueue.length === 0) {
    return (
      <View style={commonStyles.screenContainer}>
        <EmptyState
          title="Queue is empty"
          subtitle="Currently downloading tracks will appear here"
          actionLabel="Add New"
          onAction={() => navigation.navigate('NewStack', { screen: 'New' })}
        />
      </View>
    );
  }

  return (
    <View style={[commonStyles.screenContainer, { margin: spacing.sm }]}>
      <FlatList
        data={downloadQueue}
        keyExtractor={(item) => item.id?.toString()}
        ItemSeparatorComponent={() => <View style={commonStyles.listSeparator} />}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(Math.min(index, 10) * 50).duration(300)}>
            <TrackRow
              artwork={item.artwork}
              title={item.title}
              subtitle={item.album}
              rightElement={
                currentDownloading[0]?.id === item.id ? (
                  <Text style={{ color: colors.text.primary, fontSize: fontSize.md, fontFamily: fonts.secondary }}>
                    {parseInt(downloadPercent)} % of {downloadSize}
                  </Text>
                ) : (
                  <Spinner size={30} type="Circle" color={colors.text.primary} />
                )
              }
            />
          </Animated.View>
        )}
        ListFooterComponent={<View style={commonStyles.listFooterGap} />}
      />
    </View>
  );
};

export default DownloadQueue;
