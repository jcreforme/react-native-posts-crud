import { StyleSheet, View } from 'react-native';
import { PostsList } from '../../components/posts-list';

export default function PostsScreen() {
  return (
    <View style={styles.container}>
      <PostsList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
