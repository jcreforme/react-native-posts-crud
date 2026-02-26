import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PostsList } from '@/components/posts-list';

export default function PostsScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Posts Feed</ThemedText>
        <ThemedText style={styles.subtitle}>
          Data from dummy-backend
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.content}>
        <PostsList />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
});
