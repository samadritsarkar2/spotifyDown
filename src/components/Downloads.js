import React from 'react';
import { View, Vibration, FlatList, RefreshControl } from 'react-native';
import allActions from '../redux/actions/index';
import { windowHeight } from '../common';
import { commonStyles, colors, spacing } from '../theme';
import { useDownloads } from '../hooks/useDownloads';
import EmptyState from './shared/EmptyState';
import LoadingScreen from './shared/LoadingScreen';
import PlaylistCard from './shared/PlaylistCard';

const Downloads = ({ navigation }) => {
  const { loading, playlists, data, onRefresh, dispatch } = useDownloads();

  if (loading) {
    return (
      <View style={commonStyles.screenContainer}>
        <LoadingScreen type="9CubeGrid" />
      </View>
    );
  }

  if (playlists.length === 0) {
    return (
      <View style={commonStyles.screenContainer}>
        <EmptyState
          title="Your library is empty"
          subtitle="Download your first playlist to get started"
          actionLabel="Add New"
          onAction={() => navigation.navigate('NewStack', { screen: 'New' })}
        />
      </View>
    );
  }

  return (
    <View style={[commonStyles.screenContainer, { paddingHorizontal: spacing.sm + 4, marginTop: spacing.sm }]}>
      <FlatList
        data={playlists}
        keyExtractor={(item, index) => item?.toString() || index.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
        ListFooterComponent={<View style={commonStyles.listFooterGap} />}
        renderItem={({ item }) => (
          <PlaylistCard
            image={data[item].info.image}
            name={data[item].info.name}
            trackCount={data[item].tracks.length}
            onPress={() => {
              dispatch({ type: 'SET_ACTIVE_PLAYLIST', payload: item });
              navigation.navigate('TracksView');
            }}
            onLongPress={() => {
              dispatch(allActions.addNew(item));
              Vibration.vibrate(300);
              navigation.navigate('NewStack', { screen: 'Playlist' });
            }}
          />
        )}
      />
    </View>
  );
};

export default Downloads;
