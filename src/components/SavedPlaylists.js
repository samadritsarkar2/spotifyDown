import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import allActions from '../redux/actions/index';
import { getStorage } from '../utils/storage';
import { commonStyles, spacing } from '../theme';
import EmptyState from './shared/EmptyState';
import LoadingScreen from './shared/LoadingScreen';
import PlaylistCard from './shared/PlaylistCard';

const SavedPlaylists = () => {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      retrieveSaved();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const retrieveSaved = async () => {
    try {
      const retrieved = await getStorage('@saved_playlists');
      setSaved(retrieved);
    } catch (error) {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (id) => {
    dispatch(allActions.addNew(id));
    navigation.navigate('NewStack', { screen: 'Playlist' });
  };

  if (loading) {
    return (
      <View style={commonStyles.screenContainer}>
        <LoadingScreen type="Circle" />
      </View>
    );
  }

  return (
    <View style={[commonStyles.screenContainer, { paddingHorizontal: spacing.sm }]}>
      <FlatList
        data={saved}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="Nothing saved yet"
            subtitle="Save a playlist to access it quickly later"
            actionLabel="Download"
            onAction={() => navigation.navigate('NewStack', { screen: 'New' })}
          />
        }
        renderItem={({ item }) => (
          <PlaylistCard
            image={item.image}
            name={item.name}
            onPress={() => handleClick(item.id)}
          />
        )}
      />
    </View>
  );
};

export default SavedPlaylists;
